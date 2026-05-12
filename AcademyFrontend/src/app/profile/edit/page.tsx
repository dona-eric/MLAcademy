"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, fetchApi } from "@/lib/api";
import {  User, Globe,  Camera, ArrowLeft, Sparkles, Check,  Loader2, Target} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

type ProfileEditFormState = {
  first_name: string;
  last_name: string;
  bio: string;
  level: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  personal_goals: string;
  is_public_profile: boolean;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const { user: profile, loading: authLoading, checkAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProfileEditFormState>({
    first_name: "", last_name: "", bio: "", level: "beginner",
    linkedin_url: "", github_url: "", portfolio_url: "",
    personal_goals: "", is_public_profile: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.replace("/login");
      return;
    }

    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      bio: profile.bio || "",
      level: profile.level || "beginner",
      linkedin_url: profile.linkedin_url || "",
      github_url: profile.github_url || "",
      portfolio_url: profile.portfolio_url || "",
      personal_goals: profile.personal_goals || "",
      is_public_profile: Boolean(profile.is_public_profile),
    });
    setPreviewUrl(profile.avatar_url || null);
    setLoading(false);
  }, [authLoading, profile, router]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      if (avatarFile) payload.append("avatar", avatarFile);

      await fetchApi("/api/private/users/me/", {
        method: "PATCH",
        body: payload,
      });

      await checkAuth();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090C14] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au profil
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Sparkles className="w-3 h-3" /> Paramètres Profil
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Modifier mon profil</h1>
          <p className="text-slate-400 font-medium">Personnalisez votre identité sur MLAcademy Studio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="glass-card p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-slate-800 overflow-hidden border-2 border-white/10 relative">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-slate-600" /></div>
                )}
                <label htmlFor="avatar" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>
              <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-lg font-bold">Photo de profil</h3>
              <p className="text-xs text-slate-500 font-medium">Format JPG, PNG ou WebP. Max 2Mo.</p>
              <label htmlFor="avatar" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 cursor-pointer inline-block mt-2">
                Changer l'image
              </label>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-card p-6 rounded-[32px] border border-white/5 space-y-6 md:col-span-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                  <input name="first_name" value={formData.first_name} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                  <input name="last_name" value={formData.last_name} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Biographie</label>
                <textarea name="bio" value={formData.bio} onChange={handleTextChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="Quelques mots sur vous..." />
              </div>
            </div>

            <div className="glass-card p-6 rounded-[32px] border border-white/5 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Niveau & Objectifs</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Niveau IA</label>
                  <select name="level" value={formData.level} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objectif principal</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="personal_goals" value={formData.personal_goals} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="Ex: Devenir ML Engineer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-[32px] border border-white/5 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Réseaux Sociaux</h3>
              <div className="space-y-4">
                <div className="relative">
                  <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="linkedin_url" value={formData.linkedin_url} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="LinkedIn URL" />
                </div>
                <div className="relative">
                  <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="github_url" value={formData.github_url} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="GitHub URL" />
                </div>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="portfolio_url" value={formData.portfolio_url} onChange={handleTextChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="Portfolio / Blog" />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
              <input 
                type="checkbox" name="is_public_profile" id="is_public_profile" 
                checked={formData.is_public_profile} onChange={(e) => setFormData(prev => ({ ...prev, is_public_profile: e.target.checked }))}
                className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500" 
              />
              <label htmlFor="is_public_profile" className="text-sm font-bold text-slate-300 cursor-pointer">Rendre mon profil public</label>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {error && <p className="text-rose-400 text-xs font-bold animate-shake">{error}</p>}
              <button 
                type="submit" disabled={submitting}
                className="btn-primary flex-1 md:flex-none px-12 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <><Check className="w-5 h-5" /> Enregistré</> : "Enregistrer"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
