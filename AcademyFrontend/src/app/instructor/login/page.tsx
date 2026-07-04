"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function InstructorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      // La redirection vers /studio est gérée par le AuthContext pour les instructeurs.
    } catch (err: any) {
      setError("Identifiants incorrects ou compte non activé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          <Link href="/" className="inline-block">
            <Image 
              src="/images/mlacademy_logo_final.png"
              alt="MLAcademy Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-6">Espace Instructeur</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Connectez-vous avec les identifiants reçus par e-mail lors de la validation de votre candidature.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email professionnel (@mlacademy.io)"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mot de passe"
                  className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-900 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Vous n'êtes pas encore instructeur ?{" "}
            <Link href="/instructor/apply" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Postulez ici
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Cover Image */}
      <div className="hidden lg:block lg:flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 z-20">
          <blockquote className="space-y-4 max-w-lg">
             <p className="text-2xl font-medium text-white leading-tight">
               "L'Espace Studio me permet de créer des formations de très haute qualité avec une facilité déconcertante."
             </p>
             <footer className="text-sm font-bold text-indigo-300 uppercase tracking-widest">
               — Outil Formateur MLAcademy
             </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
