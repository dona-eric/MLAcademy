"use client";

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';
import { Mail, Lock, User, ArrowRight, Zap, Loader2, ShieldCheck, ChevronLeft, Eye, EyeOff, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

function UnifiedAuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  
  // Step: 1 (Email), 2 (Login or Register), 3 (Success)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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
      const redirect = searchParams?.get("redirect");
      if (redirect) {
        sessionStorage.setItem("post_2fa_redirect", redirect);
      }
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (providerUrl: string) => {
    const redirect = searchParams?.get("redirect");
    if (redirect) {
      sessionStorage.setItem("post_2fa_redirect", redirect);
    }
    window.location.href = providerUrl;
  };

  const goBack = () => {
    setStep(1);
    setFormData({ ...formData, password: '', passwordConfirm: '', username: '' });
    setError('');
    setShowPassword(false);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-50)] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="card rounded-3xl p-10 text-center space-y-8 max-w-md w-full relative z-10 shadow-xl border-[var(--border-default)] bg-white">
          <div className="mx-auto w-24 h-24 rounded-full bg-[var(--brand-50)] border border-[var(--brand-100)] flex items-center justify-center shadow-sm">
            <Mail className="w-10 h-10 text-[var(--brand-500)]" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight uppercase">Vérifiez votre email</h2>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              Un email de confirmation a été envoyé à <span className="text-[var(--text-primary)] font-bold">{formData.email}</span>. 
              Veuillez cliquer sur le lien pour activer votre compte.
            </p>
          </div>
          <div className="pt-4">
            <button onClick={() => { setStep(1); setIsLoginMode(true); }} className="btn-secondary w-full py-3">
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-stretch overflow-hidden">
      {/* LEFT COLUMN: Main Auth Form */}
      <div className={`w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden transition-opacity duration-500 ${isForgotPasswordOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--brand-50)] blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4"></div>

        <div className="w-full max-w-md relative z-10">
          
          <div className="mb-8">
            {step === 1 && (
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2 uppercase">
                  Commencez votre dossier
                </h1>
                <p className="text-[var(--text-secondary)] font-medium text-sm md:text-base">Connexion ou création de compte en 1 minute.</p>
              </>
            )}

            {step === 2 && isLoginMode && (
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2 uppercase">
                  Connectez-vous
                </h1>
                <p className="text-[var(--text-secondary)] font-medium text-sm md:text-base">Bon retour parmi nous !</p>
              </>
            )}

            {step === 2 && !isLoginMode && (
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2 uppercase">
                  Créez votre compte
                </h1>
                <p className="text-[var(--text-secondary)] font-medium text-sm md:text-base">Dernière étape avant de commencer.</p>
              </>
            )}
          </div>

          <div className="card rounded-3xl p-8 space-y-6 shadow-xl border-[var(--border-default)] bg-white">
            {error && !isForgotPasswordOpen && (
              <div className="p-4 bg-[var(--error-light)] border border-[var(--error)] text-[var(--error)] rounded-xl text-xs font-bold flex items-center gap-3 shadow-sm">
                <Zap className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                    <input 
                      id="email" type="email" required autoFocus
                      value={formData.email} onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="nom@exemple.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading || !formData.email}
                  className="btn-primary w-full py-3.5 text-sm uppercase tracking-widest mt-4 rounded-xl flex items-center justify-center gap-2 group shadow-md"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Continuer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: LOGIN OR REGISTER */}
            {step === 2 && (
              <form onSubmit={isLoginMode ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">
                
                {/* Email Readonly display */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-50)] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[var(--brand-500)]" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{formData.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={goBack} className="text-xs font-bold text-[var(--brand-500)] hover:text-[var(--brand-400)] ml-2 shrink-0">
                    Changer
                  </button>
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">Pseudo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                      <input 
                        id="username" type="text" required autoFocus
                        value={formData.username} onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Mot de passe</label>
                    {isLoginMode && (
                      <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="text-[10px] font-bold text-[var(--brand-500)] hover:text-[var(--brand-400)]">
                        Oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                    <input id="password" type={showPassword ? "text" : "password"} required autoFocus={isLoginMode}
                      value={formData.password} onChange={handleChange}
                      className="input-field pl-12 pr-12"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLoginMode && (
                    <p className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5 ml-1">
                      <Info className="w-3 h-3" /> Minimum 8 caractères, mélange de lettres et chiffres.
                    </p>
                  )}
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                      <input 
                        id="passwordConfirm" type={showPassword ? "text" : "password"} required 
                        value={formData.passwordConfirm} onChange={handleChange}
                        className="input-field pl-12 pr-4"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm uppercase tracking-widest shadow-md mt-6 rounded-xl flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLoginMode ? 'Se connecter' : 'Créer mon compte'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Logins */}
            <div className="pt-6 border-t border-[var(--border-subtle)] mt-2">
              <p className="text-center text-[10px] font-bold text-[var(--text-tertiary)] mb-5 uppercase tracking-widest">
                Ou continuer avec
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialClick(googleLoginUrl)}
                  className="flex items-center justify-center gap-3 py-3 border border-[var(--border-default)] bg-white hover:bg-[var(--bg-secondary)] shadow-sm rounded-xl transition-colors font-bold text-sm text-[var(--text-primary)] cursor-pointer"
                >
                  <FcGoogle className="w-5 h-5"/>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialClick(githubLoginUrl)}
                  className="flex items-center justify-center gap-3 py-3 border border-[var(--border-default)] bg-white hover:bg-[var(--bg-secondary)] shadow-sm rounded-xl transition-colors font-bold text-sm text-[var(--text-primary)] cursor-pointer"
                >
                  <FiGithub className="w-5 h-5"/>
                  GitHub
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Testimonial OR Forgot Password Form */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--brand-50)] items-center justify-center p-12 overflow-hidden transition-all duration-700 border-l border-[var(--border-default)]">
        {/* Testimonial Display (when Forgot Password is closed) */}
        {!isForgotPasswordOpen && (
          <>
            <div className="relative z-20 max-w-lg mt-auto mb-20">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-[var(--border-default)]">
                <blockquote className="text-xl font-bold text-[var(--text-primary)] leading-relaxed mb-6 italic">
                  « J'ai validé ma formation en Machine Learning en étant étudiante et entrepreneuse. C'était intense... mais je l'ai fait ! »
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-100)] flex items-center justify-center font-bold text-[var(--brand-500)] border border-[var(--brand-200)]">
                    A
                  </div>
                  <div>
                     <p className="text-sm font-bold text-[var(--text-primary)]">Amina D.</p>
                     <p className="text-xs font-semibold text-[var(--text-secondary)]">Alumni Data Science</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-0 opacity-90">
              <Image
                src="/images/femme_africaine_tech_mlacademy_2.png"
                alt="Témoignage MLAcademy"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top opacity-50 mix-blend-multiply"       
              />
            </div>
          </>
        )}

        {/* Forgot Password Pane (when open) */}
        {isForgotPasswordOpen && (
          <div className="relative z-30 w-full max-w-md">
            <button 
              onClick={() => { setIsForgotPasswordOpen(false); setForgotPasswordSuccess(false); setError(''); }}
              className="absolute -top-16 -left-8 lg:-left-12 flex items-center gap-2 text-[var(--brand-500)] hover:text-[var(--brand-600)] font-bold group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Retour
            </button>

            <div className="mb-10 space-y-3">
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight uppercase">Mot de passe oublié ?</h2>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                Pas d'inquiétude ! Entrez votre e-mail pour recevoir un lien de réinitialisation sécurisé.
              </p>
            </div>

            <div className="card rounded-3xl p-8 border-[var(--brand-200)] shadow-xl bg-white space-y-6">
              {error && isForgotPasswordOpen && (
                <div className="p-4 bg-[var(--error-light)] border border-[var(--error)] text-[var(--error)] rounded-xl text-xs font-bold flex items-center gap-3 shadow-sm">
                  <Zap className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              {forgotPasswordSuccess ? (
                <div className="text-center space-y-6 py-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-[var(--success-light)] border border-[var(--success)] flex items-center justify-center shadow-sm">
                    <Mail className="w-8 h-8 text-[var(--success)]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[var(--text-primary)] font-bold text-lg">E-mail envoyé !</p>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Vérifiez votre boîte mail ({formData.email}) pour réinitialiser votre mot de passe.</p>
                  </div>
                  <button 
                    onClick={() => { setIsForgotPasswordOpen(false); setForgotPasswordSuccess(false); }}
                    className="btn-secondary w-full py-3 mt-2"
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                      <input 
                        id="forgot-email" type="email" required autoFocus
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-field pl-12"
                        placeholder="votre-email@exemple.com"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
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

export default function UnifiedAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" /></div>}>
      <UnifiedAuthPageContent />
    </Suspense>
  );
}
