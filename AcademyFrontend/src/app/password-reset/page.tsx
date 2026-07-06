"use client";

<<<<<<< HEAD
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
=======
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
>>>>>>> develop
import { fetchApi } from "@/lib/api";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
=======
  // Auto-expire success banner after 10 seconds to allow trying another address
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setEmail("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
>>>>>>> develop

    setLoading(true);
    setError(null);

    try {
      await fetchApi("/api/public/users/password-reset/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>

        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">

          {success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Email envoyé</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Si un compte existe avec l'adresse <strong className="text-slate-700">{email}</strong>, vous allez recevoir un lien de réinitialisation dans quelques instants. Vérifiez aussi vos spams.
                </p>
              </div>
              <button
                onClick={() => { setSuccess(false); setEmail(""); }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Essayer une autre adresse
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Mot de passe oublié ?</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      required
                      className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer le lien de réinitialisation"}
                </button>
              </form>
            </>
=======
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#00D1FF]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in duration-700">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-[#00D1FF] uppercase tracking-widest hover:underline transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>

        <div className="glass-card p-8 md:p-10 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden bg-[#112240]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D1FF] to-indigo-500"></div>
          
          <div className="flex items-center gap-2 text-[#00D1FF] font-black uppercase tracking-[0.2em] text-[10px] mb-6">
            <Sparkles className="w-4 h-4" />
            <span>MLAcademy</span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Mot de passe</h1>
            <p className="text-slate-400 text-sm font-medium">Récupérez l'accès à votre espace de travail.</p>
          </div>

          {success ? (
            <div className="space-y-8 text-center py-4 animate-in zoom-in-50 duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Lien envoyé !</h3>
                <p className="text-slate-400 text-sm leading-relaxed px-2">
                  Si un compte existe avec l'adresse <strong className="text-white font-mono">{email}</strong>, un lien sécurisé a été transmis d'ici quelques instants.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="w-full btn-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20"
                >
                  Se connecter maintenant <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => { setSuccess(false); setEmail(""); }} 
                  className="text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                >
                  Essayer une autre adresse
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" />
                  <input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D1FF]/50 focus:ring-1 focus:ring-[#00D1FF]/50 transition-all font-sans"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <p className="text-xs font-bold text-rose-400">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !email}
                className="w-full btn-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-45 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien magique"}
              </button>
            </form>
>>>>>>> develop
          )}
        </div>
      </div>
    </div>
  );
}
