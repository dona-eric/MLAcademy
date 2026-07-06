"use client";

<<<<<<< HEAD
import { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  Search, Clock, Eye, CheckCircle2, XCircle,
  ArrowLeft, Loader2, Zap, AlertCircle,
  Calendar, FileText, ChevronRight
} from 'lucide-react';

const STATUS_MAP = {
  'pending': {
    label: 'En attente',
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    color: 'amber',
    desc: 'Votre dossier a été bien reçu et attend d\'être ouvert par un membre de notre équipe.'
  },
  'reviewing': {
    label: 'En cours d\'examen',
    icon: <Eye className="w-6 h-6 text-indigo-500" />,
    color: 'indigo',
    desc: 'Un administrateur est actuellement en train d\'analyser votre parcours et vos motivations.'
  },
  'approved': {
    label: 'Approuvée',
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    color: 'emerald',
    desc: 'Félicitations ! Votre candidature a été acceptée. Vérifiez vos e-mails pour activer votre compte.'
  },
  'rejected': {
    label: 'Refusée',
    icon: <XCircle className="w-6 h-6 text-red-500" />,
    color: 'red',
    desc: 'Malheureusement, votre candidature n\'a pas été retenue pour le moment.'
=======
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { Clock, Eye, CheckCircle2, XCircle, ArrowLeft, Sparkles, Loader2, Zap, AlertCircle, Calendar, FileText, ChevronRight, Mail, ClipboardCheck} from "lucide-react";

interface InstructorApplicationStatus {
  id: number;
  status: "pending" | "reviewing" | "approved" | "rejected" | "changes_requested";
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

const STATUS_MAP = {
  pending: { 
    label: "En attente", 
    icon: <Clock className="w-6 h-6 text-amber-400" />, 
    desc: "Votre dossier a été bien reçu et attend d'être ouvert par un membre de notre équipe pédagogique."
  },
  reviewing: { 
    label: "En cours d'examen", 
    icon: <Eye className="w-6 h-6 text-indigo-400" />, 
    desc: "Un administrateur est actuellement en train d'analyser votre parcours, vos expertises et vos motivations."
  },
  changes_requested: { 
    label: "Modifications requises", 
    icon: <AlertCircle className="w-6 h-6 text-orange-400" />, 
    desc: "Des précisions ou des pièces complémentaires (ex: portfolio, exemple de cours) sont nécessaires pour finaliser votre dossier. Veuillez consulter vos e-mails."
  },
  approved: { 
    label: "Approuvée", 
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />, 
    desc: "Félicitations ! Votre candidature a été acceptée. Un e-mail de bienvenue vous a été envoyé pour activer votre compte MLAcademy Studio."
  },
  rejected: { 
    label: "Refusée", 
    icon: <XCircle className="w-6 h-6 text-rose-400" />, 
    desc: "Malheureusement, votre profil ne correspond pas à nos besoins actuels. Nous conservons votre dossier pour de futures opportunités."
  }
};

const STATUS_STYLES = {
  pending: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "bg-amber-500/10"
  },
  reviewing: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "bg-indigo-500/10"
  },
  changes_requested: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    glow: "bg-orange-500/10"
  },
  approved: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "bg-emerald-500/10"
  },
  rejected: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    glow: "bg-rose-500/10"
>>>>>>> develop
  }
};

