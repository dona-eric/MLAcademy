'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import type { UserProfile } from '@/types/user';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    // Éviter l'exécution côté serveur
    if (typeof window === 'undefined') return;

    try {
      setLoading(true);
      const userData = await fetchApi('/api/users/me/');
      setUser(userData);
    } catch (error: any) {
      // On nettoie l'utilisateur si l'appel échoue (non connecté ou session expirée)
      setUser(null);
      
      // On ne log en "error" que ce qui n'est pas une simple absence de session
      if (!error.message.includes("authentification") && !error.message.includes("401")) {
        console.error("Erreur d'authentification inattendue:", error);
      }
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
      await fetchApi('/api/users/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Après un login réussi, on récupère le profil
      await checkAuth();
      router.push('/dashboard'); // Ou ta page de redirection après login
    } catch (error) {
      throw error; // On laisse le composant Login gérer l'affichage de l'erreur
    }
  };

  const register = async (data: any) => {
    await fetchApi('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const logout = async () => {
    try {
      await fetchApi('/api/users/logout/', { method: 'POST' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
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