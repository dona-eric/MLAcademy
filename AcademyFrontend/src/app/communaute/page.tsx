"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Plus, X, ArrowRight, CheckCircle,} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { TalentProfile, JobOffer, SponsoredChallenge, CommunityGlobalStats } from "@/types/community";
import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityTabs, TabType } from "@/components/community/CommunityTabs";
import { TalentCard } from "@/components/community/TalentCard";
import { JobCard } from "@/components/community/JobCard";
import { ChallengeCard } from "@/components/community/ChallengeCard";
import { Leaderboard } from "@/components/community/Leaderboard";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  time: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('talents');
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [challenges, setChallenges] = useState<SponsoredChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<TalentProfile[]>([]);
  const [stats, setStats] = useState<CommunityGlobalStats | null>(null);

  // Registration Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regCountry, setRegCountry] = useState("Sénégal");
  const [regEmail, setRegEmail] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regSkills, setRegSkills] = useState("");
  const [regGithub, setRegGithub] = useState("");
  const [regLinkedin, setRegLinkedin] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Kibo AI Career Coach Sidebar States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Salutations chaleureuses ! 🌍 Je suis Kibo, votre Conseiller IA d'Orientation et Coach de Carrière pour la communauté ML africaine.\n\nJe suis là pour vous aider à analyser votre CV, vous guider sur les architectures PNL/CV appliquées au contexte africain, ou vous orienter vers les offres de recrutement et challenges du Hub.\n\nQue souhaitez-vous explorer aujourd'hui ?",
      time: new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const countries = [
    "Sénégal", "Nigeria", "Kenya", "Afrique du Sud", "Égypte", "Ghana", "Éthiopie", "Côte d'Ivoire", "Maroc", "Tunisie", "Cameroun", "Rwanda"
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  async function loadStats() {
    try {
      const statsData = await fetchApi('/api/community/stats/');
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load community stats", err);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'talents') {
        const data = await fetchApi(`/api/community/talents/?search=${encodeURIComponent(searchQuery)}`);
        setTalents(Array.isArray(data) ? data : data.results || []);
      } else if (activeTab === 'leaderboard') {
        const data = await fetchApi(`/api/community/leaderboard/?search=${encodeURIComponent(searchQuery)}`);
        setLeaderboard(Array.isArray(data) ? data : data.results || []);
      } else if (activeTab === 'jobs') {
        const data = await fetchApi(`/api/community/jobs/?search=${encodeURIComponent(searchQuery)}`);
        setJobs(Array.isArray(data) ? data : data.results || []);
      } else if (activeTab === 'challenges') {
        const data = await fetchApi(`/api/community/challenges/?search=${encodeURIComponent(searchQuery)}`);
        setChallenges(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch community data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regRole || !regCountry || !regEmail) return;

    setRegisterLoading(true);
    try {
      const skillsArr = regSkills.split(',').map(s => s.trim()).filter(Boolean);
      await fetchApi('/api/community/talents/', {
        method: "POST",
        body: JSON.stringify({
          name: regName,
          role: regRole,
          country: regCountry,
          email: regEmail,
          bio: regBio,
          skills: skillsArr,
          github: regGithub,
          linkedin: regLinkedin
        })
      });

      setRegisterSuccess(true);
      loadStats();
      if (activeTab === 'talents' || activeTab === 'leaderboard') {
        loadData();
      }

      // Reset fields upon success
      setTimeout(() => {
        setIsRegisterOpen(false);
        setRegisterSuccess(false);
        setRegName("");
        setRegRole("");
        setRegBio("");
        setRegSkills("");
        setRegGithub("");
        setRegLinkedin("");
        setRegEmail("");
      }, 2000);
    } catch (err) {
      console.error("Registration error", err);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsgText = userInput;
    setUserInput("");

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userMsgText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatLoading(true);

    try {
      // Map chat context format
      const historyFormatted = chatMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text
      }));

      const response = await fetchApi('/api/community/chat/', {
        method: "POST",
        body: JSON.stringify({
          message: userMsgText,
          chatHistory: historyFormatted
        })
      });

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: "model",
        text: response.reply,
        time: new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error("Chat communication failure", err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "Oups ! Je rencontre un problème technique temporaire pour me connecter au pôle de calcul de l'IA Kibo. Veuillez réessayer dans quelques instants.",
        time: new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-50 min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Filtrage en cours...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'talents':
        if (talents.length === 0) return <EmptyState message="Aucun talent ne correspond à votre recherche." />;
        return (
          <motion.div
            key="talents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {talents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </motion.div>
        );

      case 'leaderboard':
        return (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <Leaderboard talents={leaderboard} />
          </motion.div>
        );

      case 'jobs':
        if (jobs.length === 0) return <EmptyState message="Aucune offre d'emploi disponible." />;
        return (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 animate-enter"
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApplySuccess={loadStats} />
            ))}
          </motion.div>
        );

      case 'challenges':
        if (challenges.length === 0) return <EmptyState message="Aucun challenge n'est actif pour le moment." />;
        return (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8"
          >
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onRegisterSuccess={loadStats} />
            ))}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090C14] text-white flex flex-col font-sans select-none antialiased overflow-hidden relative">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      {/* Hero Header component */}
      <CommunityHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        activeTab={activeTab}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />

      {/* Main Tab switching container and profiles displays */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-32 pt-12 flex-grow w-full">
        <CommunityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </section>

      {/* --- COMMUNITY STATS --- */}
      {stats && (
        <section className="bg-white/[0.01] border-t border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">L'Écosystème en Chiffres</h2>
              <p className="text-slate-400 text-xs mt-1">La plateforme de talents ML la plus dynamique d'Afrique.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StatItem label="Pionniers Active" value={stats.totalTalents} color="text-indigo-400 animate-pulse" />
              <StatItem label="Challenges en Cours" value={stats.activeChallenges} color="text-amber-400" />
              <StatItem label="Candidatures Traitées" value={stats.applicationsProcessed} color="text-cyan-400" />
            </div>
          </div>
        </section>
      )}

      {/* REGISTRATION MODAL FORM */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            {/* Backdrop Close action handler */}
            <div className="absolute inset-0 cursor-pointer pointer-events-auto" onClick={() => setIsRegisterOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl p-8 rounded-[36px] bg-[#0c0f1b] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10"
            >
              {/* Colored Corner Accents */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-400" />
                    <span>REJOINDRE L'ÉCOSYSTÈME ACADEMY</span>
                  </h2>
                  <p className="text-[10px] uppercase font-mono text-slate-500 mt-1">Créez votre profil de chercheur d'IA</p>
                </div>
                <button
                  id="close-reg-modal-btn"
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {registerSuccess ? (
                <div id="reg-success-banner" className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-8 h-8 font-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Profil Enregistré avec Succès !</h3>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Vous appartenez désormais à la plus prestigieuse communauté de chercheurs ML d'Afrique. Attendez-vous à recevoir 100 XP initiaux.
                  </p>
                </div>
              ) : (
                <form id="reg-actual-form-submission" onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nom Complet *</label>
                      <input
                        id="reg-input-name"
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Amina Diallo"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rôle / Spécialisation *</label>
                      <input
                        id="reg-input-role"
                        type="text"
                        required
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="NLP Research Scientist"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pays *</label>
                      <select
                        id="reg-input-country"
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c} className="bg-[#111422] text-white pr-4">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Courriel de contact *</label>
                      <input
                        id="reg-input-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="amina@mlmail.sn"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Technologies et Outils (séparés par des virgules) *</label>
                    <input
                      id="reg-input-skills"
                      type="text"
                      required
                      value={regSkills}
                      onChange={(e) => setRegSkills(e.target.value)}
                      placeholder="PyTorch, Hugging Face, Wolof NLP, Scikit-Learn"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">GitHub URL</label>
                      <input
                        id="reg-input-github"
                        type="url"
                        value={regGithub}
                        onChange={(e) => setRegGithub(e.target.value)}
                        placeholder="https://github.com/votre-user"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
                      <input
                        id="reg-input-linkedin"
                        type="url"
                        value={regLinkedin}
                        onChange={(e) => setRegLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/votre-profil"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mini Biographie ou projets phares</label>
                    <textarea
                      id="reg-input-bio"
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      rows={3}
                      placeholder="Parlez-nous de vos contributions locales (NLP, AgriTech, Vision artificielle)..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs resize-none"
                    />
                  </div>

                  <button
                    id="reg-submit-btn"
                    type="submit"
                    disabled={registerLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 disabled:bg-indigo-850 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {registerLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Valider mon inscription</span>
                        <ArrowRight className="w-4 h-4 text-white/50" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents helper layouts

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center space-y-3 p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-xl">
      <p className={`text-4xl sm:text-5xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-normal">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 bg-white/[0.01] rounded-[36px] border border-white/5 backdrop-blur-md">
      <p className="text-slate-400 text-xs font-bold">{message}</p>
    </div>
  );
}
