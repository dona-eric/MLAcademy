"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Lock, ShieldCheck, Zap, Loader2, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';

function InstructorActivateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('uid'); // Fallback to uid if they use old link format
  
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien d'activation invalide. Veuillez contacter l'administrateur.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setError('');
    
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await fetchApi("/api/public/users/instructor-activate/", {
        method: "POST",
        body: JSON.stringify({
          token,
          password: formData.password,
          password_confirm: formData.passwordConfirm
        })
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/register/account');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'activation du compte. Le lien a peut-être expiré.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card rounded-[32px] p-10 text-center space-y-8 animate-reveal">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tight">Compte Activé !</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Bienvenue dans l'équipe, instructeur ! Votre mot de passe a été défini. Redirection vers la connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[32px] p-8 space-y-6 shadow-2xl shadow-black/50">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-black text-white tracking-tight">Activez votre compte</h1>
        <p className="text-slate-400 text-sm font-medium">Définissez votre mot de passe pour accéder au Studio.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
          <Zap className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              id="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="••••••••"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              id="passwordConfirm" type={showPassword ? "text" : "password"} required value={formData.passwordConfirm} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
          <p className="text-[10px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
            Le mot de passe doit faire au moins 8 caractères et inclure des lettres et des chiffres.
          </p>
        </div>

        <button 
          type="submit" disabled={loading || !!error}
          className="btn-primary w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-2 group shadow-xl shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Activer mon compte <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" /></>}
        </button>
      </form>
    </div>
  );
}

export default function InstructorActivatePage() {
  return (
    <div className="min-h-screen bg-[#090C14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="mb-12 text-center">
          <Link href="/" className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-400" /> MLAcademy Studio
          </Link>
        </div>

        <Suspense fallback={<div className="text-white">Chargement...</div>}>
          <InstructorActivateForm />
        </Suspense>

        <div className="mt-8 text-center">
          <Link href="/register/account" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">
            Déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
