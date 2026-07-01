"use client";

import React, { useEffect, useState } from "react";
import { Loader2, X, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { TalentProfile, JobOffer, SponsoredChallenge, CommunityGlobalStats } from "@/types/community";
import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityTabs, TabType } from "@/components/community/CommunityTabs";
import { TalentCard } from "@/components/community/TalentCard";
import { JobCard } from "@/components/community/JobCard";
import { ChallengeCard } from "@/components/community/ChallengeCard";
import { Leaderboard } from "@/components/community/Leaderboard";

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

  const countries = [
    "Sénégal", "Nigeria", "Kenya", "Afrique du Sud", "Égypte", "Ghana", "Éthiopie", "Côte d'Ivoire", "Maroc", "Tunisie", "Cameroun", "Rwanda"
  ];

  useEffect(() => { loadData(); }, [activeTab]);
  useEffect(() => { loadStats(); }, []);

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
      if (activeTab === 'talents' || activeTab === 'leaderboard') { loadData(); }

      setTimeout(() => {
        setIsRegisterOpen(false);
        setRegisterSuccess(false);
        setRegName(""); setRegRole(""); setRegBio(""); setRegSkills(""); setRegGithub(""); setRegLinkedin(""); setRegEmail("");
      }, 2000);
    } catch (err) {
      console.error("Registration error", err);
    } finally {
      setRegisterLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-80 min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Chargement en cours...</p>
        </div>
      );
    }

    const cardContainerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    switch (activeTab) {
      case 'talents':
        if (talents.length === 0) return <EmptyState message="Aucun chercheur trouvé." />;
        return (
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {talents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </motion.div>
        );

      case 'leaderboard':
        return (
          <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Leaderboard talents={leaderboard} />
          </motion.div>
        );

      case 'jobs':
        if (jobs.length === 0) return <EmptyState message="Aucune opportunité disponible pour le moment." />;
        return (
          <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApplySuccess={loadStats} />
            ))}
          </motion.div>
        );

      case 'challenges':
        if (challenges.length === 0) return <EmptyState message="Aucun challenge actif actuellement." />;
        return (
          <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onRegisterSuccess={loadStats} />
            ))}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col font-sans">
      <CommunityHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        activeTab={activeTab}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-24 pt-8 flex-grow w-full z-10">
        <CommunityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </section>

      {/* --- SECTION STATS --- */}
      {stats && (
        <section className="bg-white border-t border-[var(--border-subtle)] py-16 z-10">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatItem label="Membres Actifs" value={stats.totalTalents} sub="Inscrits sur le Hub" />
              <StatItem label="Challenges" value={stats.activeChallenges} sub="Compétitions en cours" />
              <StatItem label="Candidatures" value={stats.applicationsProcessed} sub="Soumises" />
            </div>
          </div>
        </section>
      )}

      {/* MODAL INSCRIPTION */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsRegisterOpen(false)} />

            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)] shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Rejoindre MLAcademy Hub
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Créez votre profil de talent.</p>
                </div>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {registerSuccess ? (
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-[var(--success-light)] rounded-full flex items-center justify-center text-[var(--success)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Demande envoyée !</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
                    Votre profil est en attente de validation par l'administrateur.
                  </p>
                </div>
              ) : (
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">Nom Complet <span className="text-[var(--error)]">*</span></label>
                        <input
                          type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Ex: Amina Diallo"
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">Spécialisation / Rôle <span className="text-[var(--error)]">*</span></label>
                        <input
                          type="text" required value={regRole} onChange={(e) => setRegRole(e.target.value)} placeholder="Ex: Data Scientist"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">Pays <span className="text-[var(--error)]">*</span></label>
                        <select
                          value={regCountry} onChange={(e) => setRegCountry(e.target.value)}
                          className="input-field cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] pr-10"
                        >
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">Adresse Email <span className="text-[var(--error)]">*</span></label>
                        <input
                          type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="amina@domain.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Stack & Outils (Séparés par des virgules) <span className="text-[var(--error)]">*</span></label>
                      <input
                        type="text" required value={regSkills} onChange={(e) => setRegSkills(e.target.value)} placeholder="Python, PyTorch, SQL"
                        className="input-field"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">GitHub URL</label>
                        <input
                          type="url" value={regGithub} onChange={(e) => setRegGithub(e.target.value)} placeholder="https://github.com/..."
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-primary)]">LinkedIn URL</label>
                        <input
                          type="url" value={regLinkedin} onChange={(e) => setRegLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..."
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Biographie</label>
                      <textarea
                        value={regBio} onChange={(e) => setRegBio(e.target.value)} rows={4} placeholder="Présentez-vous brièvement..."
                        className="w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)] resize-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                      <button
                        type="submit" disabled={registerLoading}
                        className="btn-primary w-full py-3"
                      >
                        {registerLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Soumettre ma candidature</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatItem({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="card p-8 flex flex-col items-center text-center">
      <p className="text-sm font-bold text-[var(--brand-500)] uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-extrabold text-[var(--text-primary)] my-2">{value}</p>
      <p className="text-sm text-[var(--text-secondary)]">{sub}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-flat py-20 text-center">
      <p className="text-[var(--text-secondary)] font-medium">{message}</p>
    </div>
  );
}