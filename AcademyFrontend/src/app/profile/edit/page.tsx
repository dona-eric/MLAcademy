"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
import { fetchApi } from "@/lib/api";
import { User, Globe, Camera, ArrowLeft, Check, Loader2, Target, AlertCircle, Eye, EyeOff, Sparkles} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

// Constants

const BIO_MAX_CHARS = 300;

const LEVELS = [
  { value: "beginner",     label: "Débutant",      emoji: "🌱" },
  { value: "intermediate", label: "Intermédiaire",  emoji: "⚡" },
  { value: "advanced",     label: "Avancé",         emoji: "🚀" },
] as const;

type Level = typeof LEVELS[number]["value"];

//Types

type FormState = {
  first_name:       string;
  last_name:        string;
  bio:              string;
  level:            Level;
  linkedin_url:     string;
  github_url:       string;
  portfolio_url:    string;
  personal_goals:   string;
  is_public_profile: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

// Helpers 

function isURL(val: string) {
  if (!val) return true;
  try { new URL(val); return true; } catch { return false; }
}

function validateForm(data: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.first_name.trim()) errors.first_name = "Le prénom est requis.";
  if (!data.last_name.trim())  errors.last_name  = "Le nom est requis.";
  if (data.bio.length > BIO_MAX_CHARS) errors.bio = `Max ${BIO_MAX_CHARS} caractères.`;
  if (!isURL(data.linkedin_url))  errors.linkedin_url  = "URL invalide.";
  if (!isURL(data.github_url))    errors.github_url    = "URL invalide.";
  if (!isURL(data.portfolio_url)) errors.portfolio_url = "URL invalide.";
  return errors;
}

// Sub-components 

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-[28px] p-6 space-y-5 backdrop-blur-sm">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FieldWrapper({ label, error, children, hint }: {
  label: string; error?: string; children: React.ReactNode; hint?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        {hint}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold ml-1 animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

