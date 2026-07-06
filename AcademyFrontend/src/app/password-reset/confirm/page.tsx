"use client";

<<<<<<< HEAD
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { fetchApi } from "@/lib/api";

function PasswordResetConfirmForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams?.get("uid");
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lien invalide ou incomplet
  if (!uid || !token) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Lien invalide</h2>
          <p className="text-sm text-slate-500">Ce lien de réinitialisation est incomplet ou invalide.</p>
        </div>
        <Link href="/password-reset" className="inline-flex items-center justify-center px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors">
=======
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
>>>>>>> develop
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
<<<<<<< HEAD
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
=======

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre."
      );
>>>>>>> develop
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetchApi("/api/public/users/password-reset/confirm/", {
        method: "POST",
<<<<<<< HEAD
        body: JSON.stringify({ uid, token, new_password: password, new_password_confirm: confirmPassword }),
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
=======
        body: JSON.stringify({
          uid,
          token,
          new_password: password,
          new_password_confirm: confirmPassword
        }),
      });
      setSuccess(true);
>>>>>>> develop
    } catch (err: any) {
      setError(err.message || "Le lien a expiré ou est invalide.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
<<<<<<< HEAD
      <div className="text-center space-y-6 py-4">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Mot de passe modifié !</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Votre mot de passe a été mis à jour. Vous allez être redirigé vers la connexion dans quelques secondes...
          </p>
        </div>
=======
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
>>>>>>> develop
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nouveau mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required minLength={8}
            placeholder="Au moins 8 caractères"
            className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Confirmer le mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required minLength={8}
            placeholder="Répétez le mot de passe"
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
        disabled={loading || !password || !confirmPassword}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />Sauvegarder le nouveau mot de passe</>}
=======
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
>>>>>>> develop
      </button>
    </form>
  );
}

export default function PasswordResetConfirmPage() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Choisir un nouveau mot de passe</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Saisissez votre nouveau mot de passe sécurisé.</p>
          </div>

          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>}>
=======
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
>>>>>>> develop
            <PasswordResetConfirmForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