export default function ApplicationStatusPage() {
<<<<<<< HEAD
  const [email, setEmail] = useState('');
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setStatusData(null);

    try {
      const data = await fetchApi(`/api/public/users/instructor-status/?email=${encodeURIComponent(email)}`);
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || "Candidature introuvable pour cet e-mail.");
=======
  const [email, setEmail] = useState("");
  const [dossierId, setDossierId] = useState("");
  const [statusData, setStatusData] = useState<InstructorApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Point #9: Auto-load credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("instructor_app_email");
    const savedDossierId = localStorage.getItem("instructor_app_dossier_id");
    if (savedEmail && savedDossierId) {
      setEmail(savedEmail);
      setDossierId(savedDossierId);
      autoSearch(savedEmail, savedDossierId);
    }
  }, []);

  const autoSearch = async (savedEmail: string, savedDossierId: string) => {
    setLoading(true);
    setError("");
    setStatusData(null);
    try {
      const data = await fetchApi(
        `/api/public/users/instructeur-status/?email=${encodeURIComponent(savedEmail)}&dossier_id=${encodeURIComponent(savedDossierId)}`
      );
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger automatiquement votre dossier.");
>>>>>>> develop
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12">

      <div className="w-full max-w-2xl relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">

        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 hover:text-indigo-600 transition-colors">
            MLAcademy
          </Link>
          <Link href="/instructor/apply" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            Nouvelle candidature <ChevronRight className="w-4 h-4" />
=======
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !dossierId) {
      setError("Veuillez saisir votre adresse e-mail et votre numéro de dossier.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusData(null);

    try {
      const data = await fetchApi(
        `/api/public/users/instructeur-status/?email=${encodeURIComponent(email.trim())}&dossier_id=${encodeURIComponent(dossierId.trim())}`
      );
      setStatusData(data);
      
      // Save credentials for future visits
      localStorage.setItem("instructor_app_email", email.trim());
      localStorage.setItem("instructor_app_dossier_id", dossierId.trim());
    } catch (err: any) {
      setError(
        err.message || 
        "Dossier introuvable. Veuillez vérifier vos informations de connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  // Determine current application status mapping and styling safely (Point #5)
  const currentStatus = statusData ? (STATUS_MAP[statusData.status] ?? STATUS_MAP.pending) : STATUS_MAP.pending;
  const currentStyle = statusData ? (STATUS_STYLES[statusData.status] ?? STATUS_STYLES.pending) : STATUS_STYLES.pending;

  // Timeline computation helper (Point #7)
  const getTimelineSteps = (status: string) => {
    const steps = [
      { id: "received", label: "Candidature reçue", active: true, done: true },
      { id: "review", label: "Vérification du profil", active: false, done: false },
      { id: "eval", label: "Évaluation pédagogique", active: false, done: false },
      { id: "final", label: "Validation finale", active: false, done: false }
    ];

    if (status === "reviewing") {
      steps[1].active = true;
    } else if (status === "changes_requested") {
      steps[1].done = true;
      steps[2].active = true;
    } else if (status === "approved" || status === "rejected") {
      steps[1].done = true;
      steps[2].done = true;
      steps[3].active = true;
      steps[3].done = true;
    } else {
      // pending
      steps[1].active = true;
    }
    return steps;
  };

  const timelineSteps = statusData ? getTimelineSteps(statusData.status) : [];

  return (
    <div className="min-h-screen bg-[#090C14] flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      <div className="w-full max-w-3xl relative z-10 space-y-12">
        
        {/* Navbar logo */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 hover:text-indigo-400 transition-colors">
            <Sparkles className="w-6 h-6 text-indigo-400" /> MLAcademy
          </Link>
          <Link href="/devenir-instructeur" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            Poser votre candidature <ChevronRight className="w-4 h-4" />
>>>>>>> develop
          </Link>
        </div>

        {/* Title */}
<<<<<<< HEAD
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Suivi de candidature</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Entrez l'adresse email utilisée lors de votre inscription pour consulter l'état d'avancement de votre dossier.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="votre-email@exemple.com"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm sm:w-auto w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vérifier le statut'}
=======
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Suivi de <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">candidature</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Saisissez l'e-mail de contact et le numéro de dossier unique communiqué lors de votre candidature pour suivre votre avancement.
          </p>
        </div>

        {/* Search Panel Card */}
        <div className="glass-card rounded-[32px] p-8 border border-white/5 bg-slate-900/20 backdrop-blur-xl relative">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative group md:col-span-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="form-input-premium pl-12"
                placeholder="E-mail de candidature"
              />
            </div>
            
            <div className="relative group md:col-span-2">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                required 
                value={dossierId} 
                onChange={(e) => setDossierId(e.target.value)}
                className="form-input-premium pl-12"
                placeholder="Numéro de dossier (ex: 42)"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full h-full rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 md:col-span-1 shadow-lg shadow-indigo-500/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vérifier"}
>>>>>>> develop
            </button>
          </form>

          {error && (
<<<<<<< HEAD
            <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> <p>{error}</p>
=======
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
>>>>>>> develop
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Result Card */}
        {statusData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border
                    ${statusData.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : ''}
                    ${statusData.status === 'reviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : ''}
                    ${statusData.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : ''}
                    ${statusData.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-600' : ''}
                  `}>
                  {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut actuel</p>
                  <h2 className="text-xl font-semibold text-slate-900 mt-1">{STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].label}</h2>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Dernière mise à jour</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(statusData.reviewed_at || statusData.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].desc}
                </p>
              </div>

              {statusData.status === 'rejected' && statusData.rejection_reason && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Motif du refus
                  </h3>
                  <div className="p-5 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm leading-relaxed">
                    {statusData.rejection_reason}
                  </div>
                </div>
              )}

              {statusData.status === 'approved' && (
                <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-100 space-y-2 text-center">
                  <p className="text-emerald-800 font-semibold text-sm">Votre compte est activé !</p>
                  <p className="text-emerald-700/80 text-sm">
                    Cliquez sur le lien reçu par e-mail pour définir votre mot de passe et accéder au Studio.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> ID Dossier: #{statusData.id.toString().padStart(6, '0')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Soumis le {new Date(statusData.submitted_at).toLocaleDateString('fr-FR')}
              </div>
            </div>

          </div>
          </div>
        )}

      <div className="mt-auto pt-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    </div>
    </div >
=======
        {/* Dashboard Status Result (Point #10) */}
        {statusData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
            <div className="glass-card rounded-[32px] p-8 md:p-10 border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/50 to-black relative overflow-hidden shadow-2xl">
              
              {/* Point #2: Styled safely with explicit styles map */}
              <div className={`absolute top-0 right-0 w-64 h-64 ${currentStyle.glow} blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>

              {/* Header Info Block */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${currentStyle.bg} border ${currentStyle.border} flex items-center justify-center shrink-0`}>
                    {currentStatus.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dossier #{statusData.id.toString().padStart(6, "0")}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${currentStyle.bg} ${currentStyle.text} border ${currentStyle.border}`}>
                        {currentStatus.label}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white mt-1">Portail Candidat Instructeur</h2>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernière activité</p>
                  <div className="flex items-center md:justify-end gap-2 text-slate-300 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {new Date(statusData.reviewed_at || statusData.submitted_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Status explanation block */}
              <div className="py-8 space-y-6 border-b border-white/5 relative z-10">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-slate-300 leading-relaxed text-sm font-medium">
                    {currentStatus.desc}
                  </p>
                </div>

                {/* Rejection / Modification details */}
                {statusData.status === "rejected" && statusData.rejection_reason && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Motif d'ajustement / Décision
                    </h3>
                    <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-slate-400 text-sm leading-relaxed">
                      {statusData.rejection_reason}
                    </div>
                  </div>
                )}

                {statusData.status === "changes_requested" && statusData.rejection_reason && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Détails des pièces demandées
                    </h3>
                    <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-slate-300 text-sm leading-relaxed">
                      {statusData.rejection_reason}
                    </div>
                  </div>
                )}

                {statusData.status === "approved" && (
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2">
                    <p className="text-emerald-400 font-bold text-sm">Votre espace formateur est prêt !</p>
                    <p className="text-slate-400 text-xs">Veuillez cliquer sur le lien d'activation sécurisé reçu par e-mail pour finaliser la création de votre profil.</p>
                  </div>
                )}
              </div>

              {/* Recruitment Step Timeline (Point #7) */}
              <div className="pt-8 space-y-4 relative z-10">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-400" /> Progression du processus de recrutement
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                  {timelineSteps.map((stepItem, idx) => (
                    <div 
                      key={stepItem.id} 
                      className={`p-4 rounded-2xl border ${
                        stepItem.done 
                          ? "bg-indigo-500/5 border-indigo-500/20 text-white" 
                          : stepItem.active
                            ? "bg-slate-900/80 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/5"
                            : "bg-slate-950/20 border-white/5 text-slate-500"
                      } space-y-2 transition-all duration-300`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest">Étape 0{idx + 1}</span>
                        {stepItem.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : stepItem.active ? (
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-bold leading-tight">{stepItem.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimations & dates */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Temps de traitement estimé : 3 à 5 jours ouvrés
                </div>
                <div>
                  Soumise le {new Date(statusData.submitted_at).toLocaleDateString("fr-FR")}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center relative z-10 pt-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors inline-flex items-center gap-2 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
>>>>>>> develop
  );
}
