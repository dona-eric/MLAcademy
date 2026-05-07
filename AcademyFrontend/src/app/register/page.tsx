'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm, // correspond au backend
        first_name: '',
        last_name: ''
      });
      setSuccess(true);
    } catch (err: any) {
      // Affiche le message d'erreur détaillé si c'est un objet
      if (err && err.response && typeof err.response.json === 'function') {
        try {
          const data = await err.response.json();
          setError(JSON.stringify(data));
        } catch {
          setError(err.message || 'Erreur lors de l\'inscription.');
        }
      } else {
        setError(err.message || 'Erreur lors de l\'inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="full-screen-center">
        <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '500px' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Inscription réussie !</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien qu'il contient pour activer votre compte.
          </p>
          <Link href="/login" className="btn btn-primary">Aller à la connexion</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="full-screen-center" style={{ minHeight: 'calc(100vh - 72px)', background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.05), transparent 40%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>S'inscrire</h1>
        
        {error && <div className="alert-error" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Nom d'utilisateur</label>
            <input type="text" id="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Mot de passe</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label htmlFor="passwordConfirm" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Confirmer le mot de passe</label>
            <input type="password" id="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)' }} />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Déjà un compte ? <Link href="/login" style={{ color: 'var(--accent-primary)' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
