"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Zap, Target, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  deadline: <Clock   className="h-4 w-4 text-rose-500" />,
  grade:    <Zap     className="h-4 w-4 text-emerald-500" />,
  message:  <BookOpen className="h-4 w-4 text-indigo-500" />,
};

const API = {
  list:    "/api/private/learning/notifications/",
  read:    (id: number) => `/api/private/learning/notifications/${id}/mark_as_read/`,
  readAll: "/api/private/learning/notifications/mark_all_as_read/",
};

function NotificationItem({ n, onRead }: { n: any; onRead: (id: number) => void }) {
  return (
    <div
      onClick={() => !n.is_read && onRead(n.id)}
      className={`p-3 rounded-2xl flex items-start gap-4 transition-all cursor-pointer ${
        n.is_read ? "opacity-60 grayscale-[0.5]" : "bg-indigo-50/50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
      }`}
    >
      <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
        {TYPE_ICONS[n.type] ?? <Target className="h-4 w-4 text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-900 truncate">{n.title}</p>
        <p className="text-[9px] text-slate-500 line-clamp-2 mt-0.5">{n.content}</p>
        <p className="text-[8px] font-medium text-slate-400 mt-2 uppercase tracking-tighter">
          {new Date(n.created_at).toLocaleDateString()}
        </p>
      </div>
      {!n.is_read && <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />}
    </div>
  );
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const load = async () => {
    try {
      const data = await fetchApi(API.list);
      setNotifications(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetchApi(API.read(id), { method: "POST" });
      load();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi(API.readAll, { method: "POST" });
      load();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  useEffect(() => {
    load();
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} type="button" className="relative -m-2.5 p-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
        <span className="sr-only">Voir les notifications</span>
        <Bell className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 origin-top-right rounded-[24px] bg-white p-4 shadow-2xl ring-1 ring-slate-900/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                Tout lire
              </button>
            )}
          </div>

          <div className="mt-2 max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-slate-100 mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rien à signaler</p>
              </div>
            ) : (
              notifications.map((n) => <NotificationItem key={n.id} n={n} onRead={markAsRead} />)
            )}
          </div>

          {notifications.length > 0 && (
            <div className="pt-4 border-t border-slate-50 mt-2 text-center">
              <Link href="/dashboard/notifications" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                Voir l'historique complet
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}