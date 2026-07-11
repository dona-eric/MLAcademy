'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import type { UserProfile } from '@/types/user';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isTwoFactorVerified: boolean;
  setTwoFactorVerified: (val: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(false);
  const router = useRouter();

  // On mount, hydrate 2FA state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored2FA = sessionStorage.getItem('2fa_verified');
      if (stored2FA === 'true') {
        setIsTwoFactorVerified(true);
      }
    }
  }, []);

  const setTwoFactorVerified = (val: boolean) => {
    setIsTwoFactorVerified(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('2fa_verified', val.toString());
    }
  };

  const checkAuth = async (): Promise<UserProfile | null> => {
    // Éviter l'exécution côté serveur
    if (typeof window === 'undefined') return null;

    try {
      setLoading(true);
      const userData = (await fetchApi('/api/private/users/me/')) as UserProfile;
      setUser(userData);
      
      // Verification 2FA Obligatoire (Sauf pour les instructeurs pour le moment)
      const verified = sessionStorage.getItem('2fa_verified') === 'true';
      if (!verified && !window.location.pathname.includes('/2fa') && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/instructor/login')) {
          // Si l'utilisateur est un instructeur, on ne le force pas tout de suite sur /2fa (rappel dans le studio)
          if (!userData.is_instructor) {
              router.push('/2fa');
          }
      }
      return userData;
    } catch (error: any) {
      // On nettoie l'utilisateur si l'appel échoue (non connecté ou session expirée)
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('2fa_verified');
      
      // On ne log en "error" que ce qui n'est pas une simple absence de session (401 Unauthorized)
      if (error?.status !== 401 && !error?.message?.includes("authentification") && !error?.message?.includes("401") && !error?.message?.includes("jeton")) {
        console.error("Erreur d'authentification inattendue:", error);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lancer la vérification au premier montage du composant
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data: any = await fetchApi('/api/public/users/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Stockage des tokens JWT
      if (data.access) localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

      // Le 2FA est OBLIGATOIRE pour les apprenants. Les instructeurs ont un rappel dans le studio.
      setTwoFactorVerified(false);
      const userData = await checkAuth();
      
      if (userData?.is_instructor) {
        const redirect = sessionStorage.getItem("post_2fa_redirect") || '/studio';
        router.push(redirect);
      } else {
        router.push('/2fa');
      }
      
    } catch (error) {
      throw error; // On laisse le composant Login gérer l'affichage de l'erreur
    }
  };

  const register = async (data: any) => {
    await fetchApi('/api/public/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const logout = async () => {
    try {
      await fetchApi('/api/private/users/logout/', { method: 'POST' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      setUser(null);
      setTwoFactorVerified(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('2fa_verified');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isTwoFactorVerified, setTwoFactorVerified, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}