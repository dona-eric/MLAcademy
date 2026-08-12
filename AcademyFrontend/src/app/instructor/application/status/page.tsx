"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import { Eye, Check, Clock, ShieldCheck, Calendar, Info, Brain, Mail, FileText, Loader2, AlertCircle, ArrowLeft, CheckCircle2, XCircle, Search, } from "lucide-react";

interface InstructorApplicationStatus {
  id: number;
  status: "pending" | "reviewing" | "approved" | "rejected" | "changes_requested";
  status_display?: string;
  submitted_at: string;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
}

const STATUS_MAP = {
  pending: {
    label: "EN ATTENTE",
    badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Clock className="w-8 h-8 text-amber-400" />,
    title: "Réception",
    subtitle: "Dossier en file d'attente",
    desc: "Votre candidature a été bien enregistrée. Notre équipe pédagogique va procéder à l'analyse initiale de vos informations.",
    progressWidth: "25%",
    estimatedTime: "24h - 48h",
    nextStep: "Examen préliminaire du profil",
    activeStepIndex: 1,
  },
  reviewing: {
    label: "EN COURS",
    badgeStyle: "bg-[#5de6ff]/10 text-[#5de6ff] border-[#5de6ff]/20",
    icon: <Eye className="w-8 h-8 text-[#5de6ff]" />,
    title: "Évaluation",
    subtitle: "Profil en revue active",
    desc: "Votre profil a passé la première phase de filtrage. Notre équipe pédagogique analyse actuellement votre parcours, votre portfolio et vos contributions techniques.",
    progressWidth: "65%",
    estimatedTime: "48h - 72h",
    nextStep: "Entretien technique (Visio) ou décision finale",
    activeStepIndex: 2,
  },
  changes_requested: {
    label: "ACTION REQUISE",
    badgeStyle: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    icon: <AlertCircle className="w-8 h-8 text-orange-400" />,
    title: "Complément d'information",
    subtitle: "Pièces complémentaires requises",
    desc: "Des pièces complémentaires ou des précisions sont nécessaires pour continuer l'évaluation de votre dossier. Consultez la remarque ci-dessous ainsi que vos e-mails.",
    progressWidth: "50%",
    estimatedTime: "En attente de vos pièces",
    nextStep: "Envoi des informations complémentaires",
    activeStepIndex: 2,
  },
  approved: {
    label: "VALIDÉE",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
    title: "Validation",
    subtitle: "Candidature acceptée",
    desc: "Félicitations ! Votre candidature d'instructeur a été approuvée. Un e-mail de bienvenue vous a été envoyé pour activer votre compte MLAcademy Studio.",
    progressWidth: "100%",
    estimatedTime: "Terminé",
    nextStep: "Création et publication de vos cours",
    activeStepIndex: 3,
  },
  rejected: {
    label: "REFUSÉE",
    badgeStyle: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: <XCircle className="w-8 h-8 text-rose-400" />,
    title: "Décision",
    subtitle: "Dossier non retenu",
    desc: "Nous vous remercions pour votre intérêt envers MLAcademy. Après examen, votre candidature n'a pas été retenue pour cette session.",
    progressWidth: "100%",
    estimatedTime: "Terminé",
    nextStep: "Dossier archivé",
    activeStepIndex: 3,
  },
};

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState("");
  const [dossierId, setDossierId] = useState("");
  const [statusData, setStatusData] = useState<InstructorApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

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
    setHasSearched(true);
    try {
      const data = await fetchApi(
        `/api/public/users/instructeur-status/?email=${encodeURIComponent(savedEmail)}&dossier_id=${encodeURIComponent(savedDossierId)}`
      );
      if (data && data.status) {
        setStatusData(data);
      }
    } catch (err: any) {
      setError(err.message || "Impossible de charger les informations de votre dossier.");
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !dossierId) {
      setError("Veuillez saisir votre adresse e-mail et votre numéro de dossier.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await fetchApi(
        `/api/public/users/instructeur-status/?email=${encodeURIComponent(email.trim())}&dossier_id=${encodeURIComponent(dossierId.trim())}`
      );
      if (data && data.status) {
        setStatusData(data);
        localStorage.setItem("instructor_app_email", email.trim());
        localStorage.setItem("instructor_app_dossier_id", dossierId.trim());
      }
    } catch (err: any) {
      setStatusData(null);
      setError(
        err.message ||
          "Aucune candidature n'a été trouvée avec cet e-mail et ce numéro de dossier."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatusConfig = statusData
    ? STATUS_MAP[statusData.status] ?? STATUS_MAP.pending
    : STATUS_MAP.pending;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return null;
    }
  };

  const submittedDateStr = statusData ? formatDate(statusData.submitted_at) : null;
  const reviewedDateStr = statusData ? formatDate(statusData.reviewed_at) : null;

  return (
    <div className="bg-[#051424] text-[#d4e4fa] min-h-screen font-sans relative overflow-x-hidden">
      {/* Atmospheric Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-4/5 h-[40%] bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[50%] bg-[radial-gradient(circle,rgba(93,230,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/[0.03] backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end items-center">
          <Link
            href="/devenir-instructeur"
            className="flex items-center gap-2 text-[#c7c4d7] hover:text-[#5de6ff] transition-colors duration-300 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Devenir instructeur</span>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto relative z-10">
        {/* Page Title */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            Suivi de <span className="text-[#5de6ff] italic font-normal">candidature</span>
          </h1>
          <p className="text-[#c7c4d7] text-lg max-w-2xl mx-auto leading-relaxed">
            Accédez à l'état d'avancement de votre dossier en temps réel et préparez-vous à rejoindre l'élite de l'enseignement AI.
          </p>
        </div>

        {/* Search Panel (The Portal) */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-xl shadow-[0_0_40px_rgba(99,102,241,0.15)]">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end" id="searchForm">
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-[#908fa0] uppercase tracking-widest block">
                  E-MAIL PROFESSIONNEL
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0] group-focus-within:text-[#5de6ff] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#010f1f] border border-white/10 rounded-lg px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] transition-all"
                    placeholder="nom@exemple.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-[#908fa0] uppercase tracking-widest block">
                  NUMÉRO DE DOSSIER
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0] group-focus-within:text-[#5de6ff] transition-colors" />
                  <input
                    type="text"
                    required
                    value={dossierId}
                    onChange={(e) => setDossierId(e.target.value)}
                    className="w-full bg-[#010f1f] border border-white/10 rounded-lg px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] transition-all"
                    placeholder="ML-XXXXXX ou 42"
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c0c1ff] text-[#0d0096] hover:bg-[#8083ff] hover:text-white py-4 rounded-lg font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_40px_rgba(99,102,241,0.15)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "VÉRIFIER LE STATUT"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Results Dashboard Section */}
        {statusData ? (
          <section className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500" id="resultsSection">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Status Highlight Card */}
              <div className="lg:col-span-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[12px] font-black text-[#908fa0] uppercase tracking-widest">
                      STATUT ACTUEL
                    </span>
                    <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase border ${currentStatusConfig.badgeStyle}`}>
                      {statusData.status_display || currentStatusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#5de6ff]/10 flex items-center justify-center border border-[#5de6ff]/30 shrink-0">
                      {currentStatusConfig.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-white">
                        {currentStatusConfig.title}
                      </h3>
                      <p className="text-[#c7c4d7] text-sm">{currentStatusConfig.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-[#c7c4d7] text-sm leading-relaxed mb-6">
                    {currentStatusConfig.desc}
                  </p>

                  {statusData.rejection_reason && (
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-xs text-[#c7c4d7] mb-6">
                      <span className="font-bold text-white block mb-1">Raison / Remarque :</span>
                      {statusData.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#908fa0] text-sm">Délai estimé</span>
                    <span className="text-white font-semibold text-sm">
                      {currentStatusConfig.estimatedTime}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c0c1ff] to-[#5de6ff] h-full transition-all duration-500"
                      style={{ width: currentStatusConfig.progressWidth }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Timeline and Details: PROGRESSION DU DOSSIER */}
              <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-12">
                    Progression du dossier
                  </h3>

                  {/* Horizontal Timeline Track */}
                  <div className="relative mb-16">
                    {/* Background Track Line */}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10 z-0"></div>
                    {/* Active Track Line */}
                    <div
                      className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-[#c0c1ff] to-[#5de6ff] z-0 transition-all duration-500"
                      style={{
                        width:
                          currentStatusConfig.activeStepIndex === 1
                            ? "33%"
                            : currentStatusConfig.activeStepIndex === 2
                            ? "66%"
                            : "100%",
                      }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                      {/* Step 1: REÇUE */}
                      <div className="flex flex-col items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-[#c0c1ff] flex items-center justify-center text-[#0d0096] shadow-lg">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                        <div className="text-center">
                          <p className="text-[12px] font-black tracking-widest uppercase text-[#c0c1ff] mb-1">
                            REÇUE
                          </p>
                          <p className="text-[11px] text-[#908fa0]">
                            {submittedDateStr || "Enregistrée"}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: VÉRIFICATION */}
                      <div className="flex flex-col items-center gap-4 group">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            currentStatusConfig.activeStepIndex >= 2
                              ? "bg-[#c0c1ff] text-[#0d0096]"
                              : "bg-[#051424] border-2 border-[#5de6ff] text-[#5de6ff]"
                          }`}
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                        <div className="text-center">
                          <p className="text-[12px] font-black tracking-widest uppercase text-[#c0c1ff] mb-1">
                            VÉRIFICATION
                          </p>
                          <p className="text-[11px] text-[#908fa0]">
                            {reviewedDateStr || (currentStatusConfig.activeStepIndex >= 2 ? "Validée" : "En cours")}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: ÉVALUATION */}
                      <div className="flex flex-col items-center gap-4 group">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            statusData.status === "approved" || statusData.status === "rejected"
                              ? "bg-[#c0c1ff] text-[#0d0096]"
                              : currentStatusConfig.activeStepIndex === 2
                              ? "bg-[#051424] border-2 border-[#5de6ff] text-[#5de6ff] shadow-[0_0_15px_rgba(93,230,255,0.4)]"
                              : "bg-[#273647] text-[#908fa0]"
                          }`}
                        >
                          {statusData.status === "approved" || statusData.status === "rejected" ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-center">
                          <p
                            className={`text-[12px] font-black tracking-widest uppercase mb-1 ${
                              currentStatusConfig.activeStepIndex === 2 ? "text-[#5de6ff]" : "text-[#908fa0]"
                            }`}
                          >
                            ÉVALUATION
                          </p>
                          <p className="text-[11px] text-white">
                            {statusData.status === "approved" || statusData.status === "rejected"
                              ? "Terminée"
                              : currentStatusConfig.activeStepIndex === 2
                              ? "En cours"
                              : "À venir"}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: VALIDATION */}
                      <div
                        className={`flex flex-col items-center gap-4 group ${
                          statusData.status !== "approved" && statusData.status !== "rejected" ? "opacity-40" : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            statusData.status === "approved"
                              ? "bg-[#c0c1ff] text-[#0d0096]"
                              : statusData.status === "rejected"
                              ? "bg-rose-500 text-white"
                              : "bg-[#273647] text-[#908fa0]"
                          }`}
                        >
                          {statusData.status === "approved" ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : statusData.status === "rejected" ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <ShieldCheck className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-[12px] font-black tracking-widest uppercase text-[#908fa0] mb-1">
                            VALIDATION
                          </p>
                          <p className="text-[11px] text-[#908fa0]">
                            {statusData.status === "approved"
                              ? "Approuvée"
                              : statusData.status === "rejected"
                              ? "Non retenue"
                              : "À venir"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informational Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div className="flex gap-4 items-center">
                    <Calendar className="w-6 h-6 text-[#c0c1ff] shrink-0" />
                    <div>
                      <p className="text-[12px] font-black text-[#908fa0] uppercase tracking-widest mb-1">
                        DATE DE SOUMISSION
                      </p>
                      <p className="text-[#d4e4fa] font-medium text-sm">
                        {statusData ? (
                          new Date(statusData.submitted_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        ) : (
                          "---"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <Info className="w-6 h-6 text-[#5de6ff] shrink-0" />
                    <div>
                      <p className="text-[12px] font-black text-[#908fa0] uppercase tracking-widest mb-1">
                        PROCHAINE ÉTAPE
                      </p>
                      <p className="text-[#d4e4fa] font-medium text-sm">
                        {currentStatusConfig.nextStep}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-indigo-500/20">
              <div className="flex gap-6 items-center">
                <div className="p-3 bg-[#c0c1ff]/10 rounded-lg text-[#c0c1ff] border border-[#c0c1ff]/20">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white mb-1">
                    Besoin d'aide ou de modifications ?
                  </h4>
                  <p className="text-[#c7c4d7] text-sm">
                    Contactez directement notre support dédié aux instructeurs pour toute question.
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@mlacademy.ai"
                className="px-8 py-3 bg-transparent border border-white/10 hover:border-[#c0c1ff] text-[#d4e4fa] hover:text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap"
              >
                SUPPORT TECHNIQUE
              </a>
            </div>
          </section>
        ) : (
          !loading && (
            <div className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <Search className="w-10 h-10 text-[#5de6ff]/50 mx-auto" />
              <p className="text-white font-medium text-sm">
                Consultez l'avancement de votre dossier instructeur
              </p>
              <p className="text-[#908fa0] text-xs leading-relaxed">
                Entrez votre adresse e-mail professionnelle et votre numéro de dossier reçu lors de votre candidature pour afficher votre tableau de suivi en temps réel.
              </p>
            </div>
          )
        )}

        {/* Decorative illustration/background element */}
        <div className="mt-20 flex justify-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="relative w-full max-w-4xl h-64 rounded-3xl overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
              alt="Futuristic AI Laboratory Background"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051424] via-transparent to-transparent"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
