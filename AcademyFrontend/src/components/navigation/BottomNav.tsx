"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User } from "lucide-react";

const NAV_ITEMS = [
  { name: "Accueil",  href: "/dashboard", icon: Home },
  { name: "Explorer", href: "/parcours",  icon: Compass },
  { name: "Apprendre",href: "/learning",  icon: BookOpen },
  { name: "Profil",   href: "/profile",   icon: User },
];

function NavItem({ name, href, icon: Icon, isActive }: { name: string; href: string; icon: any; isActive: boolean }) {
  return (
    <Link href={href} className="relative flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all duration-300 group">
      {isActive && (
        <div className="absolute -top-1 w-8 h-[3px] bg-indigo-600 shadow-sm rounded-full" />
      )}
      <div className={`p-1 rounded-lg transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
        <Icon className={`h-6 w-6 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
      </div>
      <span className={`text-[9px] uppercase tracking-widest font-black transition-colors ${isActive ? "text-indigo-600" : "text-slate-500"}`}>
        {name}
      </span>
      {isActive && <div className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10 blur-sm" />}
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
      <div className="mx-auto max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-lg pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-around py-3 px-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}