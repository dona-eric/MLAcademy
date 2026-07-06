"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight, Loader2, Award } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetchApi("/api/public/users/token/", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // Stocker les tokens avec les bonnes clés
      localStorage.setItem("access_token", response.access);
      if (response.refresh) {
        localStorage.setItem("refresh_token", response.refresh);
      }
      
      // Vérifier le profil et synchroniser le contexte global
      const profile = await fetchApi("/api/private/users/me/");
      
      if (profile.is_staff || profile.is_superuser) {
        // Synchroniser le contexte d'authentification global avant de naviguer
        if (checkAuth) {
          await checkAuth();
        }
        router.replace("/admin/dashboard"); 
      } else {
        setError("Accès refusé. Cette interface est réservée au personnel administratif.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (err: any) {
      setError(err.message || "Identifiants invalides ou erreur serveur.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[var(--brand-50)] rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[var(--info-light)] rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-10 z-10 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20 animate-in fade-in duration-200">
            <Loader2 className="animate-spin text-[var(--brand-500)] w-8 h-8" />
          </div>
        )}

        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-[var(--brand-500)] flex items-center justify-center text-white shadow-md mb-6">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tighter mb-2 uppercase">MLAcademy Space Administration</h1>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-[var(--error-light)] border border-[var(--error)] rounded-xl text-[var(--error)] text-xs font-bold text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest px-1">Identifiant Admin</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)]" />
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus autoComplete="email" className="input-field pl-12 font-bold" placeholder="admin@mlacademy.com"/>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest px-1">Mot de passe sécurisé</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)]" />
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="input-field pl-12 font-bold" placeholder="••••••••"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm mt-4 rounded-xl group disabled:opacity-50">
            <span>S'AUTHENTIFIER</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2">
           <Award className="h-4 w-4 text-[var(--brand-500)]" />
           <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">MLAcademy Administration</span>
        </div>
      </motion.div>
    </div>
  );
}
