'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// Affiche le Header sauf si on est dans l'espace /instructor
export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith('/instructor')) return null;
  return <Header />;
}

// Affiche le Footer sauf si on est dans l'espace /instructor
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/instructor')) return null;
  return <Footer />;
}

// Optionnel : ajoute une classe au main selon la route
export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInstructor = pathname?.startsWith('/instructor');
  
  // Si on est instructeur, on enlève le padding du Header standard
  return (
    <main className={isInstructor ? "instructor-main-content" : "main-content"}>
      {children}
    </main>
  );
}
