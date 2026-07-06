"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, MonitorPlay, Award, Play, BarChart3,
  MessageSquare, Palette, FolderOpen, Settings, ChevronRight,
  ChevronDown, Box, User as UserIcon, LogOut, Sparkles
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

const STUDIO_NAV: NavItem[] = [
  { name: "Dashboard", href: "/studio", icon: LayoutDashboard },
  {
    name: "Contenu",
    href: "/studio/courses",
    icon: MonitorPlay,
    children: [
      { name: "Formations", href: "/studio/courses", icon: MonitorPlay },
      { name: "Certifications", href: "/studio/certifications", icon: Award },
      { name: "Tutoriels", href: "/studio/tutos", icon: Play },
    ],
  },
  { name: "Analytics", href: "/studio/analytics", icon: BarChart3 },
  { name: "Peer Reviews", href: "/studio/peer-reviews", icon: MessageSquare },
  { name: "Personnalisation", href: "/studio/customization", icon: Palette },
  { name: "Ressources", href: "/studio/resources", icon: FolderOpen },
  { name: "Paramètres", href: "/studio/settings", icon: Settings },
];

function StudioNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || (item.href !== "/studio" && pathname.startsWith(item.href + "/"));
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some(c => pathname === c.href || pathname.startsWith(c.href + "/"));
  const [expanded, setExpanded] = useState(isActive || isChildActive);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200 ${
            isChildActive
              ? "text-white bg-white/[0.06]"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className={`h-[18px] w-[18px] ${isChildActive ? "text-indigo-400" : "text-slate-500"}`} />
            <span className="text-[13px] font-semibold">{item.name}</span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="ml-5 mt-1 space-y-0.5 border-l border-white/[0.06] pl-4">
            {item.children!.map((child) => {
              const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200 ${
                    childActive
                      ? "text-indigo-400 bg-indigo-500/[0.08]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                  }`}
                >
                  <child.icon className={`h-4 w-4 ${childActive ? "text-indigo-400" : "text-slate-600"}`} />
                  <span className="text-[12px] font-medium">{child.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200 group relative ${
        isActive
          ? "text-white bg-white/[0.06]"
          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon className={`h-[18px] w-[18px] transition-colors ${
          isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
        }`} />
        <span className="text-[13px] font-semibold">{item.name}</span>
      </div>
      {isActive && (
        <>
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-indigo-500 rounded-r-full" />
          <ChevronRight className="w-3.5 h-3.5 text-indigo-400/50" />
        </>
      )}
    </Link>
  );
}

export default function StudioSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex w-[260px] flex-col bg-[#0B0E18] border-r border-white/[0.06] h-full">

      {/* Profile Section */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/studio" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="relative w-11 h-11 rounded-full object-cover border-2 border-white/10 group-hover:border-indigo-500/50 transition-colors"
              />
            ) : (
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-2 border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-slate-500 leading-none">Votre chaîne</span>
            <span className="text-[14px] font-bold text-white truncate mt-0.5">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
            </span>
          </div>
        </Link>
      </div>

      <div className="h-px bg-white/[0.06] mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {STUDIO_NAV.map((item) => (
          <StudioNavLink key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-2 border-t border-white/[0.06] pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-all bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/[0.05]"
        >
          <Box className="h-4 w-4" />
          Retour Apprenant
        </Link>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[12px] font-medium text-slate-500 hover:bg-rose-500/[0.08] hover:text-rose-400 transition-all group"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
