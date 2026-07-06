"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, fetchApi } from "@/lib/api";
import { User, Globe, Camera, ArrowLeft, Sparkles, Check, Loader2, Target } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] p-4 md:p-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au profil
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-primary)] rounded-md border border-[var(--border-default)] text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
            <Sparkles className="w-3 h-3" /> Paramètres Profil
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Modifier mon profil</h1>
          <p className="text-[var(--text-secondary)] font-medium">Personnalisez votre identité sur MLAcademy Studio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar Section */}
          <div className="card p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-xl bg-[var(--bg-secondary)] overflow-hidden border border-[var(--border-default)] relative">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Avatar" fill sizes="96px" unoptimized={true} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-[var(--text-tertiary)]" /></div>
                )}
                <label htmlFor="avatar" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>
              <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-lg font-bold">Photo de profil</h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Format JPG, PNG ou WebP. Max 2Mo.</p>
              <label htmlFor="avatar" className="text-xs font-black text-[var(--brand-500)] uppercase tracking-widest hover:underline cursor-pointer inline-block mt-2">
                Changer l'image
              </label>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="card p-6 space-y-6 md:col-span-2">
              <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Prénom</label>
                  <input name="first_name" value={formData.first_name} onChange={handleTextChange} className="input-field py-3 px-4 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Nom</label>
                  <input name="last_name" value={formData.last_name} onChange={handleTextChange} className="input-field py-3 px-4 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Biographie</label>
                <textarea name="bio" value={formData.bio} onChange={handleTextChange} rows={3} className="input-field py-3 px-4 text-sm" placeholder="Quelques mots sur vous..." />
              </div>
            </div>

            {/* Niveau & Objectifs - Seulement pour les étudiants */}
            {profile && !profile.is_superuser && !profile.is_staff && !profile.is_instructor && (
              <div className="card p-6 space-y-6">
                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-4">Niveau & Objectifs</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Niveau IA</label>
                    <select name="level" value={formData.level} onChange={handleTextChange} className="input-field py-3 px-4 text-sm">
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Objectif principal</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <input name="personal_goals" value={formData.personal_goals} onChange={handleTextChange} className="input-field py-3 pl-10 pr-4 text-sm" placeholder="Ex: Devenir ML Engineer" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Réseaux Sociaux - Étudiants et Instructeurs */}
            {profile && !profile.is_superuser && !profile.is_staff && (
              <div className="card p-6 space-y-6">
                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-4">Réseaux Sociaux</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input name="linkedin_url" value={formData.linkedin_url} onChange={handleTextChange} className="input-field py-3 pl-10 pr-4 text-sm" placeholder="LinkedIn URL" />
                  </div>
                  <div className="relative">
                    <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input name="github_url" value={formData.github_url} onChange={handleTextChange} className="input-field py-3 pl-10 pr-4 text-sm" placeholder="GitHub URL" />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input name="portfolio_url" value={formData.portfolio_url} onChange={handleTextChange} className="input-field py-3 pl-10 pr-4 text-sm" placeholder="Portfolio / Blog" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 bg-[var(--bg-primary)] px-6 py-4 rounded-xl border border-[var(--border-default)]">
              <input
                type="checkbox" name="is_public_profile" id="is_public_profile"
                checked={formData.is_public_profile} onChange={(e) => setFormData(prev => ({ ...prev, is_public_profile: e.target.checked }))}
                className="w-5 h-5 rounded border-[var(--border-default)] text-[var(--brand-500)] focus:ring-[var(--brand-500)]"
              />
              <label htmlFor="is_public_profile" className="text-sm font-bold text-[var(--text-primary)] cursor-pointer">Rendre mon profil public</label>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {error && <p className="text-[var(--error)] text-xs font-bold animate-shake">{error}</p>}
              <button
                type="submit" disabled={submitting}
                className="btn-primary flex-1 md:flex-none px-12 py-4 flex items-center justify-center gap-2"
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
