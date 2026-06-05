"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {ArrowRight, Award, BarChart3, BookOpen, Clock, Flame, Play, ShieldEllipsis, Target, TrendingUp, Zap, ChevronRight, Loader2} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // const {data: session, isPending} = useSession()
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('')

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
  // useEffect(() => {
  //   const hour = new Date().getHours();
  //   let timeOfDay = '';
    
  //   if (hour < 12) timeOfDay = 'Bonjour';
  //   else if (hour < 18) timeOfDay = 'Bon Après-midi';
  //   else timeOfDay = 'Bonsoir';

  //   let userName = 'cher utilisateur';
    
  //   if (session?.user?.first_name) {
  //     userName = session.user.first_name;
  //   } else if (session?.user?.email) {
  //     userName = session.user.email.split('@')[0].split('.')[0];
  //     // Capitaliser la première lettre
  //     userName = userName.charAt(0).toUpperCase() + userName.slice(1);
  //   }
    
  //   setWelcomeMessage(userName ? `${timeOfDay}, ${userName} ! 👋` : `${timeOfDay} ! 👋`);
  // }, [session]);

  if (authLoading || loading || !summary) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Votre espace...</p>
        </div>
      </div>
    );
  }

  const activeCourses = summary.active_courses || [];
  const activePaths = summary.active_paths || [];
  const upcomingDeadlines = summary.deadlines || [];
  const stats = summary.stats || {};
  const certificatesCount = summary.certificates_count || 0;

  return (
    <div className="p-6 lg:p-10 space-y-12 relative overflow-hidden text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldEllipsis className="w-3 h-3" /> Space Students
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {welcomeMessage}
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl">Vous avez <span className="text-white">{activeCourses.length + activePaths.length} formations</span> en cours. Continuez sur votre lancée pour atteindre vos objectifs hebdomadaires.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objectif hebdo</p>
             </div>
             <div className="h-14 w-1 bg-white/5 rounded-full hidden md:block"></div>
             <Link href="/parcours" className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-indigo-500/20 whitespace-nowrap">
               Catalogue <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          <div className="space-y-12">
            {/* Échéances Critiques (Coursera Style) */}
            {upcomingDeadlines.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Échéances prioritaires</h3>
                  <Link href="/dashboard/calendar" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline">Voir le calendrier</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingDeadlines.map((deadline: any) => {
                    const isUrgent = deadline.priority === "high";
                    return (
                      <div key={deadline.id} className={`p-5 rounded-[24px] border ${isUrgent ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white/5 border-white/5'} flex items-start gap-4 group hover:scale-[1.02] transition-all`}>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/10 text-slate-400'}`}>
                          {deadline.type === "quiz" ? <Zap className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase tracking-widest ${isUrgent ? 'text-orange-400' : 'text-slate-500'}`}>{deadline.type === 'quiz' ? 'Quiz à venir' : 'Projet final'}</p>
                          <h4 className="font-bold text-sm text-white mt-1 truncate">{deadline.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             <Clock className={`h-3 w-3 ${isUrgent ? 'text-orange-500' : 'text-slate-500'}`} />
                             <span className={`text-[10px] font-bold ${isUrgent ? 'text-orange-400' : 'text-slate-500'}`}>
                                Avant le {new Date(deadline.date).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        {isUrgent && (
                          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Formations en cours */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-indigo-500 fill-indigo-500/20" />
                  <h2 className="text-xl font-black tracking-tight">Reprendre l'apprentissage</h2>
                </div>
                <Link href="/dashboard/courses" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Voir tout</Link>
              </div>

              {(activeCourses.length === 0 && activePaths.length === 0) ? (
                <div className="glass-card border-dashed border-white/10 bg-white/5 p-20 rounded-[48px] text-center space-y-8">
                  <div className="w-24 h-24 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mx-auto">
                    <Target className="h-10 w-10 text-indigo-500/50" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Prêt à commencer ?</h3>
                  <Link href="/parcours" className="btn-secondary px-10 py-5 rounded-2xl inline-block font-black uppercase tracking-widest text-[10px]">
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {activePaths.map((pe: any) => (
                    <CourseraItemCard key={`path-${pe.id}`} item={pe.learning_path} progress={pe.progress_percentage} enrolledAt={pe.enrolled_at} type="path" />
                  ))}
                  {activeCourses.map((e: any) => (
                    <CourseraItemCard key={`course-${e.id}`} item={e.course} progress={e.progress_percentage} enrolledAt={e.enrolled_at} type="course" />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Panneau Latéral (Coursera Style) */}
          <aside className="space-y-10">
             
             {/* Mes Statistiques */}
             <div className="glass-card p-8 rounded-[40px] border border-white/5 space-y-8 bg-white/5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Performance</h3>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Flame className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white">{stats.streak_days} jours</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Série actuelle</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Award className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white">{certificatesCount}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Certificats</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Moyenne Quiz</p>
                   <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-white">{stats.avg_quiz_score}%</p>
                      <TrendingUp className="h-5 w-5 text-emerald-500 mb-1.5" />
                   </div>
                </div>
             </div>

             {/* Ressources Rapides */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ressources & Notes</h3>
                <div className="space-y-3">
                   <Link href="/dashboard/notes" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                         <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Mes notes de cours</span>
                   </Link>
                   <Link href="/dashboard/grades" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                         <BarChart3 className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Notes & Résultats</span>
                   </Link>
                </div>
             </div>

             {/* Community Promo */}
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden group shadow-2xl">
                <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                   <h4 className="font-black text-xl leading-tight text-white">Besoin d'aide ?</h4>
                   <p className="text-indigo-100 text-xs font-medium leading-relaxed">Rejoignez la communauté et échangez avec d'autres experts en IA.</p>
                   <Link href="/communaute" className="inline-block pt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:translate-x-2 transition-transform">
                      Accéder au forum <ArrowRight className="inline h-3 w-3 ml-1" />
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
  // Calcul du retard (Mock Coursera Logic)
  const daysSinceEnrollment = Math.floor((new Date().getTime() - new Date(enrolledAt).getTime()) / (1000 * 60 * 60 * 24));
  const isLate = daysSinceEnrollment > 10 && progress < 15;
  const isOnTrack = progress > (daysSinceEnrollment * 2); // 2% par jour mini

  return (
    <div className="glass-card group flex flex-col md:flex-row overflow-hidden border border-white/5 hover:border-white/10 transition-all rounded-[40px] bg-white/[0.02]">
      <div className="relative w-full md:w-56 aspect-video md:aspect-square shrink-0 bg-slate-900 overflow-hidden">
        {item.thumbnail || item.path_thumbnail ? (
          <img src={item.thumbnail || item.path_thumbnail} alt={item.title || item.path_title} className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-500/5">
             <BarChart3 className="h-12 w-12 text-white/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-6 left-6">
           <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${
             isLate ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-black/60 border-white/10 text-indigo-400'
           }`}>
              {type === 'path' ? 'Spécialisation' : 'Cours MOOC'}
           </span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between gap-8">
        <div className="space-y-4">
           <div className="flex justify-between items-start gap-4">
              <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                {item.title || item.path_title}
              </h3>
           </div>
           
           <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <Clock className="h-3 w-3" /> {item.duration_hours || 12}h estimées
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isLate ? 'text-orange-500' : isOnTrack ? 'text-emerald-500' : 'text-slate-500'}`}>
                 <div className={`h-1.5 w-1.5 rounded-full ${isLate ? 'bg-orange-500' : isOnTrack ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                 {isLate ? 'En retard' : isOnTrack ? 'En avance' : 'Sur la bonne voie'}
              </div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
            <div className="space-y-1">
               <span className="text-slate-500">Prochaine étape</span>
               <p className="text-white normal-case font-bold text-xs">{progress < 10 ? "Introduction & Setup" : "Module 2 : Data Processing"}</p>
            </div>
            <span className="text-indigo-400">{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <div className="pt-2 flex items-center gap-4">
            <Link href={type === 'path' ? `/parcours/${item.slug || item.path_slug}` : `/learning/${item.slug || item.course_slug}/lesson/`} className={`flex-1 text-white text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all ${
              isLate ? 'bg-orange-600 hover:bg-orange-700' : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}>
              {progress > 0 ? 'Reprendre le module' : 'Commencer le cours'} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
