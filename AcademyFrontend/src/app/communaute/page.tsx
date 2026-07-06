"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Users, Briefcase, Search, ArrowRight, Globe, MapPin, Award, Zap, ChevronRight, Building2, Clock,Loader2, ExternalLink, Mail, MessageSquare} from "lucide-react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function CommunityHubPage() {
   const { user, loading: authLoading } = useAuth();
   const [jobs, setJobs] = useState<any[]>([]);
   const [talents, setTalents] = useState<any[]>([]);
   const [leaderboard, setLeaderboard] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'talents' | 'jobs' | 'leaderboard'>('talents');
   const [searchQuery, setSearchQuery] = useState("");

   useEffect(() => {
      loadData();
   }, [activeTab]);

   async function loadData() {
      setLoading(true);
      try {
         if (activeTab === 'talents') {
            const data = await fetchApi("/api/community/talents/?search=${searchQuery}");
            setTalents(Array.isArray(data) ? data : data.results || []);
         } else if (activeTab === 'leaderboard') {
            const data = await fetchApi("/api/community/leaderboard/");
            setLeaderboard(Array.isArray(data) ? data : data.results || []);
         } else {
            const data = await fetchApi("/api/community/jobs/?search=${searchQuery}");
            setJobs(Array.isArray(data) ? data : data.results || []);
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      loadData();
   };

   return (
      <div className="min-h-screen bg-[#090C14] text-white">
         {/* --- HERO / SEARCH --- */}
         <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

            <div className="text-center space-y-8 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Zap className="w-3 h-3" /> Talent Hub & Career Engine
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                  Pulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Community</span>
               </h1>
               <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">
                  La plus grande communauté de talents ML en Afrique. <br /> Connectez-vous, collaborez et trouvez votre prochain défi.
               </p>

               <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mt-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-all"></div>
                  <div className="relative flex bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
                     <div className="flex-1 flex items-center px-4">
                        <Search className="w-5 h-5 text-slate-500" />
                        <input
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder={activeTab === 'talents' ? "Rechercher par expertise, nom, niveau..." : "Titre du poste, entreprise, lieu..."}
                           className="w-full bg-transparent border-none outline-none px-4 py-3 font-medium placeholder:text-slate-500"
                        />
                     </div>
                     <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3 rounded-xl transition-all">
                        EXPLORER
                     </button>
                  </div>
               </form>
            </div>
         </section>

         {/* --- MAIN INTERFACE --- */}
         <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
               <button
                  onClick={() => setActiveTab('talents')}
                  className={"flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border ${activeTab === 'talents' ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}"}
               >
                  <Users className="w-5 h-5" /> Talents ML
               </button>
               <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={"flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}"}
               >
                  <Award className="w-5 h-5" /> Classement
               </button>
               <button
                  onClick={() => setActiveTab('jobs')}
                  className={"flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border ${activeTab === 'jobs' ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}"}
               >
                  <Briefcase className="w-5 h-5" /> Offres d'Emploi
               </button>
               <Link
                  href="/communaute/discussions"
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95"
               >
                  <MessageSquare className="w-5 h-5" /> Discussions
               </Link>
            </div>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Filtrage en cours...</p>
               </div>
            ) : (
               <AnimatePresence mode="wait">
                  {activeTab === 'talents' ? (
                     <motion.div
                        key="talents"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                     >
                        {talents.map((talent) => (
                           <div key={talent.id} className="glass-card rounded-[32px] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
                              <div className="space-y-6">
                                 <div className="flex items-start justify-between">
                                    <div className="h-20 w-20 rounded-3xl overflow-hidden border-2 border-white/10 shadow-xl">
                                       <img src={talent.avatar || "https://ui-avatars.com/api/?name=${talent.first_name}+${talent.last_name}&background=6366f1&color=fff"} alt={talent.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-right">
                                       <span className={"text-[9px] font-black uppercase px-3 py-1 rounded-full border ${talent.level === 'advanced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}"}>
                                          {talent.level}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight">{talent.first_name} {talent.last_name}</h3>
                                    <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{talent.bio || "Ce talent n'a pas encore rédigé de biographie."}</p>
                                 </div>
                                 <div className="flex gap-4">
                                    <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                                       <p className="text-[10px] font-black text-slate-500 uppercase">Points</p>
                                       <p className="text-sm font-black text-white">{talent.stats.points}</p>
                                    </div>
                                    <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                                       <p className="text-[10px] font-black text-slate-500 uppercase">Certifs</p>
                                       <p className="text-sm font-black text-indigo-400">{talent.stats.certificates}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    {talent.linkedin_url && <a href={talent.linkedin_url} target="_blank" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>}
                                    {talent.github_url && <a href={talent.github_url} target="_blank" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                                 </div>
                                 <Link href={"/communaute/talents/${talent.id}"} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 tracking-widest transition-all group-hover:translate-x-1">
                                    Voir Profil <ChevronRight className="w-4 h-4" />
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </motion.div>
                  ) : activeTab === 'leaderboard' ? (
                     <motion.div
                        key="leaderboard"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-12"
                     >
                        {/* Podium */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
                           {leaderboard.slice(0, 3).map((talent, index) => (
                              <div key={talent.id} className={"relative flex flex-col items-center ${index === 0 ? 'order-2 md:-translate-y-10' : index === 1 ? 'order-1' : 'order-3'}"}>
                                 <div className={"relative h-32 w-32 rounded-[40px] p-1 mb-6 ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 'bg-gradient-to-br from-orange-500 to-orange-700'}"}>
                                    <div className="h-full w-full rounded-[38px] overflow-hidden border-4 border-[#090C14]">
                                       <img src={talent.avatar || "https://ui-avatars.com/api/?name=${talent.first_name}&background=333&color=fff"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-inherit flex items-center justify-center font-black text-lg border-4 border-[#090C14]">
                                       {index + 1}
                                    </div>
                                 </div>
                                 <h4 className="font-black text-xl">{talent.first_name}</h4>
                                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{talent.stats.points} XP</p>
                              </div>
                           ))}
                        </div>

                        {/* List */}
                        <div className="bg-white/5 rounded-[40px] border border-white/5 overflow-hidden">
                           <div className="p-8 border-b border-white/5 flex items-center justify-between opacity-50">
                              <span className="text-[10px] font-black uppercase tracking-widest px-10">Rang & Talent</span>
                              <span className="text-[10px] font-black uppercase tracking-widest px-10">Performance</span>
                           </div>
                           <div className="divide-y divide-white/5">
                              {leaderboard.map((talent, index) => (
                                 <Link href={"/communaute/talents/${talent.id}"} key={talent.id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group block cursor-pointer">
                                    <div className="flex items-center gap-8">
                                       <span className="text-xl font-black text-slate-700 w-8">{index + 1}</span>
                                       <div className="flex items-center gap-4">
                                          <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                             <img src={talent.avatar || "https://ui-avatars.com/api/?name=${talent.first_name}"} className="w-full h-full object-cover" />
                                          </div>
                                          <div>
                                             <p className="font-black group-hover:text-indigo-400 transition-colors">{talent.first_name} {talent.last_name}</p>
                                             <p className="text-[10px] font-bold text-slate-500 uppercase">{talent.level}</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-slate-500 uppercase">Certificats</p>
                                          <p className="font-black text-indigo-400">{talent.stats.certificates}</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-slate-500 uppercase">Points XP</p>
                                          <p className="text-xl font-black">{talent.stats.points}</p>
                                       </div>
                                    </div>
                                 </Link>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div
                        key="jobs"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                     >
                        {jobs.length === 0 ? (
                           <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5">
                              <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                              <p className="text-slate-500 font-bold">Aucune offre ne correspond à votre recherche.</p>
                           </div>
                        ) : (
                           jobs.map((job) => (
                              <div key={job.id} className="glass-card rounded-[32px] p-8 border border-white/5 hover:bg-white/[0.07] transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                                 <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                                       {job.company_logo ? <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 text-slate-500" />}
                                    </div>
                                    <div className="space-y-1">
                                       <h3 className="text-xl font-black tracking-tight">{job.title}</h3>
                                       <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                          <span className="text-indigo-400">{job.company_name}</span>
                                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</div>
                                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.contract_type}</div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Salaire</p>
                                       <p className="text-sm font-black text-emerald-400">{job.salary_range || "Non spécifié"}</p>
                                    </div>
                                    <Link href={"/community/jobs/${job.id}"} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/10 transition-all flex items-center gap-2">
                                       Postuler <ArrowRight className="w-4 h-4" />
                                    </Link>
                                 </div>
                              </div>
                           ))
                        )}
                     </motion.div>
                  )}
               </AnimatePresence>
            )}
         </section>

         {/* --- COMMUNITY STATS --- */}
         <section className="bg-white/5 border-y border-white/5 py-20 mb-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
               <StatItem label="Talents Actifs" value="1,240+" color="text-indigo-400" />
               <StatItem label="Partenaires Recruteurs" value="85+" color="text-emerald-400" />
               <StatItem label="Offres d'Emploi" value="240+" color="text-amber-400" />
               <StatItem label="Candidatures / mois" value="15k+" color="text-cyan-400" />
            </div>
         </section>
      </div>
   );
}

function StatItem({ label, value, color }: any) {
   return (
      <div className="text-center space-y-2">
         <p className={"text-4xl font-black ${color}"}>{value}</p>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
      </div>
   );
}
=======
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
              <StatItem label="Recrutements" value={stats.activeJobs} sub="Jobs" />
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
>>>>>>> develop
