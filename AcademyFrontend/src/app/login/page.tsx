"use client";

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, Zap, Loader2, Eye, EyeOff } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const { login, user: profile, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleLoginUrl = "${API_BASE_URL}/api/auth/google/login/?process=login";
  const githubLoginUrl = "${API_BASE_URL}/api/auth/github/login/?process=login";

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
      await login(formData.email, formData.password);
      // Le routage est maintenant géré par AuthContext
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="w-full max-w-2xl relative z-8 my-8">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Rejoignez<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">MLAcademy</span>
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 space-y-8 shadow-xl">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
              <Zap className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="email" type="email" required value={formData.email} onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-50 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mot de passe</label>
                <Link href="/password-reset" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-500 transition-colors">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
                <input id="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-50 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="••••••••"
                />

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-5 text-base shadow-xl shadow-indigo-500/20 mt-4 rounded-2xl flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Connexion...</>
              ) : (
                <>Se connecter <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="relative py-2">
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-500">ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href={googleLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-slate-300 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-900">
              <FcGoogle />
              Google
            </a>
            <a href={githubLoginUrl} className="flex items-center justify-center gap-3 py-4 border border-slate-300 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-900">
              <FiGithub />
              GitHub
            </a>
          </div>

          <p className="text-center text-sm font-medium text-slate-500 pt-4">
            Nouveau sur MLAcademy ? <Link href="/register" className="text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:text-indigo-500 transition-colors ml-2">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
