"use client";

import React, { useEffect, useState } from "react";
import { Loader2, X, ArrowRight, CheckCircle, Users, Trophy, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { TalentProfile, JobOffer, SponsoredChallenge, CommunityGlobalStats, Badge, UserStreak } from "@/types/community";
import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityTabs, TabType } from "@/components/community/CommunityTabs";
import { TalentCard } from "@/components/community/TalentCard";
import { JobCard } from "@/components/community/JobCard";
import { ChallengeCard } from "@/components/community/ChallengeCard";
import { Leaderboard } from "@/components/community/Leaderboard";
import { BadgeCard } from "@/components/community/BadgeCard";
import { BadgeUnlockModal } from "@/components/community/BadgeUnlockModal";
import { StreakWidget } from "@/components/community/StreakWidget";

export default function CommunautePage() {
  const [activeTab, setActiveTab] = useState<TabType>('talents');
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Core Data States from Django REST Backend
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [challenges, setChallenges] = useState<SponsoredChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<TalentProfile[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [unlockedModalBadge, setUnlockedModalBadge] = useState<Badge | null>(null);
  const [stats, setStats] = useState<CommunityGlobalStats | null>(null);

  // Registration Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regRole, setRegRole] = useState("Machine Learning Engineer");
  const [regCountry, setRegCountry] = useState("Sénégal");
  const [regEmail, setRegEmail] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regSkills, setRegSkills] = useState("");
  const [regGithub, setRegGithub] = useState("");
  const [regLinkedin, setRegLinkedin] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const countries = [
    "Sénégal", "Nigeria", "Kenya", "Afrique du Sud", "Égypte", "Ghana", "Éthiopie", "Côte d'Ivoire", "Maroc", "Tunisie", "Cameroun", "Rwanda", "France", "Canada"
  ];

  const rolesList = [
    "Machine Learning Engineer",
    "Data Scientist",
    "AI Research Scientist",
    "NLP Expert",
    "Computer Vision Specialist",
    "Data Engineer",
    "MLOps Engineer",
    "Étudiant en IA"
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
      } else if (activeTab === 'badges') {
        const [badgesData, streakData] = await Promise.all([
          fetchApi(`/api/community/badges/?search=${encodeURIComponent(searchQuery)}`),
          fetchApi(`/api/community/my-streak/`).catch(() => null),
        ]);
        const badgeList = Array.isArray(badgesData) ? badgesData : badgesData.results || [];
        setBadges(badgeList);
        setStreak(streakData);

        // Détecter un badge récemment débloqué (non vu)
        const unseenBadge = badgeList.find((b: Badge) => b.is_unlocked);
        if (unseenBadge && !unlockedModalBadge) {
          // Possibilité d'afficher le modal si premier chargement
        }
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
    const fullName = `${regFirstName} ${regLastName}`.trim();
    if (!fullName || !regRole || !regCountry || !regEmail) return;

    setRegisterLoading(true);
    try {
      const skillsArr = regSkills.split(',').map(s => s.trim()).filter(Boolean);
      await fetchApi('/api/community/talents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: regEmail,
          headline: regRole,
          country: regCountry,
          bio: regBio,
          github_url: regGithub,
          linkedin_url: regLinkedin,
          skills: skillsArr
        })
      });
      setRegisterSuccess(true);
      setTimeout(() => {
        setIsRegisterOpen(false);
        setRegisterSuccess(false);
        loadData();
        loadStats();
      }, 1500);
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
          <Loader2 className="w-10 h-10 animate-spin text-[#5de6ff]" />
          <p className="text-sm font-medium text-[#c7c4d7]">Chargement des données en direct...</p>
        </div>
      );
    }

    const cardContainerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    switch (activeTab) {
      case 'talents':
        if (talents.length === 0) return <EmptyState message="Aucun chercheur ou talent trouvé pour le moment." />;
        return (
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        if (jobs.length === 0) return <EmptyState message="Aucune opportunité d'emploi disponible pour le moment." />;
        return (
          <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
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

      case 'badges':
        return (
          <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            {/* Widget de Streak (Série consécutive) */}
            <StreakWidget streak={streak} />

            {/* Grille de Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div key={badge.id} onClick={() => badge.is_unlocked && setUnlockedModalBadge(badge)}>
                  <BadgeCard badge={badge} />
                </div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col font-sans">
      {/* Community Hero with Live Search */}
      <CommunityHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        activeTab={activeTab}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 -mt-6 mb-16 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/5 hover:border-[#c0c1ff]/50 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] group-hover:bg-[#c0c1ff] group-hover:text-[#07006c] transition-all shrink-0">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#908fa0] mb-1 uppercase tracking-widest">Membres Actifs</p>
              <p className="text-3xl font-black text-white">{stats ? `${stats.totalTalents}+` : "12,480+"}</p>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/5 hover:border-[#5de6ff]/50 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#5de6ff]/10 flex items-center justify-center text-[#5de6ff] group-hover:bg-[#5de6ff] group-hover:text-[#001f25] transition-all shrink-0">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#908fa0] mb-1 uppercase tracking-widest">Challenges</p>
              <p className="text-3xl font-black text-white">{stats ? `${stats.activeChallenges} En cours` : "42 En cours"}</p>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/5 hover:border-[#c0c1ff]/50 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-[#c0c1ff] group-hover:bg-[#c0c1ff] group-hover:text-[#07006c] transition-all shrink-0">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#908fa0] mb-1 uppercase tracking-widest">Recrutements</p>
              <p className="text-3xl font-black text-white">{stats ? `${stats.activeJobs} Postes` : "156 Postes"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Tabs */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-24 flex-grow w-full z-10">
        <CommunityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </section>

      {/* REGISTRATION MODAL ("Rejoindre l'élite IA") */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsRegisterOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-[#122131] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] via-[#5de6ff] to-[#c0c1ff]" />

              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white tracking-tight">Rejoindre l'élite IA</h2>
                  <button
                    onClick={() => setIsRegisterOpen(false)}
                    className="text-[#908fa0] hover:text-white transition-colors p-2 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {registerSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#5de6ff]/20 rounded-full flex items-center justify-center text-[#5de6ff]">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Inscription enregistrée !</h3>
                    <p className="text-sm text-[#c7c4d7] max-w-xs leading-relaxed">
                      Votre profil de talent a été créé et est maintenant visible sur le Hub.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-5 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">PRÉNOM</label>
                        <input
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Amina"
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">NOM</label>
                        <input
                          type="text"
                          required
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Diallo"
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">EMAIL PROFESSIONNEL</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nom@entreprise.ai"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">VOTRE RÔLE PRINCIPAL</label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm cursor-pointer"
                        >
                          {rolesList.map((r) => (
                            <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">PAYS</label>
                        <select
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm cursor-pointer"
                        >
                          {countries.map((c) => (
                            <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">STACK & OUTILS (Séparés par virgule)</label>
                      <input
                        type="text"
                        required
                        value={regSkills}
                        onChange={(e) => setRegSkills(e.target.value)}
                        placeholder="Python, PyTorch, Kubernetes"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">GITHUB URL</label>
                        <input
                          type="url"
                          value={regGithub}
                          onChange={(e) => setRegGithub(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">LINKEDIN URL</label>
                        <input
                          type="url"
                          value={regLinkedin}
                          onChange={(e) => setRegLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">BIOGRAPHIE</label>
                      <textarea
                        value={regBio}
                        onChange={(e) => setRegBio(e.target.value)}
                        rows={3}
                        placeholder="Présentez brièvement vos travaux..."
                        className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#5de6ff] focus:ring-1 focus:ring-[#5de6ff] outline-none transition-all text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="w-full py-4 rounded-xl bg-[#c0c1ff] text-[#07006c] font-black text-sm uppercase tracking-wider hover:bg-[#a2eeff] transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] mt-4 flex items-center justify-center gap-2"
                    >
                      {registerLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>FINALISER L'INSCRIPTION</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CÉLÉBRATION BADGE UNLOCKED */}
      <BadgeUnlockModal badge={unlockedModalBadge} onClose={() => setUnlockedModalBadge(null)} />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-2xl py-20 text-center">
      <p className="text-[#c7c4d7] font-medium text-sm">{message}</p>
    </div>
  );
}