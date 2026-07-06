'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { VerifyEmailResponse } from '@/types/info';

type VerificationState = 'loading' | 'success' | 'already_verified' | 'error';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const token = typeof params?.token === 'string' ? params.token : '';

  const [status, setStatus] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('Nous vérifions votre adresse e-mail...');
  const [countdown, setCountdown] = useState(5);
  const hasRun = useRef(false);

  useEffect(() => {
    let mounted = true;
    if (!token || hasRun.current) return;
    hasRun.current = true;

    async function verifyToken() {
      try {
        const response = (await fetchApi(
          `/api/public/users/verify-email/${token}/`
        )) as VerifyEmailResponse
        if (!mounted) return;
        if (response.message && response.message.toLowerCase().includes('déjà')) {
          setStatus('already_verified');
        } else {
          setStatus('success');
        }
        setMessage(response.message || 'Adresse e-mail vérifiée avec succès.');
      } catch (err: any) {
        if (!mounted) return;
        setStatus('error');
        setMessage(err.message || 'Le lien de vérification est invalide ou a expiré.');
      }
    }
    verifyToken();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Automatic redirect timer
  useEffect(() => {
    if (status === 'success' || status === 'already_verified') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(user ? '/dashboard' : '/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, user, router]);

  const handleContinue = () => {
    router.push(user ? '/dashboard' : '/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-[#0A192F]">
      {/* Premium background mesh and glowing spots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#00D1FF/3%_0,transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#6366F1/3%_0,transparent_40%)] pointer-events-none" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-card rounded-[32px] p-10 text-center space-y-8 bg-[#112240] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D1FF]/5 blur-2xl rounded-full"></div>
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-center gap-2 text-[#00D1FF] font-black uppercase tracking-[0.2em] text-xs">
            <Sparkles className="w-4 h-4" />
            <span>MLAcademy</span>
          </div>

          {/* Status Icon Indicator */}
          <div className="mx-auto w-24 h-24 rounded-[2rem] bg-[#0A192F] border border-white/5 flex items-center justify-center shadow-xl relative group">
            {status === 'loading' && (
              <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in-50 duration-300" />
            )}
            {status === 'already_verified' && (
              <ShieldCheck className="w-12 h-12 text-indigo-400 animate-in zoom-in-50 duration-300" />
            )}
            {status === 'error' && (
              <XCircle className="w-12 h-12 text-rose-400 animate-in zoom-in-50 duration-300" />
            )}
          </div>

          {/* Verification Details */}
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {status === 'loading' && 'Vérification...'}
              {status === 'success' && 'Compte Activé !'}
              {status === 'already_verified' && 'Déjà Vérifié'}
              {status === 'error' && 'Lien Invalide'}
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed px-2">
              {message}
            </p>
          </div>

          {/* Redirect Hint */}
          {(status === 'success' || status === 'already_verified') && (
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">
              Redirection automatique dans <span className="text-[#00D1FF] font-bold">{countdown}</span> secondes...
            </div>
          )}

          {/* Action Button */}
          {status !== 'loading' && (
            <button
              onClick={handleContinue}
              className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group transition-all duration-300 ${
                status === 'error'
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-white text-[#0A192F] hover:bg-[#00D1FF] hover:text-[#0A192F] hover:shadow-lg hover:shadow-[#00D1FF]/10'
              }`}>
              <span>{user ? 'Aller au Tableau de Bord' : 'Continuer vers la Connexion'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
