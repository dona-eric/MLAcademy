"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Target, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  deadline: <Clock    className="h-4 w-4 text-red-500" />,
  grade:    <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  message:  <BookOpen className="h-4 w-4 text-indigo-500" />,
};

const API = {
  list:    "/api/private/learning/notifications/",
  read:    (id: number) => `/api/private/learning/notifications/${id}/mark_as_read/`,
  readAll: "/api/private/learning/notifications/mark_all_as_read/",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function NotificationItem({ n, onRead }: { n: any; onRead: (id: number) => void }) {
  return (
    <div
      onClick={() => !n.is_read && onRead(n.id)}
      className={`p-3 rounded-lg flex items-start gap-3 transition-all cursor-pointer ${
        n.is_read
          ? "opacity-60"
          : "bg-indigo-50/50 hover:bg-indigo-50"
      }`}
    >
      <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
        {TYPE_ICONS[n.type] ?? <Target className="h-4 w-4 text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{n.content}</p>
        <p className="text-[10px] font-medium text-slate-400 mt-1.5">
          {timeAgo(n.created_at)}
        </p>
      </div>
      {!n.is_read && <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
    </div>
  );
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const load = async () => {
    // Guard: Don't attempt to fetch if user is not authenticated
    if (!user) return;
    try {
      const data = await fetchApi(API.list);
      setNotifications(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (err) {
      // Silently handle auth errors — user may have logged out
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetchApi(API.read(id), { method: "POST" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi(API.readAll, { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  useEffect(() => {
    // Only load when user is authenticated
    if (user) {
      load();
      // Poll every 60s for new notifications
      const interval = setInterval(load, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render the bell at all if user is not authenticated
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} type="button" className="relative -m-2.5 p-2.5 text-slate-400 hover:text-slate-600 transition-colors">
        <span className="sr-only">Voir les notifications</span>
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white p-4 shadow-lg border border-slate-200 z-50">
          <div className="flex items-center justify-between px-1 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="mt-2 max-h-80 overflow-y-auto space-y-1">
            {notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-slate-200 mx-auto" />
                <p className="text-xs font-medium text-slate-400">Aucune notification</p>
              </div>
            ) : (
              notifications.map((n) => <NotificationItem key={n.id} n={n} onRead={markAsRead} />)
            )}
          </div>

          {notifications.length > 0 && (
            <div className="pt-3 border-t border-slate-100 mt-2 text-center">
              <Link href="/dashboard/notifications" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                Voir l'historique complet
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}