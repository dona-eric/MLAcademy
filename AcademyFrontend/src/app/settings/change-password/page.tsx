"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff, Lock, Zap } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clean timeout with useEffect for redirecting
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        router.push("/settings");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre."
      );
      setLoading(false);
      return;
    }

    try {
      await fetchApi("/api/private/users/me/change-password/", {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirm: newPasswordConfirm,
        }),
      });

      setSuccess("Votre mot de passe a été modifié avec succès.");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de modifier le mot de passe.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="mb-6">
          <Link 
            href="/settings" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-[#00D1FF] uppercase tracking-widest hover:underline transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux paramètres
          </Link>
        </div>

        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight uppercase">
            Clé d'Accès
          </h1>
          <p className="text-slate-400 text-sm">
            Modifiez votre mot de passe pour sécuriser votre compte.
          </p>
        </div>

        <div className="glass-card rounded-[40px] p-8 md:p-10 space-y-8 shadow-2xl shadow-black/50 bg-[#112240] border border-white/5">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
              <Zap className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ancien mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" />
                <input 
                  type={showOld ? "text" : "password"} 
                  required 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-[#00D1FF]/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 font-sans"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowOld(!showOld)} 
                  aria-label={showOld ? "Masquer l'ancien mot de passe" : "Afficher l'ancien mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" />
                <input 
                  type={showNew ? "text" : "password"} 
                  required 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-[#00D1FF]/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 font-sans"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)} 
                  aria-label={showNew ? "Masquer le nouveau mot de passe" : "Afficher le nouveau mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer le nouveau mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" />
                <input 
                  type={showConfirm ? "text" : "password"} 
                  required 
                  value={newPasswordConfirm} 
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-[#00D1FF]/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 font-sans"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)} 
                  aria-label={showConfirm ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {newPasswordConfirm && (
              <p className={`text-[10px] font-black uppercase tracking-wider ml-1 ${
                newPassword === newPasswordConfirm ? "text-emerald-400" : "text-rose-400"
              }`}>
                {newPassword === newPasswordConfirm
                  ? "✓ Les nouveaux mots de passe correspondent"
                  : "✗ Les nouveaux mots de passe sont différents"}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading || success !== null || !newPassword || !newPasswordConfirm || newPassword !== newPasswordConfirm}
              className="btn-primary w-full py-5 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 mt-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-45 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</>
              ) : (
                <>Enregistrer le mot de passe</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
