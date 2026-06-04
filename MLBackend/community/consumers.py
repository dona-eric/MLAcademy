import json
import re
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Channel, ChannelMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
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
