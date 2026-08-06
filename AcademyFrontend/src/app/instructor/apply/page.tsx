"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import { User, Mail, Link as LinkIcon, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Loader2, Zap, Upload, Bolt, ShieldCheck, Code2, } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const EXPERTISE_OPTIONS = [
  { id: "machine_learning", label: "Machine Learning" },
  { id: "deep_learning", label: "Deep Learning" },
  { id: "data_science", label: "Data Science" },
  { id: "nlp", label: "NLP / Traitement du langage" },
  { id: "computer_vision", label: "Vision par ordinateur" },
  { id: "mlops", label: "MLOps / Déploiement" },
  { id: "mathematics", label: "Mathématiques pour le ML" },
  { id: "python", label: "Python & Data Engineering" },
  { id: "other", label: "Autre" },
];

export default function InstructorApplyPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    cv_url: "",
    linkedin_url: "",
    portfolio_url: "",
    website_url: "",
    expertise: "machine_learning",
    expertise_detail: "",
    motivation: "",
    teaching_experience: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (cvFile) {
      data.append("cv_file", cvFile);
    }

    try {
      const res = await fetchApi("/api/public/users/apply-instructeur/", {
        method: "POST",
        body: data,
      });
      if (res && res.id) {
        setApplicationId(res.id);
        localStorage.setItem("instructor_app_email", formData.email.trim());
        localStorage.setItem("instructor_app_dossier_id", res.id.toString());
      }
      setSuccess(true);
    } catch (err: any) {
      if (err.data && typeof err.data === "object") {
        const firstError = Object.values(err.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const msg = err.message || "Une erreur est survenue lors de l'envoi.";
        if (
          msg.toLowerCase().includes("déjà") ||
          msg.toLowerCase().includes("en cours d'examen")
        ) {
          setError(
            <div className="space-y-4 w-full">
              <p>{msg}</p>
              <Link
                href="/instructor/application/status"
                className="btn bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 w-full py-3 rounded-xl block text-center hover:bg-indigo-500/30 transition-all"
              >
                Consulter mon statut actuel
              </Link>
            </div>
          );
        } else if (
          msg.trim().startsWith("<!DOCTYPE") ||
          msg.trim().startsWith("<html")
        ) {
          setError(
            "Une erreur interne est survenue sur le serveur. Notre équipe a été prévenue."
          );
        } else {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 blur-[140px] rounded-full pointer-events-none -z-0"></div>
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-10 text-center space-y-8 max-w-lg w-full relative z-10 shadow-2xl">
          <div className="mx-auto w-24 h-24 rounded-full bg-[#5de6ff]/10 border border-[#5de6ff]/20 flex items-center justify-center shadow-xl shadow-[#5de6ff]/10">
            <CheckCircle2 className="w-12 h-12 text-[#5de6ff]" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Candidature reçue !
            </h2>
            <p className="text-[#c7c4d7] font-medium leading-relaxed">
              Merci <span className="text-white font-bold">{formData.first_name}</span> ! Notre équipe pédagogique va examiner votre profil. Vous recevrez une réponse sous 3 à 5 jours ouvrés.
            </p>
            {applicationId && (
              <div className="p-6 bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-[#c7c4d7] uppercase tracking-widest">
                  Numéro de dossier unique
                </p>
                <p className="text-3xl font-extrabold text-[#c0c1ff]">
                  #{applicationId.toString().padStart(6, "0")}
                </p>
                <p className="text-[10px] text-[#c7c4d7]">
                  Conservez ce numéro précieusement pour suivre l'avancement de votre dossier.
                </p>
              </div>
            )}
          </div>
          <div className="pt-4 flex flex-col gap-4">
            <Link
              href="/"
              className="bg-[#c0c1ff] text-[#1000a9] hover:bg-[#d4e4fa] py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Retourner à l'accueil
            </Link>
            <Link
              href="/instructor/application/status"
              className="text-sm font-bold text-[#5de6ff] hover:underline"
            >
              Suivre ma candidature en temps réel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col lg:flex-row relative font-sans overflow-x-hidden">
      {/* Background Atmospheric Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 blur-[140px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none -z-0"></div>

      {/* LEFT COLUMN: FORM */}
      <section className="w-full lg:w-1/2 p-6 md:p-12 lg:p-20 relative z-10">
        <div className="mb-12">
          <Link
            href="/instructor/application/status"
            className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mb-8 hover:text-[#c0c1ff] transition-colors"
          >
            MLAcademy <span className="text-xs px-3 py-1 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/20">Studio</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Rejoignez le <br />
            <span className="text-[#5de6ff] italic font-normal">cercle des experts.</span>
          </h1>
          <p className="text-[#c7c4d7] text-lg max-w-xl leading-relaxed">
            Partagez votre savoir, inspirez des milliers d'étudiants et développez votre influence dans le domaine de l'IA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* ERROR ALERT */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
              <Zap className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* SECTION 1: IDENTITÉ */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c0c1ff]/10 flex items-center justify-center border border-[#c0c1ff]/20">
                <User className="w-5 h-5 text-[#c0c1ff]" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Informations personnelles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                  Prénom
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                  placeholder="Ex: Jean"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                  Nom
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                  placeholder="Ex: Dupont"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Adresse e-mail professionnelle
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#908fa0] group-focus-within:text-[#c0c1ff] transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 pl-12 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                  placeholder="nom@entreprise.ai"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EXPERTISE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5de6ff]/10 flex items-center justify-center border border-[#5de6ff]/20">
                <Briefcase className="w-5 h-5 text-[#5de6ff]" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Expertise et Expérience
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Domaine principal
              </label>
              <select
                id="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="w-full bg-[#010f1f]/80 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm appearance-none"
              >
                {EXPERTISE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#051424]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Détails de votre expertise
              </label>
              <textarea
                id="expertise_detail"
                required
                value={formData.expertise_detail}
                onChange={handleChange}
                className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 min-h-[120px] focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                placeholder="Décrivez votre parcours, vos projets majeurs, vos publications scientifiques..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Votre CV (PDF / Word)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="cv_file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="cv_file"
                  className="flex items-center justify-between gap-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#c0c1ff]/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#273647] flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#c0c1ff]" />
                    </div>
                    <span className="text-sm text-[#c7c4d7]">
                      {cvFile ? cvFile.name : "Cliquez pour joindre votre dossier CV"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#908fa0]">MAX 10MB</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                  Profil LinkedIn
                </label>
                <div className="relative group">
                  <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#908fa0] group-focus-within:text-[#5de6ff] transition-colors" />
                  <input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 pl-12 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                  Portfolio / GitHub
                </label>
                <div className="relative group">
                  <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#908fa0] group-focus-within:text-white transition-colors" />
                  <input
                    id="portfolio_url"
                    type="url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 pl-12 focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: MOTIVATION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8083ff]/20 flex items-center justify-center border border-[#8083ff]/30">
                <GraduationCap className="w-5 h-5 text-[#c0c1ff]" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Motivation
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Expérience en enseignement
              </label>
              <textarea
                id="teaching_experience"
                value={formData.teaching_experience}
                onChange={handleChange}
                className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 min-h-[100px] focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                placeholder="Mentorat, conférences, cours universitaires, vulgarisation..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest ml-1">
                Pourquoi MLAcademy ?
              </label>
              <textarea
                id="motivation"
                required
                value={formData.motivation}
                onChange={handleChange}
                className="w-full bg-[#010f1f]/60 border border-white/10 text-white rounded-xl p-3.5 min-h-[150px] focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/10 transition-all text-sm"
                placeholder="Qu'est-ce qui vous motive à partager votre savoir sur notre plateforme ?"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#c0c1ff] text-[#1000a9] hover:bg-[#d4e4fa] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-2xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Envoyer ma candidature
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </section>

      {/* RIGHT COLUMN: BRAND & SOCIAL PROOF */}
      <section className="hidden lg:flex w-1/2 sticky top-0 h-screen border-l border-white/10 overflow-hidden flex-col items-center justify-center px-12 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="AI Neural Background"
            fill
            className="object-cover opacity-20 grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051424] via-transparent to-[#051424]/80"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-12">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#c0c1ff]/20 flex items-center justify-center mb-8 border border-[#c0c1ff]/30">
              <Bolt className="w-8 h-8 text-[#c0c1ff]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-8">
              Plus qu'une plateforme, <br />
              <span className="text-[#5de6ff] italic font-normal">une communauté.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#5de6ff] shrink-0 mt-1" />
                <p className="text-[#c7c4d7] font-medium text-sm">
                  Revenus attractifs basés sur vos ventes et contributions.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#5de6ff] shrink-0 mt-1" />
                <p className="text-[#c7c4d7] font-medium text-sm">
                  Outils de création simplifiés via MLAcademy Studio.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#5de6ff] shrink-0 mt-1" />
                <p className="text-[#c7c4d7] font-medium text-sm">
                  Support pédagogique et technique personnalisé.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#5de6ff] shrink-0 mt-1" />
                <p className="text-[#c7c4d7] font-medium text-sm">
                  Mise en avant de votre expertise auprès de l'industrie.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col gap-6 px-6">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-full border-2 border-[#051424] bg-[#122131] overflow-hidden relative"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    alt="Expert"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-2 border-[#051424] bg-[#122131] flex items-center justify-center text-[#c0c1ff] font-bold text-sm">
                +50
              </div>
            </div>
            <p className="text-[#c7c4d7] text-xs font-bold tracking-wider uppercase">
              Rejoignez nos experts <br />
              <span className="text-white font-extrabold">déjà actifs sur le Studio.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
