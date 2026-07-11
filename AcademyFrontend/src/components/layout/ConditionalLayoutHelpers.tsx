'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// Affiche le Header sauf si on est dans l'espace /studio, /instructeur, /admin ou /dashboard
export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/instructeur') || pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return null;
  return <Header />;
}

// Affiche le Footer sauf si on est dans l'espace /studio, /instructeur, /admin ou /dashboard
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/instructeur') || pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return null;
  return <Footer />;
}

// Optionnel : ajoute une classe au main selon la route
export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSpecial = pathname?.startsWith('/studio') || pathname?.startsWith('/instructeur') || pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');
  
  return (
    <main className={isSpecial ? "special-main-content" : "main-content"}>
      {children}
    </main>
  );
}
