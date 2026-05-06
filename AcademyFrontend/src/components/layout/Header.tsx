'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import './layout.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="glass-nav header-container">
      <div className="container flex items-center justify-between header-content">
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <Image 
              src="/mlacademy_logo.png" 
              alt="MLAcademy Logo" 
              width={100} 
              height={80} 
              className="logo-img"
              priority
            />
          </Link>
        </div>
        
        <nav className="main-nav desktop-only">
          <Link href="/parcours" className="nav-link">Parcours</Link>
          <Link href="/certifications" className="nav-link">Certifications</Link>
          <Link href="/communaute" className="nav-link">Communauté</Link>
        </nav>
        
        <div className="auth-actions flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="nav-link desktop-only">Connexion</Link>
              <Link href="/register" className="btn btn-primary">S'inscrire</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="nav-link">Mon Espace</Link>
              <div className="flex items-center gap-3">
                <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Déconnexion</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
