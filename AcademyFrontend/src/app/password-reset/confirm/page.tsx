"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, ArrowRight, CheckCircle2, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { fetchApi } from "@/lib/api";

function PasswordResetConfirmForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const uid = (params?.uid as string) || searchParams?.get("uid");
  const token = (params?.token as string) || searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (success) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);

      timer = setTimeout(() => {
        router.push("/login");
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [success, router]);

  if (!uid || !token) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Lien invalide</h2>
          <p className="text-sm text-slate-400">Ce lien de réinitialisation est incomplet ou invalide.</p>
        </div>
        <Link href="/password-reset" className="btn-secondary px-8 py-3 rounded-xl inline-block text-sm font-bold">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetchApi("/api/public/users/password-reset/confirm/", {
        method: "POST",
        body: JSON.stringify({
          uid,
          token,
          new_password: password,
          new_password_confirm: confirmPassword
        }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Le lien a expiré ou est invalide.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">🔒 Mot de passe mis à jour</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Votre compte est maintenant sécurisé.
          </p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-2">
            Redirection vers la connexion dans <span className="text-[#00D1FF] font-bold">{countdown}</span> secondes...
          </p>
        </div>
        <Link href="/login"  className="w-full btn-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 mt-6">
          Se connecter maintenant <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D1FF]/50 focus:ring-1 focus:ring-[#00D1FF]/50 transition-all font-sans" placeholder="••••••••"/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D1FF]/50 focus:ring-1 focus:ring-[#00D1FF]/50 transition-all font-sans" placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {confirmPassword && (
          <p className={`text-[10px] font-black uppercase tracking-wider ml-1 ${
            password === confirmPassword ? "text-emerald-400" : "text-rose-400"
          }`}>
            {password === confirmPassword
              ? "✓ Les mots de passe correspondent"
              : "✗ Les mots de passe sont différents"}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <p className="text-xs font-bold text-rose-400">{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
        className="w-full btn-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder et se connecter"} <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#00D1FF]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in duration-700">
        <div className="glass-card p-8 md:p-10 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden bg-[#112240]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D1FF] to-indigo-500"></div>
          
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Nouveau départ</h1>
            <p className="text-slate-400 text-sm font-medium">Saisissez votre nouveau mot de passe sécurisé.</p>
          </div>

          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#00D1FF]" /></div>}>
            <PasswordResetConfirmForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
