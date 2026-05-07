'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre adresse e-mail en cours...');

  useEffect(() => {
    async function verifyToken() {
      if (!token) return;
      
      try {
        const response = await fetchApi(`/api/users/verify-email/${token}/`);
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
    <div className="full-screen-center">
      <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '500px' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          {status === 'loading' ? 'Vérification...' : status === 'success' ? 'Compte Activé !' : 'Erreur'}
        </h1>
        
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {message}
        </p>
        
        {status !== 'loading' && (
          <Link href="/login" className="btn btn-primary">
            Aller à la connexion
          </Link>
        )}
      </div>
    </div>
  );
}
