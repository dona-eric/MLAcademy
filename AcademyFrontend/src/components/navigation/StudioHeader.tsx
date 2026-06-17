"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, HelpCircle, Plus, User as UserIcon,
  BookOpen, Award, Play, Puzzle, Upload, CalendarClock,
  ChevronDown, X
} from "lucide-react";
import NotificationBell from "./NotificationBell";

const CREATE_ITEMS = [
  { label: "Publier un Cours", desc: "Formation structurée complète", icon: BookOpen, href: "/studio/courses/create", color: "indigo" },
  { label: "Créer une Certification", desc: "Parcours certifiant officiel", icon: Award, href: "/studio/learning-paths/create", color: "emerald" },
  { label: "Créer un Tutoriel", desc: "Contenu court et technique", icon: Play, href: "/studio/tutos/create", color: "amber" },
  { label: "Créer un Module", desc: "Brique réutilisable de contenu", icon: Puzzle, href: "/studio/modules/create", color: "purple" },
  { divider: true },
  { label: "Importer un contenu", desc: "Dataset, notebook, slides", icon: Upload, href: "/studio/resources?action=upload", color: "cyan" },
  { label: "Programmer une publication", desc: "Planifier la mise en ligne", icon: CalendarClock, href: "/studio/courses?tab=scheduled", color: "rose" },
] as const;

function Avatar({ user }: { user: any }) {
  return user?.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={user.username}
      className="h-8 w-8 rounded-full object-cover border border-white/10"
    />
  ) : (
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
      <UserIcon className="h-4 w-4 text-slate-400" />
    </div>
  );
}

export default function StudioHeader() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
    }
    if (createOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [createOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-x-4 border-b border-white/[0.06] bg-[#0B0E18]/80 backdrop-blur-xl px-4 sm:px-6">

      {/* Logo */}
      <Link href="/studio" className="flex items-center gap-2 shrink-0 mr-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
          <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
        </div>
        <span className="text-[15px] font-black tracking-tight text-white hidden lg:block">
          ML<span className="text-indigo-400">ACADEMY</span>
          <span className="text-[10px] font-bold text-slate-500 ml-1.5">Studio</span>
        </span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-auto">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="search"
            placeholder="Rechercher sur votre chaîne"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-[13px] text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Help */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all" title="Aide">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Create Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              createOpen
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15]"
            }`}
          >
            {createOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Créer</span>
          </button>

          {/* Dropdown */}
          {createOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#141824] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {CREATE_ITEMS.map((item, i) => {
                  if ('divider' in item && item.divider) {
                    return <div key={i} className="h-px bg-white/[0.06] my-1.5" />;
                  }
                  const ci = item as typeof CREATE_ITEMS[0];
                  if ('divider' in ci) return null;
                  return (
                    <Link
                      key={i}
                      href={ci.href}
                      onClick={() => setCreateOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-${ci.color}-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <ci.icon className={`w-4 h-4 text-${ci.color}-400`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{ci.label}</p>
                        <p className="text-[11px] text-slate-500 truncate">{ci.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block h-5 w-px bg-white/[0.08] mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.04] transition-all group">
          <Avatar user={user} />
          <span className="hidden xl:block text-[13px] font-semibold text-white group-hover:text-indigo-400 transition-colors">
            {user?.first_name || user?.username}
          </span>
        </button>
      </div>
    </header>
  );
}
