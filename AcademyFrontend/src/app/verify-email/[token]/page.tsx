'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm text-center space-y-6">

          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center border ${
            status === 'loading' ? 'bg-slate-50 border-slate-200' :
          status === 'success' ? 'bg-emerald-50 border-emerald-100' :
          'bg-red-50 border-red-100'
          }`}>
          {status === 'loading' && <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
          {status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">
            {status === 'loading' ? 'Vérification...' :
              status === 'success' ? 'Email confirmé !' :
                'Lien invalide'}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {message}
          </p>
        </div>

        {status !== 'loading' && (
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Aller à la connexion
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {status === 'error' && (
          <p className="text-xs text-slate-400">
            Ce lien est à usage unique et expire après 24h.{' '}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Reconnectez-vous
            </Link>
            {' '}pour en renvoyer un.
          </p>
        )}
      </div>
    </div>
    </div >
  );
}
