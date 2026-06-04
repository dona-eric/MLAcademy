"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('access_token'));
    }
  }, [user]);

  // Initial fetch of notifications
  useEffect(() => {
    if (!user || !token) {
      // eslint-disable-next-line
      setNotifications([]);
      // eslint-disable-next-line
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/private/learning/notifications/", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Adjust this depending on your API structure (e.g. data.results if paginated)
          const notifs = data.results || data;
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user, token]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!user || !token) return;

    // Connect to WebSocket, pass token in query string since ASGI needs auth
    // Note: ensure your ASGI middleware handles token from query if it's not sending cookies
    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === "notification") {
        const newNotif = parsed.data;
        setNotifications((prev) => {
          // Prevent duplicates
          if (prev.find(n => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
        if (!newNotif.is_read) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [user, token]);

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/private/learning/notifications/${id}/mark_as_read/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/private/learning/notifications/mark_all_as_read/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications((prev) => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
