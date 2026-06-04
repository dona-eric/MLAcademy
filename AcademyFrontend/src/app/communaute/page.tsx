"use client";

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
