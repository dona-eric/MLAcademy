from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from users.models import Notification
from learning.serializers import NotificationSerializer
from firebase_admin import messaging

@receiver(post_save, sender=Notification)
def send_notification_to_channel(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_name = f'user_{instance.user.id}_notifications'
        
        serializer = NotificationSerializer(instance)
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'notification_message',
                'message': serializer.data
            }
        )
        
        # Envoi des notifications Push (FCM)
        from users.models import FCMDevice
        devices = FCMDevice.objects.filter(user=instance.user)
        for device in devices:
            send_push_notification(
                fcm_token=device.token,
                title=instance.title,
                body=instance.content,
                data_payload={'link': instance.link} if instance.link else {}
            )


def send_push_notification(fcm_token, title, body, data_payload=None):
    """
    Envoie une notification push à un appareil spécifique (Web ou Mobile) 
    via son token FCM enregistré en base de données.
    """
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data=data_payload or {}, # Données optionnelles lues par l'application (ex: id du cours)
        token=fcm_token,
    )
    
    try:
        response = messaging.send(message)
        print('Notification envoyée avec succès, ID:', response)
        return True
    except Exception as e:
        print("Échec de l'envoi de la notification:", e)
        return False