function InputField({
  name, value, onChange, placeholder, error, icon, type = "text",
}: {
  name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; error?: string; icon?: React.ReactNode; type?: string;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        name={name} value={value} onChange={onChange} type={type}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-2xl py-3 text-sm text-white
          placeholder:text-slate-600 focus:outline-none transition-all duration-200
          ${icon ? "pl-10 pr-4" : "px-4"}
          ${error
            ? "border-rose-500/50 focus:border-rose-400/70 bg-rose-500/5"
            : "border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07]"
          }`}
      />
    </div>
  );
}

// ─── Main Component 

=======
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

>>>>>>> develop
export default function ProfileEditPage() {
  const router = useRouter();
  const { user: profile, loading: authLoading, checkAuth } = useAuth();

<<<<<<< HEAD
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState<FormState>({
=======
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileEditFormState>({
>>>>>>> develop
    first_name: "", last_name: "", bio: "", level: "beginner",
    linkedin_url: "", github_url: "", portfolio_url: "",
    personal_goals: "", is_public_profile: true,
  });
<<<<<<< HEAD

  const [avatarFile,  setAvatarFile]  = useState<File | null>(null);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const [avatarHover, setAvatarHover] = useState(false);

  // Init
  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.replace("/login"); return; }
    setFormData({
      first_name:        profile.first_name,
      last_name:         profile.last_name,
      bio:               profile.bio,
      level:             (profile.level as Level)  || "beginner",
      linkedin_url:      profile.linkedin_url,
      github_url:        profile.github_url,
      portfolio_url:     profile.portfolio_url,
      personal_goals:    profile.personal_goals,
=======
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
>>>>>>> develop
      is_public_profile: Boolean(profile.is_public_profile),
    });
    setPreviewUrl(profile.avatar_url || null);
    setLoading(false);
  }, [authLoading, profile, router]);

<<<<<<< HEAD
  // Handlers
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (globalError) setGlobalError(null);
=======
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
>>>>>>> develop
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
<<<<<<< HEAD
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setGlobalError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
=======
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
>>>>>>> develop
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setGlobalError(null);
=======
    setSubmitting(true);
    setError(null);
>>>>>>> develop
    setSuccess(false);

    try {
      const payload = new FormData();
<<<<<<< HEAD
      Object.entries(formData).forEach(([k, v]) => payload.append(k, String(v)));
      if (avatarFile) payload.append("avatar", avatarFile);

      await fetchApi("/api/private/users/me/", { method: "PATCH", body: payload });
=======
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      if (avatarFile) payload.append("avatar", avatarFile);

      await fetchApi("/api/private/users/me/", {
        method: "PATCH",
        body: payload,
      });

>>>>>>> develop
      await checkAuth();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
<<<<<<< HEAD
      setGlobalError(err.message || "Erreur lors de l'enregistrement.");
=======
      setError(err.message || "Erreur lors de l'enregistrement.");
>>>>>>> develop
    } finally {
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  const isStudent = profile && !profile.is_superuser && !profile.is_staff && !profile.is_instructor;
  const isNotAdmin = profile && !profile.is_superuser && !profile.is_staff;
  const bioRemaining = BIO_MAX_CHARS - formData.bio.length;

  // Loading

  if (loading) return (
    <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Chargement du profil…</p>
      </div>
    </div>
  );

  // Render

  return (
    <div className="min-h-screen bg-[#090C14] text-white p-4 md:p-8 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[140px] rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between">
          <Link href="/profile"
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-semibold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour au profil
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10
            text-[10px] font-black uppercase tracking-widest text-slate-500">
            Paramètres Profil
          </div>
        </div>

        {/* ── Title ── */}
        <div>
          <h1 className="text-3xl font-black tracking-tight">Modifier mon profil</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Personnalisez votre identité sur MLAcademy Studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* ── Avatar ── */}
          <SectionCard title="Photo de profil">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative cursor-pointer" onMouseEnter={() => setAvatarHover(true)} onMouseLeave={() => setAvatarHover(false)}>
                <div className={`w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all duration-300
                  ${avatarHover ? "border-indigo-500/60 scale-105" : "border-white/10"} bg-slate-800 relative`}>
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Avatar" fill sizes="96px" unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                  <label htmlFor="avatar"
                    className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1
                      transition-opacity duration-200 cursor-pointer
                      ${avatarHover ? "opacity-100" : "opacity-0"}`}>
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Changer</span>
                  </label>
                </div>
                {avatarFile && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <p className="text-sm font-bold text-white">
                  {avatarFile ? avatarFile.name : "Aucune image sélectionnée"}
                </p>
                <p className="text-xs text-slate-500">Format JPG, PNG ou WebP · Max 2 Mo</p>
                <label htmlFor="avatar"
                  className="inline-block mt-3 text-xs font-black text-indigo-400 hover:text-indigo-300
                    uppercase tracking-widest cursor-pointer transition-colors">
                  Parcourir les fichiers →
                </label>
              </div>
            </div>
          </SectionCard>

          {/* ── Infos de base ── */}
          <SectionCard title="Informations de base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper label="Prénom" error={fieldErrors.first_name}>
                <InputField
                  name="first_name" value={formData.first_name}
                  onChange={handleTextChange} placeholder="Marie"
                  error={fieldErrors.first_name}
                />
              </FieldWrapper>
              <FieldWrapper label="Nom" error={fieldErrors.last_name}>
                <InputField
                  name="last_name" value={formData.last_name}
                  onChange={handleTextChange} placeholder="Dupont"
                  error={fieldErrors.last_name}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper
              label="Biographie"
              error={fieldErrors.bio}
              hint={
                <span className={`text-[10px] font-bold tabular-nums transition-colors ${
                  bioRemaining < 0 ? "text-rose-400" :
                  bioRemaining < 50 ? "text-amber-400" : "text-slate-600"
                }`}>
                  {formData.bio.length} / {BIO_MAX_CHARS}
                </span>
              }
            >
              <textarea
                name="bio" value={formData.bio} onChange={handleTextChange} rows={3}
                placeholder="Quelques mots sur vous…"
                className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-sm text-white
                  placeholder:text-slate-600 focus:outline-none resize-none transition-all duration-200
                  ${fieldErrors.bio
                    ? "border-rose-500/50 focus:border-rose-400/70 bg-rose-500/5"
                    : "border-white/10 focus:border-indigo-500/50 focus:bg-white/[0.07]"
                  }`}
              />
            </FieldWrapper>
          </SectionCard>

          {/* ── Niveau & Objectifs (étudiants uniquement) ── */}
          {isStudent && (
            <SectionCard title="Niveau & Objectifs">

              {/* Level selector — cards instead of select */}
              <FieldWrapper label="Niveau IA">
                <div className="grid grid-cols-3 gap-3">
                  {LEVELS.map(({ value, label, emoji }) => (
                    <button
                      key={value} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, level: value }))}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border text-sm font-bold
                        transition-all duration-200 cursor-pointer
                        ${formData.level === value
                          ? "border-indigo-500/60 bg-indigo-500/10 text-white scale-[1.02]"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-[11px]">{label}</span>
                    </button>
                  ))}
                </div>
              </FieldWrapper>

              <FieldWrapper label="Objectif principal" error={fieldErrors.personal_goals}>
                <InputField
                  name="personal_goals" value={formData.personal_goals}
                  onChange={handleTextChange} placeholder="Ex: Devenir ML Engineer"
                  error={fieldErrors.personal_goals}
                  icon={<Target className="w-4 h-4" />}
                />
              </FieldWrapper>
            </SectionCard>
          )}

          {/* ── Réseaux sociaux ── */}
          {isNotAdmin && (
            <SectionCard title="Réseaux Sociaux & Portfolio">
              <FieldWrapper label="LinkedIn" error={fieldErrors.linkedin_url}>
                <InputField
                  name="linkedin_url" value={formData.linkedin_url}
                  onChange={handleTextChange} placeholder="https://linkedin.com/in/…"
                  error={fieldErrors.linkedin_url} type="url"
                  icon={<FaLinkedin className="w-4 h-4" />}
                />
              </FieldWrapper>
              <FieldWrapper label="GitHub" error={fieldErrors.github_url}>
                <InputField
                  name="github_url" value={formData.github_url}
                  onChange={handleTextChange} placeholder="https://github.com/…"
                  error={fieldErrors.github_url} type="url"
                  icon={<FaGithub className="w-4 h-4" />}
                />
              </FieldWrapper>
              <FieldWrapper label="Portfolio / Blog" error={fieldErrors.portfolio_url}>
                <InputField
                  name="portfolio_url" value={formData.portfolio_url}
                  onChange={handleTextChange} placeholder="https://monsite.com"
                  error={fieldErrors.portfolio_url} type="url"
                  icon={<Globe className="w-4 h-4" />}
                />
              </FieldWrapper>
            </SectionCard>
          )}

          {/* ── Visibilité ── */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_public_profile: !prev.is_public_profile }))}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border
              transition-all duration-300 cursor-pointer group
              ${formData.is_public_profile
                ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                ${formData.is_public_profile ? "bg-emerald-500/20" : "bg-white/10"}`}>
                {formData.is_public_profile
                  ? <Eye className="w-4 h-4 text-emerald-400" />
                  : <EyeOff className="w-4 h-4 text-slate-500" />
                }
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Profil public</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formData.is_public_profile
                    ? "Votre profil est visible par tous les membres."
                    : "Votre profil est visible uniquement par vous."}
                </p>
              </div>
            </div>

            {/* Toggle visuel */}
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0
              ${formData.is_public_profile ? "bg-emerald-500" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md
                transition-transform duration-300
                ${formData.is_public_profile ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>

          {/* ── Actions ── */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">

            {globalError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold
                bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 w-full md:w-auto
                animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {globalError}
              </div>
            )}

            <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
              <Link href="/profile"
                className="px-6 py-3 rounded-2xl border border-white/10 text-sm font-bold
                  text-slate-400 hover:text-white hover:border-white/20 transition-all">
                Annuler
              </Link>

              <button
                type="submit" disabled={submitting || bioRemaining < 0}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black
                  transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${success
                    ? "bg-emerald-500 shadow-emerald-500/25 text-white"
                    : "bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/25 text-white hover:shadow-indigo-400/30 hover:scale-[1.02]"
                  }`}
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…</>
                ) : success ? (
                  <><Check className="w-4 h-4" /> Enregistré !</>
                ) : (
                  "Enregistrer les modifications"
                )}
=======
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
>>>>>>> develop
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> develop
