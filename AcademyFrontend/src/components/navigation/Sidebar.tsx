"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User, Settings, BarChart3, LogOut, LayoutDashboard, MonitorPlay, Users, Sparkles, ChevronRight, Play, Award, Box, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = {
  instructor: [
    { name: "Espace Studio",   href: "/instructor",                  icon: LayoutDashboard },
    { name: "Mes Formations",  href: "/instructor/courses",           icon: MonitorPlay },
    { name: "Certifications",  href: "/instructor/certifications",    icon: Award },
    { name: "Tutoriels & Live",href: "/instructor/tutos",             icon: Play },
    { name: "Mes Étudiants",   href: "/instructor/students",          icon: Users },
    { name: "Peer-Reviews",    href: "/instructor/peer-reviews",      icon: Sparkles },
    { name: "Settings",        href: "/instructor/settings",          icon: Settings },
  ],
  learner: [
    { name: "Dashboard",       href: "/dashboard",                    icon: Home },
    { name: "Catalogue",       href: "/parcours",                     icon: Compass },
    { name: "Mes Cours",       href: "/dashboard/courses",            icon: BookOpen },
    { name: "Certifications",  href: "/dashboard/certifications",     icon: Award },
    { name: "Notes & Résultats",href: "/dashboard/grades",            icon: BarChart3 },
    { name: "Messages",        href: "/dashboard/messages",           icon: Users },
    { name: "Profil",          href: "/profile",                      icon: User },
    { name: "Paramètres",      href: "/settings",                     icon: Settings },
  ],
};

function NavLink({ name, href, icon: Icon, isActive } : { name: string; href: string; icon: any; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between group rounded-xl px-4 py-3 transition-all duration-300 relative overflow-hidden ${
        isActive ? "text-cyan-400 bg-cyan-500/5" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <Icon className={`h-5 w-5 transition-all duration-300 ${
          isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-slate-500 group-hover:text-slate-300"
        }`} />
        <span className={`text-sm tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>{name}</span>
      </div>
      {isActive && (
        <>
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" />
          <ChevronRight className="w-4 h-4 text-cyan-400/50 relative z-10" />
        </>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isInstructorSpace = pathname.startsWith("/instructor");
  const items = NAV_ITEMS[isInstructorSpace ? "instructor" : "learner"];

  return (
    <aside className="hidden md:flex w-72 flex-col px-6 py-10 z-20 bg-[#0a0c10] border-r border-white/5 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">

      {/* Brand */}
      <div className="mb-12 px-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-[#0f1218] border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white">ML<span className="text-cyan-500">ACADEMY</span></span>
            {isInstructorSpace && (
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none">Studio Space</span>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
        <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/60">Intelligence Menu</p>
        {items.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={pathname === item.href || (item.href !== "/instructor" && pathname.startsWith(item.href + "/"))}
          />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-8 space-y-3 border-t border-white/5">
        {user?.is_instructor && (
          <Link
            href={isInstructorSpace ? "/dashboard" : "/instructor"}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border ${
              isInstructorSpace
                ? "bg-white text-black border-white hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "bg-[#0f1218] text-cyan-400 border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            }`}
          >
            <Box className="h-4 w-4" />
            {isInstructorSpace ? "Switch to Learner" : "Instructor Studio"}
          </Link>
        )}

        {(user?.is_staff || user?.is_superuser) && (
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20">
            <ShieldCheck className="h-4 w-4" /> System Admin
          </Link>
        )}

        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 group">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}