"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight, Loader2, Award } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await fetchApi("/api/public/users/token/", {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      // Stocker les tokens avec les bonnes clés (access_token/refresh_token)
      localStorage.setItem("access_token", response.access);
      if (response.refresh) {
        localStorage.setItem("refresh_token", response.refresh);
      }
      
      // Vérifier le profil et synchroniser le contexte global
      const profile = await fetchApi("/api/private/users/me/");
      
      if (profile.is_staff || profile.is_superuser) {
        // Force la mise à jour du contexte Auth global
        window.location.href = "/admin/dashboard"; 
      } else {
        setError("Accès refusé. Cette interface est réservée au personnel administratif.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (err: any) {
      setError("Identifiants invalides ou erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 p-10 z-10 relative border border-white"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-15 w-15 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">MLAcademyAdmin</h1>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identifiant Admin</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="admin@mlacademy.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mot de passe sécurisé</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>S'AUTHENTIFIER</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2">
           <Award className="h-4 w-4 text-blue-500" />
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">MLAcademy Administration</span>
        </div>
      </motion.div>
    </div>
  );
}
