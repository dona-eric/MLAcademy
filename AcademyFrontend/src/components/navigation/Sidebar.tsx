"use client";
import Link from "next/link";
<<<<<<< HEAD
=======
import Image from "next/image";
>>>>>>> develop
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User, Settings, BarChart3, LogOut, LayoutDashboard, MonitorPlay, Users, Sparkles, ChevronRight, Play, Award, Box, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = {
  instructor: [
<<<<<<< HEAD
    { name: "Espace Studio",   href: "/instructor",                  icon: LayoutDashboard },
    { name: "Mes Formations",  href: "/instructor/courses",           icon: MonitorPlay },
    { name: "Certifications",  href: "/instructor/certifications",    icon: Award },
    { name: "Tutoriels & Live",href: "/instructor/tutos",             icon: Play },
    { name: "Mes Étudiants",   href: "/instructor/students",          icon: Users },
    { name: "Peer-Reviews",    href: "/instructor/peer-reviews",      icon: Sparkles },
    { name: "Settings",        href: "/instructor/settings",          icon: Settings },
=======
    { name: "Espace Studio",   href: "/studio",                   icon: LayoutDashboard },
    { name: "Mes Formations",  href: "/studio/courses",           icon: MonitorPlay },
    { name: "Certifications",  href: "/studio/certifications",    icon: Award },
    { name: "Tutoriels & Live",href: "/studio/tutos",             icon: Play },
    { name: "Mes Étudiants",   href: "/studio/students",          icon: Users },
    { name: "Peer-Reviews",    href: "/studio/peer-reviews",      icon: Sparkles },
    { name: "Settings",        href: "/studio/settings",          icon: Settings },
>>>>>>> develop
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
<<<<<<< HEAD
      className={`flex items-center justify-between group rounded-md px-3 py-2 transition-colors relative ${
        isActive ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 shrink-0 transition-colors ${
          isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
        }`} />
        <span className="text-sm">{name}</span>
      </div>
=======
      className={`flex items-center justify-between group rounded-xl px-4 py-3 transition-all relative ${
        isActive ? "text-[var(--brand-500)] bg-[var(--brand-50)]/50" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
      }`}
    >
      <div className="flex items-center gap-3.5 relative z-10">
        <Icon className={`h-5 w-5 transition-colors ${
          isActive ? "text-[var(--brand-500)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
        }`} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-sm tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}>{name}</span>
      </div>
      {isActive && (
        <ChevronRight className="w-4 h-4 text-[var(--brand-400)] relative z-10" strokeWidth={3} />
      )}
>>>>>>> develop
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

<<<<<<< HEAD
  const isInstructorSpace = pathname.startsWith("/instructor");
  const items = NAV_ITEMS[isInstructorSpace ? "instructor" : "learner"];

  return (
    <aside className="hidden md:flex w-64 flex-col px-4 py-8 z-20 bg-white">

      {/* Brand */}
      <div className="mb-8 px-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-slate-900 tracking-tight truncate">MLAcademy</span>
            {isInstructorSpace && (
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest truncate">Studio</span>
=======
  const isInstructorSpace = pathname.startsWith("/studio");
  const items = NAV_ITEMS[isInstructorSpace ? "instructor" : "learner"];

  return (
    <aside className="hidden md:flex w-72 flex-col px-5 py-8 z-20 bg-[var(--bg-primary)] border-r border-[var(--border-default)]">

      {/* Brand */}
      <div className="mb-10 px-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-default)] group-hover:border-[var(--brand-300)] transition-colors">
            <Image src="/images/mlacademy_logo_final.png" alt="MLAcademy Logo" fill sizes="40px" className="object-cover" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">ML<span className="text-[var(--brand-500)]">ACADEMY</span></span>
            {isInstructorSpace && (
              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider leading-none mt-0.5">Studio Space</span>
>>>>>>> develop
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
<<<<<<< HEAD
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-1">
        <p className="px-2 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
        {items.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={pathname === item.href || (item.href !== "/instructor" && pathname.startsWith(item.href + "/"))}
          />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 space-y-2 px-1">
        {user?.is_instructor && (
          <Link
            href={isInstructorSpace ? "/dashboard" : "/instructor"}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <Box className="h-4 w-4 shrink-0" />
            {isInstructorSpace ? "Mode Apprenant" : "Mode Instructeur"}
=======
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
        <p className="px-4 mb-3 text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Menu {isInstructorSpace ? "Formateur" : "Apprenant"}</p>
        {items.map((item) => {
          const isRootItem = item.href === "/dashboard" || item.href === "/studio";
          const isActive = isRootItem 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavLink
              key={item.href}
              {...item}
              isActive={isActive}
            />
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 space-y-3 border-t border-[var(--border-subtle)] px-2">
        {user?.is_instructor && (
          <Link
            href={isInstructorSpace ? "/dashboard" : "/studio"}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-500)] hover:border-[var(--brand-200)]"
          >
            <Box className="h-4 w-4" />
            {isInstructorSpace ? "Vue Apprenant" : "Espace Formateur"}
>>>>>>> develop
          </Link>
        )}

        {(user?.is_staff || user?.is_superuser) && (
<<<<<<< HEAD
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50">
            <ShieldCheck className="h-4 w-4 shrink-0" /> Administration
          </Link>
        )}

        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors text-slate-600 hover:text-rose-600 hover:bg-rose-50">
          <LogOut className="h-4 w-4 shrink-0" />
=======
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors bg-[var(--warning-light)] text-[var(--warning)] hover:bg-amber-100 border border-amber-200">
            <ShieldCheck className="h-4 w-4" /> System Admin
          </Link>
        )}

        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors text-[var(--text-secondary)] hover:bg-[var(--error-light)] hover:text-[var(--error)] group cursor-pointer">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
>>>>>>> develop
          Déconnexion
        </button>
      </div>
    </aside>
  );
}