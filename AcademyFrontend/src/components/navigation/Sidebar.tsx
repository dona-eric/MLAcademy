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
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
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
          </Link>
        )}

        {(user?.is_staff || user?.is_superuser) && (
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50">
            <ShieldCheck className="h-4 w-4 shrink-0" /> Administration
          </Link>
        )}

        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors text-slate-600 hover:text-rose-600 hover:bg-rose-50">
          <LogOut className="h-4 w-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}