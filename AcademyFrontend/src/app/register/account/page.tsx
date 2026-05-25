"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';
import { Mail, Lock, User, ArrowRight, Zap, Loader2, Sparkles, ShieldCheck, ChevronLeft, X, Eye, EyeOff, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FiGithub, FiFacebook } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";



export default function UnifiedAuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  // Step: 1 (Email), 2 (Login or Register), 3 (Success)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const googleLoginUrl = `${API_BASE_URL}/api/auth/google/login/?process=login`;
  const githubLoginUrl = `${API_BASE_URL}/api/auth/github/login/?process=login`;

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email) {
      setError("Veuillez saisir une adresse e-mail.");
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchApi("/api/public/users/check-email/", {
        method: "POST",
        body: JSON.stringify({ email: formData.email })
      });
      
      setIsLoginMode(data.exists);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Le routage est maintenant géré dynamiquement par AuthContext (Dashboard ou 2FA)
    } catch (err: any) {
      setError(err.message );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
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
        password_confirm: formData.passwordConfirm,
        first_name: '',
        last_name: ''
      });
      setStep(3); // Success step
    } catch (err: any) {
      if (err.data && typeof err.data === 'object') {
        const firstError = Object.values(err.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await fetchApi("/api/public/users/password-reset/", {
        method: "POST",
        body: JSON.stringify({ email: formData.email })
      });
      setForgotPasswordSuccess(true);
    } catch (err: any) {
      setError(err.message );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setFormData({ ...formData, password: '', passwordConfirm: '', username: '' });
    setError('');
    setShowPassword(false);
  };

  // -------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#090C14] flex items-center justify-center p-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="glass-card rounded-[32px] p-10 text-center space-y-8 animate-reveal max-w-md w-full relative z-10">
          <div className="mx-auto w-24 h-24 rounded-full bg-slate-900/50 border border-white/5 flex items-center justify-center shadow-xl">
            <Mail className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tight">Vérifiez votre email</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Un email de confirmation a été envoyé à <span className="text-white font-bold">{formData.email}</span>. 
              Veuillez cliquer sur le lien pour activer votre compte.
            </p>
          </div>
          <div className="pt-4">
            <button onClick={() => { setStep(1); setIsLoginMode(true); }} className="btn-secondary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2">
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090C14] flex items-stretch overflow-hidden">
      {/* LEFT COLUMN: Main Auth Form */}
      <div className={`w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden transition-all duration-500 ${isForgotPasswordOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4"></div>

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          <div className="mb-10">
            {step === 1 && (
              <>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                  Commencez votre dossier
                </h1>
                <p className="text-slate-400 font-medium">Connexion ou création de compte en 1 minute.</p>
              </>
            )}

            {step === 2 && isLoginMode && (
              <>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                  Connectez-vous
                </h1>
                <p className="text-slate-400 font-medium">Bon retour parmi nous !</p>
              </>
            )}

            {step === 2 && !isLoginMode && (
              <>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                  Créez votre compte
                </h1>
                <p className="text-slate-400 font-medium">Dernière étape avant de commencer.</p>
              </>
            )}
          </div>

          <div className="glass-card rounded-[32px] p-8 space-y-6 shadow-2xl shadow-black/50">
            {error && !isForgotPasswordOpen && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
                <Zap className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      id="email" type="email" required autoFocus
                      value={formData.email} onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                      placeholder="nom@exemple.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading || !formData.email}
                  className="btn-primary w-full py-4 text-base shadow-xl shadow-indigo-500/20 mt-4 rounded-2xl flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Continuer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: LOGIN OR REGISTER */}
            {step === 2 && (
              <form onSubmit={isLoginMode ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">
                
                {/* Email Readonly display */}
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white truncate">{formData.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={goBack} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 ml-2 shrink-0">
                    Changer
                  </button>
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pseudo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        id="username" type="text" required autoFocus
                        value={formData.username} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mot de passe</label>
                    {isLoginMode && (
                      <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                        Oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input id="password" type={showPassword ? "text" : "password"} required autoFocus={isLoginMode}
                      value={formData.password} onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLoginMode && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1.5 ml-1">
                      <Info className="w-3 h-3" /> Minimum 8 caractères, mélange de lettres et chiffres.
                    </p>
                  )}
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        id="passwordConfirm" type={showPassword ? "text" : "password"} required 
                        value={formData.passwordConfirm} onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {isLoginMode && (
                  <div className="flex items-center gap-2 ml-1">
                    <input type="checkbox" id="remember" className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" />
                    <label htmlFor="remember" className="text-xs text-slate-400 font-medium">Se souvenir de moi</label>
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  className="btn-primary w-full py-4 text-base shadow-xl shadow-indigo-500/20 mt-4 rounded-2xl flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLoginMode ? 'Se connecter' : 'Créer mon compte'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Logins */}
            <div className="pt-6">
              <p className="text-center text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">
                Ou continuer avec
              </p>
              <div className="grid grid-cols-2 gap-4">
                <a href={googleLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-white/20 rounded-2xl hover:bg-slate-800 transition-all font-bold text-sm text-white">
                  <FcGoogle/>
                  Google
                </a>
                <a href={githubLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-white/20 rounded-2xl hover:bg-slate-800 transition-all font-bold text-sm text-white">
                  <FiGithub />
                  GitHub
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Testimonial OR Forgot Password Form */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900/20 items-center justify-center p-12 overflow-hidden transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-[#090C14] via-[#090C14]/30 to-transparent z-10"></div>        
        {/* Testimonial Display (when Forgot Password is closed) */}
        {!isForgotPasswordOpen && (
          <>
            <div className="relative z-20 max-w-lg mt-auto mb-20 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <blockquote className="text-3xl font-bold text-white leading-relaxed mb-8 italic drop-shadow-lg">
                « J'ai validé ma formation en Machine Learning en étant étudiante et entrepreneuse. C'était intense... mais je l'ai fait ! »
              </blockquote>
            </div>
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/femme_africaine_tech_mlacademy_2.png"
                alt="Témoignage MLAcademy"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"       
              />
            </div>
          </>
        )}

        {/* Forgot Password Pane (when open) */}
        {isForgotPasswordOpen && (
          <div className="relative z-30 w-full max-w-md animate-in slide-in-from-right-full duration-700">
            <button 
              onClick={() => { setIsForgotPasswordOpen(false); setForgotPasswordSuccess(false); setError(''); }}
              className="absolute -top-16 -left-8 lg:-left-12 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Retour
            </button>

            <div className="mb-10 space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tight">Mot de passe oublié ?</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Pas d'inquiétude ! Entrez votre e-mail pour recevoir un lien de réinitialisation sécurisé.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 border border-indigo-500/30 bg-indigo-500/5 shadow-2xl space-y-8">
              {error && isForgotPasswordOpen && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
                  <Zap className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              {forgotPasswordSuccess ? (
                <div className="text-center space-y-6 py-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-lg">E-mail envoyé !</p>
                    <p className="text-slate-400 text-sm">Vérifiez votre boîte mail ({formData.email}) pour réinitialiser votre mot de passe.</p>
                  </div>
                  <button 
                    onClick={() => { setIsForgotPasswordOpen(false); setForgotPasswordSuccess(false); }}
                    className="btn-secondary w-full py-4 rounded-xl font-bold"
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        id="forgot-email" type="email" required autoFocus
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="votre-email@exemple.com"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="btn-primary w-full py-4 text-base shadow-xl shadow-indigo-500/20 rounded-2xl flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer le lien'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
