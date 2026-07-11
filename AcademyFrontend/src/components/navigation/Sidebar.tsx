"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NotepadText} from "lucide-react";
import { Home, Compass, BookOpen, User, Settings, LogOut, LayoutDashboard, MonitorPlay, Users, Sparkles, ChevronRight, Play, Award, Box, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = {
  instructor: [
    { name: "Espace Studio",   href: "/studio",                   icon: LayoutDashboard },
    { name: "Mes Formations",  href: "/studio/courses",           icon: MonitorPlay },
    { name: "Certifications",  href: "/studio/certifications",    icon: Award },
    { name: "Tutoriels & Live",href: "/studio/tutos",             icon: Play },
    { name: "Mes Étudiants",   href: "/studio/students",          icon: Users },
    { name: "Peer-Reviews",    href: "/studio/peer-reviews",      icon: Sparkles },
    { name: "Settings",        href: "/studio/settings",          icon: Settings },
  ],
  learner: [
    { name: "Dashboard",       href: "/dashboard",                    icon: Home },
    { name: "Catalogue",       href: "/parcours",                     icon: Compass },
    { name: "Mes Cours",       href: "/dashboard/courses",            icon: BookOpen },
    { name: "Certifications",  href: "/dashboard/certifications",     icon: Award },
    { name: "Notes & Résultats",href: "/dashboard/grades",            icon: NotepadText },
    { name: "Messages",        href: "/dashboard/messages",           icon: Users },
    { name: "Profil",          href: "/profile",                      icon: User },
    { name: "Paramètres",      href: "/settings",                     icon: Settings },
  ],
};

function NavLink({ name, href, icon: Icon, isActive } : { name: string; href: string; icon: any; isActive: boolean }) {
  return (
    <Link
      href={href}
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
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
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
          </Link>
        )}

        {(user?.is_staff || user?.is_superuser) && (
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors bg-[var(--warning-light)] text-[var(--warning)] hover:bg-amber-100 border border-amber-200">
            <ShieldCheck className="h-4 w-4" /> System Admin
          </Link>
        )}

        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors text-[var(--text-secondary)] hover:bg-[var(--error-light)] hover:text-[var(--error)] group cursor-pointer">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}