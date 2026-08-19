'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import type { UserProfile } from '@/types/user';
import { initFcm } from '@/utils/pushNotification';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isTwoFactorVerified: boolean;
  setTwoFactorVerified: (val: boolean) => void;
  login: (email: string, password: string, recaptchaToken?: string) => Promise<UserProfile | null>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register', '/instructor/login', '/2fa', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Hydratation du statut 2FA au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored2FA = sessionStorage.getItem('2fa_verified');
      setIsTwoFactorVerified(stored2FA === 'true');
    }
  }, []);

  // 2. Gestionnaire 2FA
  const setTwoFactorVerified = useCallback((val: boolean) => {
    setIsTwoFactorVerified(val);
    if (typeof window !== 'undefined') {
      if (val) {
        sessionStorage.setItem('2fa_verified', 'true');
      } else {
        sessionStorage.removeItem('2fa_verified');
      }
    }
  }, []);

  // 3. Vérification de la session
  const checkAuth = useCallback(async (): Promise<UserProfile | null> => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const userData = (await fetchApi('/api/private/users/me/')) as UserProfile;
      setUser(userData);

      // Vérification 2FA pour les non-instructeurs sur routes privées
      const isVerified2FA = sessionStorage.getItem('2fa_verified') === 'true';
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

      if (!userData.is_instructor && !isVerified2FA && !isPublicRoute) {
        router.push('/2fa');
      }

      // Initialisation FCM
      if (userData) {
        initFcm();
      }

      return userData;
    } catch (error: any) {
      // Ne purger les tokens QUE si l'erreur est un problème d'authentification explicite (401/403)
      const isAuthError =
        error?.status === 401 ||
        error?.status === 403 ||
        error?.message?.includes('authentification') ||
        error?.message?.includes('jeton');

      if (isAuthError) {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('2fa_verified');
      } else {
        console.error('Erreur réseau ou serveur lors de la vérification auth:', error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  // Lancement unique au montage
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 4. Fonction de Connexion
  const login = async (email: string, password: string, recaptchaToken?: string): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const body: Record<string, any> = { email, password };
      if (recaptchaToken) body.recaptcha_token = recaptchaToken;

      const data: any = await fetchApi('/api/public/users/token/', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (data.access) localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

      // Réinitialiser la 2FA pour la nouvelle session
      setTwoFactorVerified(false);

      // Récupérer le profil mis à jour
      const userData = await checkAuth();

      if (userData?.is_instructor) {
        const redirect = sessionStorage.getItem('post_2fa_redirect') || '/studio';
        router.push(redirect);
      } else {
        router.push('/2fa');
      }

      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // 5. Inscription
  const register = async (data: Record<string, any>) => {
    await fetchApi('/api/public/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  // 6. Déconnexion
  const logout = async () => {
    setLoading(true);
    try {
      await fetchApi('/api/private/users/logout/', { method: 'POST' });
    } catch (error) {
      console.warn('Erreur lors de la déconnexion sur le serveur:', error);
    } finally {
      setUser(null);
      setTwoFactorVerified(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('2fa_verified');
      setLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{user,loading,isTwoFactorVerified,setTwoFactorVerified,login,register,logout,checkAuth}}
    >
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