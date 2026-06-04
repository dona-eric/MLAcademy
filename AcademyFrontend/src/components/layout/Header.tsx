'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';
import './layout.css';

const NAV_LINKS = [
  { href: '/parcours', label: 'Formations' },
  { href: '/parcours?tab=paths', label: 'Certifications' },
  { href: '/communaute', label: 'Communauté' },
];

const getDashboardInfo = (user: any) => {
  if (user?.is_superuser || user?.is_staff) return { href: '/admin/dashboard', label: 'Admin' };
  if (user?.is_instructor) return { href: '/instructor', label: 'Espace Formateur' };
  return { href: '/dashboard', label: 'Mon Espace' };
};

export default function Header() {
  const { user, logout } = useAuth();
  const dashboard = getDashboardInfo(user);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 border-b border-slate-200 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">MLAcademy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">{label}</Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NotificationBell />
              <Link href={dashboard.href} className="btn-secondary py-2 px-4 text-xs gap-2 flex items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors font-bold">
                <LayoutDashboard className="h-4 w-4" /> {dashboard.label}
              </Link>
              <button onClick={logout} className="p-2 text-slate-500 hover:text-rose-500 transition-colors" title="Déconnexion">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Connexion</Link>
              <Link href="/register" className="btn-primary py-2 px-5 text-sm rounded-xl">S'inscrire</Link>
            </>
          )}
          <button className="md:hidden p-2 text-slate-900"><Menu className="h-6 w-6" /></button>
        </div>

      </div>
    </header>
  );
}