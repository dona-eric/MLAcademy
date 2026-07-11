'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/parcours', label: 'Formations' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/communaute', label: 'Communauté' },
];

const getDashboardInfo = (user: any) => {
  if (user?.is_superuser || user?.is_staff) return { href: '/admin/dashboard', label: 'Administration' };
  if (user?.is_instructor) return { href: '/studio', label: 'Espace Formateur' };
  return { href: '/dashboard', label: 'Mon Espace' };
};

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const dashboard = getDashboardInfo(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image src="/images/mlacademy_logo_final.png" alt="MLAcademy" fill sizes="32px" className="object-cover" priority />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">MLAcademy</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--brand-500)] bg-[var(--brand-50)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={dashboard.href}
                  className="hidden sm:inline-flex btn-secondary py-2 px-4 text-xs gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" /> {dashboard.label}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors rounded-md hover:bg-[var(--error-light)]"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary py-2 px-5 text-sm">
                  S'inscrire
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-default)]">
              <span className="text-sm font-bold text-[var(--text-primary)]">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--brand-500)] bg-[var(--brand-50)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                );
              })}

              {user && (
                <Link
                  href={dashboard.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  {dashboard.label}
                  <LayoutDashboard className="h-4 w-4 opacity-40" />
                </Link>
              )}
            </nav>

            <div className="p-4 border-t border-[var(--border-default)] space-y-3">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full btn-secondary py-3 text-sm text-[var(--error)] border-[var(--error-light)] hover:bg-[var(--error-light)] justify-center"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full btn-secondary py-3 text-sm text-center">
                    Connexion
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block w-full btn-primary py-3 text-sm text-center">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}