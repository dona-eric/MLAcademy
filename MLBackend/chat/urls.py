from django.urls import path
from .views import CopilotAutocompleteView, GlobalAssistantView

urlpatterns = [
    path('autocomplete/', CopilotAutocompleteView.as_view(), name='chat-autocomplete'),
    path('global/', GlobalAssistantView.as_view(), name='chat-global'),
]
