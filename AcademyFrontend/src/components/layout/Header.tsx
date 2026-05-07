'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import './layout.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card bg-slate-900/40 border-white/5 px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">MLAcademy</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/parcours" className="nav-link text-sm font-semibold">Parcours</Link>
            <Link href="/certifications" className="nav-link text-sm font-semibold">Certifications</Link>
            <Link href="/communaute" className="nav-link text-sm font-semibold">Communauté</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="hidden md:block nav-link text-sm font-semibold">Connexion</Link>
              <Link href="/register" className="btn btn-primary py-2 px-5 text-sm">S'inscrire</Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="btn btn-secondary py-2 px-4 text-xs gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </Link>
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
          <button className="md:hidden p-2 text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
