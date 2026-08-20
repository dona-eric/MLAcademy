"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { ArrowRight, Award, BarChart3, BookOpen, Clock, Flame, Play, ShieldEllipsis, Target, TrendingUp, Zap, ChevronRight, Loader2, Calendar } from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const data = await fetchApi("/api/private/learning/dashboard-summary/");
        setSummary(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, authLoading, router]);

  // Message de bienvenue personnalisé
  useEffect(() => {
    if (!user) return;
    const hour = new Date().getHours();
    let timeOfDay = '';
    
    if (hour < 12) timeOfDay = 'Bonjour';
    else if (hour < 18) timeOfDay = 'Bon après-midi';
    else timeOfDay = 'Bonsoir';

    let userName = 'cher utilisateur';
    
    if (user.first_name) {
      userName = user.first_name;
    } else if (user.email) {
      userName = user.email.split('@')[0].split('.')[0];
      // Capitaliser la première lettre
      userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    }
    
    setWelcomeMessage(userName ? `${timeOfDay}, ${userName} !` : `${timeOfDay} !`);
  }, [user]);

  if (authLoading || loading || !summary) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-500)]" />
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-wider text-xs">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const activeCourses = summary.active_courses || [];
  const activePaths = summary.active_paths || [];
  const upcomingDeadlines = summary.deadlines || [];
  const stats = summary.stats || {};
  const certificatesCount = summary.certificates_count || 0;
  
  const totalFormations = activeCourses.length + activePaths.length;
  const formationText = totalFormations > 1 ? "formations" : "formation";

  return (
    <div className="p-6 lg:p-10 space-y-12 relative overflow-hidden min-h-screen bg-[#fafafa]">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 via-purple-50/20 to-transparent blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Welcome Section - Premium Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-white/40 shadow-[0_8px_40px_rgb(0,0,0,0.04)] backdrop-blur-xl p-8 lg:p-12 transition-transform duration-500 hover:shadow-[0_12px_60px_rgb(0,0,0,0.06)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50/80 text-indigo-700 rounded-full border border-indigo-100/50 text-[11px] font-bold uppercase tracking-widest">
                <ShieldEllipsis className="w-4 h-4" /> Espace Apprenant
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 drop-shadow-sm flex items-center gap-3">
                {welcomeMessage} <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
              </h1>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl leading-relaxed font-medium">
                Vous avez <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{totalFormations} {formationText}</span> en cours. Continuez sur votre lancée pour atteindre vos objectifs d'apprentissage.
              </p>
            </div>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Objectif hebdomadaire</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">60%</span>
                  </div>
               </div>
               <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
               <Link href="/parcours" className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl overflow-hidden hover:bg-indigo-700 hover:scale-[1.02] shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)]">
                 <span className="relative z-10 flex items-center gap-2">
                    Explorer le catalogue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                 </span>
               </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          
          <div className="space-y-12">
            {/* Échéances Critiques */}
            {upcomingDeadlines.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-400" /> Échéances prioritaires
                  </h3>
                  <Link href="/dashboard/calendar" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Voir le calendrier</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {upcomingDeadlines.map((deadline: any) => {
                    const isUrgent = deadline.priority === "high";
                    return (
                      <div key={deadline.id} className={`p-6 rounded-3xl border flex items-start gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        isUrgent ? 'bg-gradient-to-br from-orange-50/80 to-amber-50/40 border-orange-200 shadow-[0_8px_30px_rgba(245,158,11,0.08)]' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          isUrgent ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {deadline.type === "quiz" ? <Zap className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-black uppercase tracking-widest ${isUrgent ? 'text-orange-600' : 'text-slate-400'}`}>
                            {deadline.type === 'quiz' ? 'Quiz à venir' : 'Projet final'}
                          </p>
                          <h4 className="font-extrabold text-base text-slate-800 mt-1.5 truncate">{deadline.title}</h4>
                          <div className="flex items-center gap-2 mt-3">
                             <Clock className={`h-4 w-4 ${isUrgent ? 'text-orange-500' : 'text-slate-400'}`} />
                             <span className={`text-[11px] font-bold ${isUrgent ? 'text-orange-700' : 'text-slate-500'}`}>
                                Avant le {new Date(deadline.date).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        {isUrgent && (
                          <div className="relative flex h-3 w-3 mt-1 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Formations en cours */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                     <Play className="h-5 w-5 fill-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reprendre l'apprentissage</h2>
                </div>
                <Link href="/dashboard/courses" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Voir tout</Link>
              </div>

              {(activeCourses.length === 0 && activePaths.length === 0) ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-16 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto">
                    <Target className="h-10 w-10 text-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-slate-800">Prêt à commencer ?</h3>
                    <p className="text-slate-500 text-base max-w-sm mx-auto">Découvrez nos parcours certifiants et développez de nouvelles compétences très recherchées.</p>
                  </div>
                  <Link href="/parcours" className="inline-block mt-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow">
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {activePaths.map((pe: any) => (
                    <CourseraItemCard key={`path-${pe.id}`} item={pe} progress={pe.progress_percentage} enrolledAt={pe.enrolled_at} type="path" />
                  ))}
                  {activeCourses.map((e: any) => (
                    <CourseraItemCard key={`course-${e.id}`} item={e} progress={e.progress_percentage} enrolledAt={e.enrolled_at} type="course" />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Panneau Latéral (Bento Box Design) */}
          <aside className="space-y-6">
             
             {/* Performance Bento */}
             <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Performances</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-px bg-slate-100">
                   {/* Streak */}
                   <div className="bg-white p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-orange-50/30 transition-colors">
                      <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
                         <Flame className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-slate-800">{stats.streak_days} <span className="text-base text-slate-500 font-bold">j</span></p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Série actuelle</p>
                      </div>
                   </div>

                   {/* Certificats */}
                   <div className="bg-white p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-emerald-50/30 transition-colors">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-inner">
                         <Award className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-slate-800">{certificatesCount}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Certificats</p>
                      </div>
                   </div>
                   
                   {/* Moyenne Quiz (Spans full width) */}
                   <div className="col-span-2 bg-white p-6 flex items-center justify-between group hover:bg-indigo-50/30 transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyenne Quiz</p>
                        <div className="flex items-end gap-2">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.avg_quiz_score}<span className="text-2xl text-slate-400">%</span></p>
                        </div>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 group-hover:rotate-12 transition-transform shadow-sm">
                         <TrendingUp className="h-8 w-8" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Ressources Rapides */}
             <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ressources & Notes</h3>
                <div className="space-y-3">
                   <Link href="/dashboard/notes" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group hover:shadow-sm">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                         <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Mes notes de cours</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                   </Link>
                   <Link href="/dashboard/grades" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group hover:shadow-sm">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                         <BarChart3 className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Notes & Résultats</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                   </Link>
                </div>
             </div>

             {/* Community Promo */}
             <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden group shadow-[0_10px_40px_rgba(79,70,229,0.25)]">
                <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="relative z-10 space-y-4">
                   <h4 className="font-black text-2xl leading-tight text-white drop-shadow-sm">Besoin d'aide ?</h4>
                   <p className="text-indigo-100 text-sm leading-relaxed font-medium">Rejoignez la communauté et échangez en temps réel avec d'autres apprenants en IA.</p>
                   <Link href="/communaute" className="inline-flex items-center mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all border border-white/20 group/btn">
                      Accéder au forum <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function CourseraItemCard({ item, progress, enrolledAt, type }: { item: any, progress: number, enrolledAt: string, type: 'course' | 'path' }) {
  const daysSinceEnrollment = Math.floor((new Date().getTime() - new Date(enrolledAt).getTime()) / (1000 * 60 * 60 * 24));
  const isLate = daysSinceEnrollment > 10 && progress < 15;
  const isOnTrack = progress > (daysSinceEnrollment * 2);

  // Resolution des liens et des données
  const slug = type === 'path' ? item.path_slug : item.course_slug;
  const title = type === 'path' ? item.path_title : item.course_title;
  const thumbnail = type === 'path' ? item.path_thumbnail : item.course_thumbnail;
  const linkUrl = type === 'path' ? `/parcours/${slug}` : `/learning/${slug}/lesson/`;
  const level = type === 'path' ? item.path_level : item.course_level;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden group hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
      <div className="relative w-full md:w-[320px] aspect-video md:aspect-auto shrink-0 bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden">
        <CourseImage
          src={thumbnail}
          title={title || ""}
          isPath={type === 'path'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-md backdrop-blur-md border ${
             isLate ? 'bg-orange-500/90 text-white border-orange-400' : 'bg-indigo-600/90 text-white border-indigo-500'
           }`}>
              {type === 'path' ? 'Spécialisation' : 'Cours MOOC'}
           </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6 relative">
        <div className="space-y-3">
           <div className="flex justify-between items-start gap-4">
              <h3 className="text-2xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                {title}
              </h3>
           </div>
           
           <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                 <Clock className="h-4 w-4 text-slate-400" /> {item.duration_hours || 12}h estimées
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${isLate ? 'text-orange-600' : isOnTrack ? 'text-emerald-600' : 'text-slate-500'}`}>
                 <div className={`h-2 w-2 rounded-full shadow-sm ${isLate ? 'bg-orange-500' : isOnTrack ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                 {isLate ? 'En retard' : isOnTrack ? 'En avance' : 'Sur la bonne voie'}
              </div>
           </div>
        </div>

        <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Prochaine étape
               </span>
               <p className="text-slate-700 font-bold text-sm">{progress < 10 ? "Introduction & Setup" : "Module 2 : Data Processing"}</p>
            </div>
            <span className="text-indigo-600 font-black text-xl tracking-tighter">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
          </div>
          <div className="pt-2 flex justify-end">
            <Link href={linkUrl} className={`inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              isLate ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 hover:border-orange-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
            }`}>
              {progress > 0 ? 'Reprendre le module' : 'Commencer le cours'} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
