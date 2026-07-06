"use client";

import { useState } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { fetchApi } from '@/lib/api';
import { Upload,CheckCircle2,Loader2,ArrowRight,AlertCircle,TrendingUp,MonitorPlay, Users} from 'lucide-react';
import { EXPERTISE_OPTIONS } from '@/types/constant';


export default function InstructorApplyPage() {
=======
import Image from 'next/image';
import { fetchApi } from '@/lib/api';
// import { EXPERTISE_OPTIONS } from '@/types/constant';
import { User, Mail, Link as LinkIcon, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Loader2, Zap, MonitorPlay,Upload} from 'lucide-react';
import {FaLinkedin} from 'react-icons/fa';

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
  const [step, setStep] = useState(1);
>>>>>>> develop
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cv_url: '',
    linkedin_url: '',
    portfolio_url: '',
    website_url: '',
    expertise: 'machine_learning',
    expertise_detail: '',
    motivation: '',
    teaching_experience: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>('');
  const [success, setSuccess] = useState(false);
<<<<<<< HEAD
=======
  const [applicationId, setApplicationId] = useState<number | null>(null);
>>>>>>> develop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (cvFile) {
      data.append('cv_file', cvFile);
    }

    try {
<<<<<<< HEAD
      await fetchApi("/api/public/users/apply-instructor/", {
        method: "POST",
        body: data,
      });
=======
      const res = await fetchApi("/api/public/users/apply-instructeur/", {
        method: "POST",
        body: data,
      });
      if (res && res.id) {
        setApplicationId(res.id);
        // Save to localStorage automatically for direct access in status tracking
        localStorage.setItem("instructor_app_email", formData.email.trim());
        localStorage.setItem("instructor_app_dossier_id", res.id.toString());
      }
>>>>>>> develop
      setSuccess(true);
    } catch (err: any) {
      if (err.data && typeof err.data === 'object') {
        const firstError = Object.values(err.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const msg = err.message ;
        if (msg.toLowerCase().includes("déjà") || msg.toLowerCase().includes("en cours d'examen")) {
          setError(
<<<<<<< HEAD
            <div className="space-y-3 w-full text-sm">
              <p>{msg}</p>
              <Link href="/instructor/application/status" className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Consulter mon statut
=======
            <div className="space-y-4 w-full">
              <p>{msg}</p>
              <Link href="/instructor/application/status" className="btn bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 w-full py-3 rounded-xl block text-center hover:bg-indigo-500/30 transition-all">
                Consulter mon statut actuel
>>>>>>> develop
              </Link>
            </div>
          );
        } else if (msg.trim().startsWith("<!DOCTYPE") || msg.trim().startsWith("<html")) {
          setError("Une erreur interne est survenue sur le serveur. Notre équipe a été prévenue.");
        } else {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // VUE SUCCÈS (Minimaliste)
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Candidature reçue</h2>
          <p className="text-slate-600 text-sm mb-8">
            Merci {formData.first_name}. Notre équipe pédagogique va examiner votre profil. Vous recevrez une réponse sous 3 à 5 jours ouvrés.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Retour à l'accueil
            </Link>
            <Link href="/instructor/application/status" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Suivre ma candidature
=======
  if (success) {
    return (
      <div className="min-h-screen bg-[#090C14] flex items-center justify-center p-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="glass-card rounded-[32px] p-10 text-center space-y-8 animate-reveal max-w-md w-full relative z-10">
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tight">Candidature reçue !</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Merci <span className="text-white font-bold">{formData.first_name}</span> ! Notre équipe pédagogique va examiner votre profil. Vous recevrez une réponse sous 3 à 5 jours ouvrés.
            </p>
            {applicationId && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-1 animate-in fade-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Numéro de dossier unique</p>
                <p className="text-xl font-extrabold text-white">#{applicationId.toString().padStart(6, '0')}</p>
                <p className="text-[10px] text-slate-400">Conservez ce numéro précieusement pour suivre l'avancement de votre dossier.</p>
              </div>
            )}
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/" className="btn-secondary w-full py-4 rounded-xl text-lg">
              Accueil
            </Link>
            <Link href="/instructor/application/status" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Suivre ma candidature en temps réel
>>>>>>> develop
            </Link>
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // VUE FORMULAIRE (Split Screen)
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* LEFT COLUMN: FORM (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col p-6 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          
          <div className="mb-10">
            <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight mb-8 block">
              MLAcademy.
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Rejoindre le Studio
            </h1>
            <p className="text-slate-600 text-base">
              Partagez votre expertise technique avec la prochaine génération d'ingénieurs IA.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ALERTE ERREUR */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 font-medium">{error}</div>
              </div>
            )}

            {/* IDENTITÉ */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informations personnelles</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="first_name">Prénom</label>
                  <input id="first_name" type="text" required value={formData.first_name} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="last_name">Nom</label>
                  <input id="last_name" type="text" required value={formData.last_name} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Adresse e-mail</label>
                <input id="email" type="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
              </div>
            </div>

            {/* EXPERTISE */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Expertise professionnelle</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="expertise">Domaine principal</label>
                <select id="expertise" value={formData.expertise} onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors">
                  {EXPERTISE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
=======
  return (
    <div className="min-h-screen bg-[#090C14] flex items-stretch">
      {/* LEFT COLUMN: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start p-6 md:p-12 lg:p-20 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4"></div>

        <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <Link href="/instructor/application/status" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-12 hover:text-indigo-400 transition-colors">
            MLAcademy Studio
          </Link>

          <div className="mb-12">
            <h1 className="text-3xl md:text-3xl font-black text-white tracking-tight mb-4">
              Rejoignez le <span className="text-emerald-400">cercle des experts.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-lg">
              Partagez votre savoir, inspirez des milliers d'étudiants et développez votre influence dans le domaine de l'IA.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* ERROR ALERT */}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                <Zap className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* SECTION 1: IDENTITÉ */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Informations personnelles</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                  <input id="first_name" type="text" required value={formData.first_name} onChange={handleChange}
                    className="form-input-premium w-full" placeholder="Ex: Jean" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                  <input id="last_name" type="text" required value={formData.last_name} onChange={handleChange}
                    className="form-input-premium w-full" placeholder="Ex: Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse e-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input id="email" type="email" required value={formData.email} onChange={handleChange}
                    className="form-input-premium w-full pl-12" placeholder="nom@exemple.com" />
                </div>
                <p className="text-[10px] text-slate-500 italic ml-1">Utilisé pour l'identification et le suivi de candidature.</p>
              </div>
            </div>

            {/* SECTION 2: RÉSEAUX ET CV */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Expertise et Expérience</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Domaine principal</label>
                <select id="expertise" value={formData.expertise} onChange={handleChange} className="form-input-premium w-full appearance-none bg-slate-900/50">
                  {EXPERTISE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id} className="bg-[#090C14]">{opt.label}</option>
>>>>>>> develop
                  ))}
                </select>
              </div>

<<<<<<< HEAD
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="expertise_detail">Détails de votre expertise</label>
                <textarea id="expertise_detail" required value={formData.expertise_detail} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" 
                  placeholder="Décrivez votre parcours, vos projets majeurs..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Curriculum Vitae</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-slate-400 transition-colors bg-slate-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="cv_file" className="relative cursor-pointer bg-transparent rounded-md font-medium text-slate-900 hover:text-slate-700 focus-within:outline-none focus-within:underline">
                        <span>{cvFile ? cvFile.name : "Sélectionner un fichier"}</span>
                        <input id="cv_file" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PDF ou Word jusqu'à 5MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="linkedin_url">Profil LinkedIn (Optionnel)</label>
                  <input id="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="portfolio_url">GitHub / Portfolio (Optionnel)</label>
                  <input id="portfolio_url" type="url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
              </div>
            </div>

            {/* MOTIVATION */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Motivation</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="teaching_experience">Expérience en enseignement (Optionnel)</label>
                <textarea id="teaching_experience" value={formData.teaching_experience} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" 
                  placeholder="Avez-vous déjà donné des cours, mentoré, ou rédigé des articles ?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="motivation">Pourquoi MLAcademy ?</label>
                <textarea id="motivation" required value={formData.motivation} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Soumettre ma candidature <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
=======
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Détails de votre expertise</label>
                <textarea id="expertise_detail" required value={formData.expertise_detail} onChange={handleChange}
                  className="form-input-premium w-full min-h-[120px] py-4" placeholder="Décrivez votre parcours, vos projets majeurs, vos publications..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Votre CV (PDF / Word)</label>
                <div className="relative">
                  <input type="file" id="cv_file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                  <label htmlFor="cv_file" className="w-full flex items-center justify-between gap-4 bg-slate-900/50 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Upload className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-400 truncate">{cvFile ? cvFile.name : "Cliquez pour uploader votre CV"}</span>
                    </div>
                    {cvFile && <span className="text-[10px] font-bold text-emerald-400 uppercase">Fichier joint</span>}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Profil LinkedIn</label>
                  <div className="relative group">
                    <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#0077B5] transition-colors" />
                    <input id="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange}
                      className="form-input-premium w-full pl-12" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Portfolio / GitHub</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                    <input id="portfolio_url" type="url" value={formData.portfolio_url} onChange={handleChange}
                      className="form-input-premium w-full pl-12" placeholder="https://github.com/..." />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: MOTIVATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Motivation</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expérience en enseignement</label>
                <textarea id="teaching_experience" value={formData.teaching_experience} onChange={handleChange}
                  className="form-input-premium w-full min-h-[100px] py-4" placeholder="Tutos, mentorat, cours en université, articles techniques..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pourquoi MLAcademy ?</label>
                <textarea id="motivation" required value={formData.motivation} onChange={handleChange}
                  className="form-input-premium w-full min-h-[150px] py-4" placeholder="Qu'est-ce qui vous motive à partager votre savoir sur notre plateforme ?" />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="btn-primary w-full py-5 text-lg shadow-2xl shadow-indigo-500/30 rounded-[24px] flex items-center justify-center gap-3 group transition-transform active:scale-[0.98]">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Envoyer ma candidature <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
>>>>>>> develop
          </form>
        </div>
      </div>

<<<<<<< HEAD
      {/* RIGHT COLUMN: VALUE PROP (40%) - Fixe à l'écran sur Desktop */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-50 sticky top-0 h-screen flex-col justify-center p-12 xl:p-20">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Pourquoi devenir instructeur ?
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white border flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 ">Rémunération attractive</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Générez des revenus passifs sur chaque vente de vos cours. Notre modèle de partage de revenus est conçu pour récompenser l'expertise.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white border-t flex items-center justify-center shrink-0 shadow-sm">
                <MonitorPlay className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Le Studio MLAcademy</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Profitez d'outils de création de pointe, d'un hébergement vidéo fluide et d'un support pédagogique dédié pour structurer vos contenus.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Audience qualifiée</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Touchez directement des milliers de professionnels et d'étudiants motivés, sans avoir à gérer le marketing vous-même.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-slate-500 font-medium">
              Déjà plus de 50 experts ont rejoint le programme d'instructeurs en 2026.
=======
      {/* RIGHT COLUMN: BRANDING & TESTIMONIAL */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900/10 items-center justify-center p-12 overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#090C14] via-transparent to-transparent z-10 opacity-60"></div>
        
        {/* Full background image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/registration_illustration.png" 
            alt="MLAcademy Studio Background" 
            fill 
            className="object-cover object-center grayscale opacity-30" 
          />
        </div>

        <div className="relative z-20 max-w-lg space-y-12">
          <div className="glass-card rounded-[40px] p-10 border border-white/10 backdrop-blur-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8">
              <MonitorPlay className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Plus qu'une plateforme, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">une communauté.</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, text: "Revenus attractifs sur chaque vente de cours." },
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, text: "Outils de création de cours simplifiés (Studio)." },
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, text: "Support pédagogique personnalisé pour vos contenus." },
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, text: "Mise en avant de votre profil auprès de recruteurs." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1">{item.icon}</div>
                  <p className="text-slate-300 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#090C14] bg-slate-800 overflow-hidden">
                  <Image src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Expert" width={48} height={48} />
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm font-bold">
              Rejoignez +50 experts <br />
              <span className="text-white">déjà actifs sur le Studio.</span>
>>>>>>> develop
            </p>
          </div>
        </div>
      </div>
<<<<<<< HEAD

    </div>
  );
}
=======
    </div>
  );
}
>>>>>>> develop
