import { useEffect, useState, useRef, useCallback } from 'react';

interface ChatMessage {
  id: number;
  user: number;
  title: string | null;
  content: string;
  parent: number | null;
  user_name: string;
  user_avatar: string | null;
  is_mentor: boolean;
  created_at: string;
  mentions: string[];
}

export function useChatWebSocket(channelId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  // Fonction pour ajouter un message à la liste s'il n'existe pas déjà (évite les doublons)
  const appendMessage = useCallback((newMsg: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
  }, []);

  useEffect(() => {
    if (!channelId) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Construit l'URL WebSocket
    // Assurez-vous d'utiliser l'URL du backend Django (ex: localhost:8000)
    // Ici on utilise REACT_APP_BACKEND_URL ou on hardcode localhost:8000 pour le dev
    const wsUrl = `ws://localhost:8000/ws/chat/${channelId}/?token=${token}`;

    console.log(`Connecting to WebSocket for channel ${channelId}...`);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        const msg = data.message;
        // Fix relative URLs from WebSocket
        if (msg.user_avatar && msg.user_avatar.startsWith('/media/')) {
          // Si REACT_APP_BACKEND_URL n'est pas défini, on utilise localhost:8000 par défaut
          msg.user_avatar = `http://localhost:8000${msg.user_avatar}`;
        }
        appendMessage(msg);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Optionnel : Logique de reconnexion automatique ici
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [channelId, appendMessage]);

  const sendMessage = useCallback((content: string, title?: string, parent_id?: number) => {
    if (ws.current && isConnected) {
      const payload: Record<string, unknown> = { message: content };
      if (title) payload.title = title;
      if (parent_id) payload.parent_id = parent_id;
      ws.current.send(JSON.stringify(payload));
    }
  }, [isConnected]);

  // Fonction pour charger l'historique initial des messages via HTTP
  const setInitialMessages = useCallback((initialMessages: ChatMessage[]) => {
    setMessages(initialMessages);
  }, []);

  return {
    messages,
    isConnected,
    sendMessage,
    setInitialMessages,
  };
}
