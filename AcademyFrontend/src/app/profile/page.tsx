"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
<<<<<<< HEAD
import { User, Zap, Globe, Edit3, Award, BookOpen, CheckCircle, ShieldCheck, ChevronRight, Sparkles, Star, Play, Target as TargetIcon, Loader2 } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth() as any; // Cast any si ton contexte n'est pas typé
=======
import { fetchApi } from "@/lib/api";
import {
  User, 
  Zap, 
  Globe, 
  Edit3, 
  Award, 
  BookOpen, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Star, 
  Play, 
  Target as TargetIcon, 
  Loader2,
  FolderGit2,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth() as any;

  const [activities, setActivities] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetching real data instead of mock data
      // Dans le futur, l'IA alimentera ce flux. Pour l'instant, on récupère via l'API.
      const fetchDashboardData = async () => {
        try {
          const res = await fetchApi("/api/private/learning/dashboard-summary/");
          if (res) {
            // Mapping de l'activité réelle depuis les deadlines ou autres événements
            const mappedActivities = (res.deadlines || []).map((d: any) => ({
              title: d.title,
              type: d.type === 'quiz' ? 'Quiz Requis' : 'Tâche',
              time: new Date(d.date).toLocaleDateString(),
              icon: <TargetIcon className="w-4 h-4 text-[var(--warning-500)]" />
            }));
            setActivities(mappedActivities);
            setBadges(res.certificates || []); // ou autre
          }
        } catch (error) {
          console.error("Impossible de récupérer les activités réelles :", error);
        } finally {
          setLoadingExtra(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);
>>>>>>> develop

  const stats = user?.stats || {
    coursesCompleted: 0,
    certificates: 0,
    learningHours: 0,
    points: 0
  };

<<<<<<< HEAD
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00D1FF] animate-spin" />
=======
  const sp = user?.student_profile; // StudentProfile contenant les données d'Onboarding

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-500)] animate-spin" />
>>>>>>> develop
      </div>
    );
  }

  if (!user) return null;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#0A192F] text-white font-inter selection:bg-[#00D1FF]/30 pb-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 pt-32 space-y-12 relative z-10 animate-in fade-in duration-1000">

        {/* Profile Header Card */}
        <div className="bg-[#112240] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-900/40 via-[#0A192F] to-[#00D1FF]/10 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
=======
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] font-inter selection:bg-[var(--brand-100)] pb-20 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 pt-32 space-y-8 relative z-10 animate-in fade-in duration-1000">

        {/* Profile Header Card */}
        <div className="card overflow-hidden shadow-sm relative">
          <div className="h-48 w-full bg-gradient-to-r from-[var(--brand-100)] via-[var(--bg-primary)] to-[var(--brand-50)] relative">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
>>>>>>> develop
          </div>

          <div className="px-10 pb-12 relative">
            <div className="flex flex-col md:flex-row items-end gap-8 -mt-16">
              <div className="relative group">
<<<<<<< HEAD
                <div className="w-40 h-40 rounded-[2.5rem] bg-[#0A192F] border-4 border-[#112240] overflow-hidden shadow-2xl relative transition-transform group-hover:scale-105 duration-500">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#112240]">
                      <User className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-[#00D1FF] border-4 border-[#112240] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-[#0A192F]" />
=======
                <div className="w-40 h-40 rounded-xl bg-[var(--bg-primary)] border-4 border-[var(--bg-primary)] overflow-hidden shadow-md relative transition-transform group-hover:scale-105 duration-500">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
                      <User className="w-16 h-16 text-[var(--text-tertiary)]" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-[var(--brand-500)] border-4 border-[var(--bg-primary)] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
>>>>>>> develop
                </div>
              </div>

              <div className="flex-1 mb-2 space-y-3">
                <div className="flex items-center gap-4">
<<<<<<< HEAD
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {user.first_name} {user.last_name}
                  </h1>
                  {user.is_instructor && (
                    <span className="px-3 py-1 bg-[#00D1FF]/10 text-[#00D1FF] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#00D1FF]/20">
                      Expert Mentor
                    </span>
                  )}
                </div>
                <p className="text-gray-400 font-bold flex items-center gap-3">
                  <span className="text-[#00D1FF]">@{user.username}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
=======
                  <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
                    {user.first_name} {user.last_name}
                  </h1>
                  {user.is_instructor && (
                    <span className="px-3 py-1 bg-[var(--brand-50)] text-[var(--brand-500)] text-[9px] font-black uppercase tracking-widest rounded-full border border-[var(--brand-200)]">
                      Expert Mentor
                    </span>
                  )}
                  {sp?.current_situation && (
                    <span className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[9px] font-black uppercase tracking-widest rounded-full border border-[var(--border-default)]">
                      {sp.current_situation}
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-secondary)] font-bold flex items-center gap-3">
                  <span className="text-[var(--brand-500)]">@{user.username}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-default)]"></span>
