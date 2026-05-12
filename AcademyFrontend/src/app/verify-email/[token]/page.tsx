'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre adresse e-mail en cours...');

  useEffect(() => {
    async function verifyToken() {
      if (!token) return;
      
      try {
        const response = await fetchApi(`/api/public/users/verify-email/${token}/`);
        setStatus('success');
        setMessage(response.message || 'Votre email a été vérifié avec succès !');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Le lien est invalide ou a expiré.');
      }
    }
    
    verifyToken();  
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6">
      <div className="mesh-gradient" />
      
      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-[32px] p-10 text-center space-y-8 animate-reveal">
          <div className="mx-auto w-24 h-24 rounded-full bg-slate-900/50 border border-white/5 flex items-center justify-center shadow-xl">
            {status === 'loading' && <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-12 h-12 text-emerald-400" />}
            {status === 'error' && <XCircle className="w-12 h-12 text-rose-400" />}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {status === 'loading' ? 'Vérification...' : status === 'success' ? 'Compte Activé !' : 'Lien Invalide'}
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              {message}
            </p>
          </div>
          
          {status !== 'loading' && (
            <div className="pt-4">
              <Link href="/login" className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2 group shadow-indigo-500/20 shadow-lg">
                <MailCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Aller à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
