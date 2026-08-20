"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import {
  User, 
  Globe, 
  Edit3, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Target as TargetIcon, 
  Loader2,
  FolderGit2,
  GraduationCap,
  TrendingUp,
  FlaskConical,
  ExternalLink
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth() as any;

  const [activities, setActivities] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const res = await fetchApi("/api/private/learning/dashboard-summary/");
          if (res) {
            const mappedActivities = (res.deadlines || []).map((d: any) => ({
              title: d.title,
              type: d.type === 'quiz' ? 'Quiz Requis' : 'Tâche',
              time: new Date(d.date).toLocaleDateString(),
              icon: <TargetIcon className="w-4 h-4 text-orange-500" />
            }));
            setActivities(mappedActivities);
            setBadges(res.certificates || []);
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

  const stats = user?.stats || {
    coursesCompleted: 0,
    certificates: 0,
    learningHours: 0,
    points: 0
  };

  const sp = user?.student_profile;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 overflow-hidden relative">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 via-purple-50/20 to-transparent blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 space-y-8 relative z-10 animate-in fade-in duration-1000">

        {/* Profile Header Card */}
        <div className="rounded-[2.5rem] bg-white border border-slate-200 shadow-sm overflow-hidden relative group hover:shadow-lg transition-all duration-500">
          <div className="h-48 md:h-56 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />
          </div>

          <div className="px-8 md:px-12 pb-10 relative">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8 -mt-20 md:-mt-24">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 relative">
                <div className="relative inline-block shrink-0">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white border-4 md:border-[6px] border-white overflow-hidden shadow-lg relative transition-transform hover:scale-105 duration-500">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 md:bottom-2 md:right-2 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 mb-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {user.first_name} {user.last_name}
                    </h1>
                    {user.is_instructor && (
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 shadow-sm">
                        Expert Mentor
                      </span>
                    )}
                    {sp?.current_situation && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                        {sp.current_situation}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-bold flex flex-wrap items-center gap-2">
                    <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-sm border border-indigo-100/50">@{user.username}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                    <span className="uppercase tracking-widest text-[11px]">{user.level || "Digital Apprentice"}</span>
                  </p>
                </div>
              </div>

              <Link href="/profile/edit" className="lg:mb-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs font-black uppercase tracking-widest shadow-sm hover:shadow hover:-translate-y-0.5">
                <Edit3 className="w-4 h-4" /> Mettre à jour
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Side: Stats, Bio & Networks */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-2 group hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-3xl font-black text-slate-900">{stats.coursesCompleted}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Labs Finis</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center gap-2 group hover:shadow-md hover:border-orange-200 hover:-translate-y-1 transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-3xl font-black text-slate-900">{stats.points}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Expérience</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Biométrie Digitale
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                {user.bio || "Aucune donnée biographique n'a été synchronisée sur ce profil."}
              </p>
              
              {/* Langues intégrées depuis l'onboarding */}
              {sp && (sp.french_level || sp.english_level) && (
                <div className="pt-5 border-t border-slate-100 space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Langues</h4>
                   {sp.french_level && (
                     <div className="flex items-center justify-between group">
                        <span className="text-xs font-bold text-slate-700">Français</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200">{sp.french_level}</span>
                     </div>
                   )}
                   {sp.english_level && (
                     <div className="flex items-center justify-between group">
                        <span className="text-xs font-bold text-slate-700">Anglais</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200">{sp.english_level}</span>
                     </div>
                   )}
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Réseaux Publics</h3>
              <div className="space-y-3">
                {[
                  { icon: <FaLinkedin className="w-5 h-5" />, label: "LinkedIn", value: user.linkedin_url, color: "text-[#0A66C2]", bgHover: "hover:border-[#0A66C2] hover:bg-blue-50/50" },
                  { icon: <FaGithub className="w-5 h-5" />, label: "GitHub", value: user.github_url, color: "text-slate-800", bgHover: "hover:border-slate-800 hover:bg-slate-50" },
                  { icon: <Globe className="w-5 h-5" />, label: "Portfolio", value: user.portfolio_url, color: "text-indigo-600", bgHover: "hover:border-indigo-600 hover:bg-indigo-50/50" },
                ].map((link, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 transition-all ${link.value ? `${link.bgHover} cursor-pointer opacity-100 group` : 'opacity-50 grayscale'}`}>
                    <div className="flex items-center gap-4">
                      <span className={link.color}>{link.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{link.label}</span>
                    </div>
                    {link.value && <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Projets, Diplômes & IA Tracking */}
          <div className="lg:col-span-8 space-y-8">

            {/* Section Onboarding : Projets & Diplômes */}
            {(sp?.projects?.length > 0 || sp?.diplomas?.length > 0) && (
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  Portfolio & Parcours
                </h3>

                {/* Projets */}
                {sp?.projects?.length > 0 && (
                  <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Projets Récents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sp.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col gap-3 group">
                          <h5 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{proj.title}</h5>
                          <p className="text-sm text-slate-500 flex-1 leading-relaxed">{proj.description}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{proj.year}</span>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                Voir <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diplômes & Expériences */}
                {sp?.diplomas?.length > 0 && (
                  <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-8">Diplômes & Formations</h4>
                    <div className="space-y-4">
                      {sp.diplomas.map((dip: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-5 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow hover:border-emerald-200 transition-all group">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-extrabold text-slate-800 flex items-center gap-3">
                              {dip.title} 
                              {dip.mention && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">{dip.mention}</span>}
                            </p>
                            <p className="text-sm text-slate-500 font-medium mt-1">{dip.school} <span className="text-slate-300 mx-2">•</span> {dip.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                  Certifications & Badges
                </h3>
                {badges.length > 0 && (
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl shadow-sm">
                    {badges.length} Débloqués
                  </span>
                )}
              </div>

              {loadingExtra ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {badges.map((badge, i) => (
                    <div key={i} className="group flex flex-col items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-200 group-hover:shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Award className="w-8 h-8 text-indigo-500 relative z-10" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{badge.name || "Badge Honorifique"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
                  <Award className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500">L'IA n'a détecté aucun badge débloqué pour l'instant.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                Flux d'Activité
              </h3>
              
              {loadingExtra ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((act, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between group hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all">
                          {act.icon}
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm font-extrabold text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{act.title}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{act.type}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">{act.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center flex flex-col items-center gap-3">
                  <TargetIcon className="w-10 h-10 text-slate-300" />
                  <div>
                     <p className="text-sm font-bold text-slate-500">Aucune activité récente détectée par l'IA.</p>
                     <p className="text-[11px] font-bold text-slate-400 mt-1">Commencez un cours ou un lab pour alimenter ce flux.</p>
                  </div>
                </div>
              )}

              {activities.length > 0 && (
                <button className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors mt-4">
                  Voir tout l'historique
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}