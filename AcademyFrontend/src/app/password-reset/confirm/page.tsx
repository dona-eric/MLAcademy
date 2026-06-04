"use client";

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
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetchApi("/api/public/users/password-reset/confirm/", {
        method: "POST",
        body: JSON.stringify({ uid, token, new_password: password, new_password_confirm: confirmPassword }),
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Le lien a expiré ou est invalide.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
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
      </div>
    );
  }

  return (
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
      </button>
    </form>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Choisir un nouveau mot de passe</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Saisissez votre nouveau mot de passe sécurisé.</p>
          </div>

          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>}>
            <PasswordResetConfirmForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
