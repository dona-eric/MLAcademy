import json
import re
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Channel, ChannelMessage, DirectConversation, DirectMessage
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """Consumer WebSocket pour les canaux de discussion publics."""

    async def connect(self):
        self.channel_id = self.scope['url_route']['kwargs']['channel_id']
        self.room_group_name = f'chat_{self.channel_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data.get('message')
        title = data.get('title')
        parent_id = data.get('parent_id')
        user = self.scope['user']

        if not user.is_authenticated:
            return

        # Save message to database
        saved_msg = await self.save_message(user, self.channel_id, message_content, title, parent_id)

        # Detect mentions (@username)
        mentions = re.findall(r'@(\w+)', message_content)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': saved_msg.id,
                    'user': user.id,
                    'title': saved_msg.title,
                    'content': saved_msg.content,
                    'parent': saved_msg.parent_id if saved_msg.parent else None,
                    'user_name': user.username,
                    'user_avatar': user.avatar.url if user.avatar else None,
                    'is_mentor': getattr(user, 'is_mentor', False),
                    'created_at': saved_msg.created_at.isoformat(),
                    'mentions': mentions
                }
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def save_message(self, user, channel_id, content, title=None, parent_id=None):
        channel = Channel.objects.get(id=channel_id)
        parent_msg = None
        if parent_id:
            try:
                parent_msg = ChannelMessage.objects.get(id=parent_id)
            except ChannelMessage.DoesNotExist:
                pass
        
        return ChannelMessage.objects.create(
            user=user,
            channel=channel,
            title=title,
            content=content,
            parent=parent_msg
        )


class DirectChatConsumer(AsyncWebsocketConsumer):
    """Consumer WebSocket pour les conversations directes privées (DM)."""

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'dm_{self.conversation_id}'
        user = self.scope['user']

        if not user.is_authenticated:
            await self.close()
            return

        # Vérifier que l'utilisateur est bien participant de la conversation
        is_participant = await self.check_participant(user, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('message')
        user = self.scope['user']

        if not user.is_authenticated or not content:
            return

        saved_msg = await self.save_direct_message(user, self.conversation_id, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'dm_message',
                'message': {
                    'id': saved_msg.id,
                    'sender': user.id,
                    'sender_name': user.username,
                    'sender_avatar': user.avatar.url if user.avatar else None,
                    'content': saved_msg.content,
                    'is_read': False,
                    'created_at': saved_msg.created_at.isoformat(),
                }
            }
        )

    async def dm_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

    @database_sync_to_async
    def check_participant(self, user, conversation_id):
        return DirectConversation.objects.filter(
            id=conversation_id, participants=user
        ).exists()

    @database_sync_to_async
    def save_direct_message(self, user, conversation_id, content):
        conversation = DirectConversation.objects.get(id=conversation_id)
        msg = DirectMessage.objects.create(
            conversation=conversation,
            sender=user,
            content=content
        )
        # Mettre à jour le timestamp de la conversation
        conversation.save(update_fields=['updated_at'])
        return msg