>>>>>>> develop
                  <span className="uppercase tracking-widest text-[10px]">{user.level || "Digital Apprentice"}</span>
                </p>
              </div>

<<<<<<< HEAD
              <Link href="/profile/edit" className="bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
=======
              <Link href="/profile/edit" className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-default)] px-8 py-4 rounded-xl flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
>>>>>>> develop
                <Edit3 className="w-4 h-4" /> Mettre à jour
              </Link>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Side: Stats & About */}
          <div className="lg:col-span-4 space-y-12">

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#112240] p-8 rounded-[2.5rem] border border-white/5 text-center transition-transform hover:scale-105">
                <p className="text-3xl font-black text-white mb-1">{stats.coursesCompleted}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Labs Finis</p>
              </div>
              <div className="bg-[#112240] p-8 rounded-[2.5rem] border border-white/5 text-center transition-transform hover:scale-105 shadow-xl shadow-[#00D1FF]/5">
                <p className="text-3xl font-black text-[#00D1FF] mb-1">{stats.points}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Expérience</p>
              </div>
            </div>

            <div className="bg-[#112240] rounded-[2.5rem] border border-white/5 p-10 space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" /> Biométrie Digitale
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium bg-[#0A192F] p-6 rounded-[2rem] border border-white/5">
                {user.bio || "Aucune donnée biographique n'a été synchronisée sur ce profil."}
              </p>
            </div>

            <div className="bg-[#112240] rounded-[2.5rem] border border-white/5 p-10 space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Réseaux</h3>
              <div className="space-y-3">
                {[
                  { icon: <FaLinkedin className="w-4 h-4" />, label: "LinkedIn", value: user.linkedin_url, color: "text-blue-400" },
                  { icon: <FaGithub className="w-4 h-4" />, label: "GitHub", value: user.github_url, color: "text-white" },
                  { icon: <Globe className="w-4 h-4" />, label: "Portfolio", value: user.portfolio_url, color: "text-[#00D1FF]" },
                ].map((link, i) => (
                  <div key={i} className={"flex items-center justify-between p-5 rounded-2xl bg-[#0A192F] border border-white/5 transition-all ${link.value ? 'hover:border-[#00D1FF]/20 cursor-pointer opacity-100' : 'opacity-20 grayscale'}"}>
                    <div className="flex items-center gap-4">
                      <span className={link.color}>{link.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{link.label}</span>
                    </div>
                    {link.value && <ChevronRight className="w-4 h-4 text-gray-700" />}
=======
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Side: Stats, Bio & Networks */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 text-center transition-transform hover:-translate-y-1">
                <p className="text-3xl font-black text-[var(--text-primary)] mb-1">{stats.coursesCompleted}</p>
                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Labs Finis</p>
              </div>
              <div className="card p-6 text-center transition-transform hover:-translate-y-1">
                <p className="text-3xl font-black text-[var(--brand-500)] mb-1">{stats.points}</p>
                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Expérience</p>
              </div>
            </div>

            <div className="card p-8 space-y-6">
              <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-500)]" /> Biométrie Digitale
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-default)]">
                {user.bio || "Aucune donnée biographique n'a été synchronisée sur ce profil."}
              </p>
              
              {/* Langues intégrées depuis l'onboarding */}
              {sp && (sp.french_level || sp.english_level) && (
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                   <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Langues</h4>
                   {sp.french_level && <p className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">Français <span className="text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md">{sp.french_level}</span></p>}
                   {sp.english_level && <p className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">Anglais <span className="text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md">{sp.english_level}</span></p>}
                </div>
              )}
            </div>

            <div className="card p-8 space-y-6">
              <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Réseaux</h3>
              <div className="space-y-3">
                {[
                  { icon: <FaLinkedin className="w-4 h-4" />, label: "LinkedIn", value: user.linkedin_url, color: "text-[#0A66C2]" },
                  { icon: <FaGithub className="w-4 h-4" />, label: "GitHub", value: user.github_url, color: "text-[var(--text-primary)]" },
                  { icon: <Globe className="w-4 h-4" />, label: "Portfolio", value: user.portfolio_url, color: "text-[var(--brand-500)]" },
                ].map((link, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] transition-all ${link.value ? 'hover:border-[var(--brand-300)] cursor-pointer opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className="flex items-center gap-4">
                      <span className={link.color}>{link.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{link.label}</span>
                    </div>
                    {link.value && <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />}
>>>>>>> develop
                  </div>
                ))}
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Right Side: Achievements & Activity */}
          <div className="lg:col-span-8 space-y-12">

            <div className="bg-[#112240] rounded-[3rem] border border-white/5 p-12 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <Award className="w-6 h-6 text-amber-500" /> Certifications & Badges
                </h3>
                <span className="text-[9px] font-black text-[#00D1FF] uppercase tracking-widest bg-[#00D1FF]/5 px-3 py-1 rounded-lg">4/12 Débloqués</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { icon: <Zap className="w-6 h-6" />, label: "Rapide", color: "text-amber-400", bg: "bg-amber-400/10" },
                  { icon: <TargetIcon className="w-6 h-6" />, label: "Précis", color: "text-indigo-400", bg: "bg-indigo-400/10" },
                  { icon: <Star className="w-6 h-6" />, label: "Elite", color: "text-[#00D1FF]", bg: "bg-[#00D1FF]/10" },
                  { icon: <Award className="w-6 h-6" />, label: "Expert", color: "text-rose-400", bg: "bg-rose-400/10" },
                ].map((badge, i) => (
                  <div key={i} className="group flex flex-col items-center gap-4">
                    <div className={"w-20 h-20 rounded-[2rem] bg-[#0A192F] border border-white/5 flex items-center justify-center shadow-xl transition-all group-hover:scale-110 group-hover:border-white/10 relative overflow-hidden"}>
                      <div className={"absolute inset-0 ${badge.bg} opacity-20 blur-xl"}></div>
                      <span className={badge.color}>{badge.icon}</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#112240] rounded-[3rem] border border-white/5 p-12 space-y-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                <BookOpen className="w-6 h-6 text-[#00D1FF]" /> Flux d'Activité
              </h3>

              <div className="space-y-4">
                {[
                  { title: "Introduction à la Computer Vision", type: "Cours Terminé", time: "2h ago", icon: <CheckCircle className="w-4 h-4 text-[#00D1FF]" /> },
                  { title: "Architecture des Transformers", type: "Lab En Cours", time: "Hier", icon: <Play className="w-4 h-4 text-amber-500" /> },
                  { title: "Deep Learning Fondamentaux", type: "Certification Obtenue", time: "3 jours ago", icon: <Award className="w-4 h-4 text-emerald-500" /> }
                ].map((act, i) => (
                  <div key={i} className="bg-[#0A192F] rounded-[2rem] border border-white/5 p-6 flex items-center justify-between group hover:border-[#00D1FF]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#112240] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white uppercase tracking-tight">{act.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-[#00D1FF] uppercase tracking-widest">{act.type}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10"></span>
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{act.time}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-[#00D1FF] transition-all" />
                  </div>
                ))}
              </div>

              <button className="w-full py-5 rounded-2xl bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:bg-white/10 hover:text-white transition-all">
                Voir tout l'historique
              </button>
=======
          {/* Right Side: Projets, Diplômes & IA Tracking */}
          <div className="lg:col-span-8 space-y-8">

            {/* Section Onboarding : Projets & Diplômes */}
            {(sp?.projects?.length > 0 || sp?.diplomas?.length > 0) && (
              <div className="card p-10 space-y-8">
                <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-4">
                  <FolderGit2 className="w-6 h-6 text-[var(--brand-500)]" /> Portfolio & Parcours
                </h3>

                {/* Projets */}
                {sp?.projects?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Projets</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sp.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-5 rounded-xl flex flex-col gap-2">
                          <h5 className="font-bold text-sm text-[var(--text-primary)]">{proj.title}</h5>
                          <p className="text-xs text-[var(--text-secondary)] flex-1">{proj.description}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)]">
                            <span className="text-[10px] font-black text-[var(--text-tertiary)]">{proj.year}</span>
                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[var(--brand-500)] hover:underline">Voir le lien</a>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diplômes & Expériences */}
                {sp?.diplomas?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mt-6">Diplômes & Formations</h4>
                    <div className="space-y-3">
                      {sp.diplomas.map((dip: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-[var(--brand-50)] text-[var(--brand-500)] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text-primary)]">{dip.title} {dip.mention && <span className="text-[9px] bg-[var(--brand-50)] text-[var(--brand-500)] px-2 py-0.5 rounded-full ml-2 uppercase tracking-widest">{dip.mention}</span>}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{dip.school} • {dip.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="card p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-4">
                  <Award className="w-6 h-6 text-[var(--warning-500)]" /> Certifications & Badges
                </h3>
                {badges.length > 0 && (
                  <span className="text-[9px] font-black text-[var(--brand-500)] uppercase tracking-widest bg-[var(--brand-50)] border border-[var(--brand-100)] px-3 py-1 rounded-md">
                    {badges.length} Débloqués
                  </span>
                )}
              </div>

              {loadingExtra ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[var(--brand-500)] animate-spin" />
                </div>
              ) : badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {badges.map((badge, i) => (
                    <div key={i} className="group flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:border-[var(--border-hover)] relative overflow-hidden`}>
                        <div className={`absolute inset-0 bg-[var(--brand-50)] opacity-50`}></div>
                        <Award className="w-6 h-6 text-[var(--brand-500)] relative z-10" />
                      </div>
                      <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{badge.name || "Badge"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-default)] p-8 rounded-xl text-center">
                  <p className="text-xs font-bold text-[var(--text-secondary)]">L'IA n'a détecté aucun badge débloqué pour l'instant.</p>
                </div>
              )}
            </div>

            <div className="card p-10 space-y-8">
              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-4">
                <BookOpen className="w-6 h-6 text-[var(--brand-500)]" /> Flux d'Activité
              </h3>
              
              {loadingExtra ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[var(--brand-500)] animate-spin" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((act, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)] p-5 flex items-center justify-between group hover:border-[var(--brand-200)] transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-default)] group-hover:scale-110 transition-transform">
                          {act.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{act.title}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-[var(--brand-500)] uppercase tracking-widest">{act.type}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border-default)]"></span>
                            <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{act.time}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--brand-500)] transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-default)] p-8 rounded-xl text-center">
                  <p className="text-xs font-bold text-[var(--text-secondary)]">Aucune activité récente détectée par l'IA.</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-2">Commencez un cours ou un lab pour alimenter ce flux.</p>
                </div>
              )}

              {activities.length > 0 && (
                <button className="w-full py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all">
                  Voir tout l'historique
                </button>
              )}
>>>>>>> develop
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}