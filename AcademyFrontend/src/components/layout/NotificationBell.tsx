"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import Link from "next/link";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[var(--bg-base)] animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-hidden bg-[#0A0F1C] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 className="font-bold text-sm text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Tout marquer lu
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune notification pour le moment.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={"p-4 transition-colors hover:bg-white/5 ${!notif.is_read ? 'bg-indigo-500/5' : ''}"}
                  >
                    <div className="flex gap-3">
                      {/* Indicator */}
                      <div className="mt-1.5 shrink-0">
                        <div className={"w-2 h-2 rounded-full ${notif.is_read ? 'bg-slate-700' : 'bg-indigo-500'}"} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <p className={"text-sm ${notif.is_read ? 'text-slate-300' : 'text-white font-medium'}"}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {new Date(notif.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>

                          {notif.action_url && (
                            <Link
                              href={notif.action_url}
                              onClick={() => handleNotificationClick(notif)}
                              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              Voir
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
