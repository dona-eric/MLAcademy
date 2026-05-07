"use client";

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowLeft
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const { login, user: profile, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleLoginUrl = `${API_BASE_URL}/api/auth/google/login/?process=login`;
  const githubLoginUrl = `${API_BASE_URL}/api/auth/github/login/?process=login`;

  useEffect(() => {
    if (!authLoading && profile) {
      router.push("/dashboard");
    }
  }, [profile, authLoading, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFB800]/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/4"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="mb-10 text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0A192F] transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Retour à l'accueil</span>
          </Link>
          <h1 className="text-5xl font-bold text-[#0A192F] font-georgia tracking-tight">Content de vous <span className="text-[#00D1FF]">revoir.</span></h1>
          <p className="text-gray-500 font-medium">Poursuivez votre apprentissage là où vous l'avez laissé.</p>
        </div>

        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
              <Zap className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Utilisateur / Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#00D1FF] transition-colors" />
                <input 
                  id="username" type="text" required value={formData.username} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00D1FF] focus:bg-white transition-all"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mot de passe</label>
                <Link href="/password-reset" className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#00D1FF] transition-colors" />
                <input 
                  id="password" type="password" required value={formData.password} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00D1FF] focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="btn btn-primary w-full py-5 text-base shadow-xl shadow-cyan-100 mt-4"
            >
              {loading ? "Connexion..." : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-gray-300">ou continuer avec</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href={googleLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-[#0A192F]">
              Google
            </a>
            <a href={githubLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-[#0A192F]">
              GitHub
            </a>
          </div>

          <p className="text-center text-sm font-medium text-gray-500">
            Nouveau sur MLAcademy ? <Link href="/register" className="text-[#00D1FF] font-black uppercase tracking-widest text-[10px] hover:underline ml-1">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
