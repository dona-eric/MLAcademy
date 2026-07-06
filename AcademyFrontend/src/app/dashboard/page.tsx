"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
<<<<<<< HEAD
import {ArrowRight, Award, BookOpen, Clock, Flame, Target, TrendingUp, Zap, ChevronRight, Loader2, AlertCircle, FileText, CheckCircle2, CalendarDays} from "lucide-react";
=======
import { ArrowRight, Award, BarChart3, BookOpen, Clock, Flame, Play, ShieldEllipsis, Target, TrendingUp, Zap, ChevronRight, Loader2 } from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";
>>>>>>> develop

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
=======
  const [welcomeMessage, setWelcomeMessage] = useState('');
>>>>>>> develop

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
<<<<<<< HEAD
        setError("Erreur de chargement des données. Veuillez réessayer.");
=======
>>>>>>> develop
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, authLoading, router]);

<<<<<<< HEAD
  if (authLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Synchronisation...</p>
=======
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
    
    setWelcomeMessage(userName ? `${timeOfDay}, ${userName} ! 👋` : `${timeOfDay} ! 👋`);
  }, [user]);

  if (authLoading || loading || !summary) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-500)]" />
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-wider text-xs">Chargement de votre espace...</p>
>>>>>>> develop
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const activeCourses = summary?.active_courses || [];
  const activePaths = summary?.active_paths || [];
  const upcomingDeadlines = summary?.deadlines || [];
  const stats = summary?.stats || {};
  const certificatesCount = summary?.certificates_count || 0;

  const hasActiveLearning = activeCourses.length > 0 || activePaths.length > 0;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Bonjour, {user?.first_name || user?.username || 'Étudiant'}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Prêt à continuer votre apprentissage en Machine Learning ?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/parcours" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
          >
            Explorer le catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Échéances Critiques */}
          {upcomingDeadlines.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Priorités absolues</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingDeadlines.map((deadline: any) => {
                  const isUrgent = deadline.priority === "high";
                  return (
                    <div key={deadline.id} className={`p-5 rounded-xl border ${isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 shadow-sm'} flex items-start gap-4 transition-all hover:shadow-md`}>
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isUrgent ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                        {deadline.type === "quiz" ? <Zap className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isUrgent ? 'text-orange-600' : 'text-slate-500'}`}>
                          {deadline.type === 'quiz' ? 'Quiz à venir' : 'Projet final'}
                        </p>
                        <h4 className="font-semibold text-sm text-slate-900 leading-snug truncate">{deadline.title}</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                           <CalendarDays className={`w-3.5 h-3.5 ${isUrgent ? 'text-orange-500' : 'text-slate-400'}`} />
                           <span className={`text-[11px] font-medium ${isUrgent ? 'text-orange-600' : 'text-slate-500'}`}>
                              Avant le {new Date(deadline.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                           </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Formations en cours */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Reprendre l'apprentissage</h2>

            {!hasActiveLearning ? (
              <div className="bg-white border border-slate-200 p-12 rounded-xl text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Aucune formation active</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Votre tableau de bord est vide. Inscrivez-vous à un cours pour commencer votre progression.</p>
                </div>
                <Link href="/parcours" className="inline-flex items-center justify-center mt-4 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                  Parcourir le catalogue
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activePaths.map((pe: any) => (
                  <LearningItemCard key={`path-${pe.id}`} item={pe.learning_path} progress={pe.progress_percentage} type="path" />
                ))}
                {activeCourses.map((e: any) => (
                  <LearningItemCard key={`course-${e.id}`} item={e.course} progress={e.progress_percentage} type="course" />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar (Right) */}
        <aside className="space-y-6">
           
           {/* Mes Statistiques */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">Vue d'ensemble</h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                       <Flame className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-xl font-bold text-slate-900">{stats.streak_days || 0}</p>
                       <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Jours de suite</p>
                    </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <Award className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-xl font-bold text-slate-900">{certificatesCount}</p>
                       <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Certificats</p>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score moyen Quiz</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.avg_quiz_score || 0}%</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                 </div>
              </div>
           </div>

           {/* Outils & Liens */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">Boîte à outils</h3>
              <div className="space-y-2">
                 <Link href="/dashboard/notes" className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Mes notes de cours</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                 </Link>
                 <Link href="/dashboard/grades" className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Notes & Résultats</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                 </Link>
              </div>
           </div>
        </aside>

=======
  const activeCourses = summary.active_courses || [];
  const activePaths = summary.active_paths || [];
  const upcomingDeadlines = summary.deadlines || [];
  const stats = summary.stats || {};
  const certificatesCount = summary.certificates_count || 0;

  return (
    <div className="p-6 lg:p-10 space-y-12 relative overflow-hidden min-h-screen bg-[var(--bg-secondary)]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-50)] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-60"></div>
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--brand-50)] rounded-md border border-[var(--brand-100)] text-[var(--brand-500)] text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <ShieldEllipsis className="w-3.5 h-3.5" /> Espace Apprenant
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {welcomeMessage}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
              Vous avez <span className="font-bold text-[var(--text-primary)]">{activeCourses.length + activePaths.length} formations</span> en cours. Continuez sur votre lancée pour atteindre vos objectifs.
            </p>
          </div>
          <div className="flex items-center gap-5">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Objectif hebdo</p>
             </div>
             <div className="h-10 w-px bg-[var(--border-default)] hidden md:block"></div>
             <Link href="/parcours" className="btn-primary py-3 px-6 shadow-sm">
               Catalogue <ArrowRight className="h-4 w-4 ml-1" />
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
          
          <div className="space-y-10">
            {/* Échéances Critiques */}
            {upcomingDeadlines.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Échéances prioritaires</h3>
                  <Link href="/dashboard/calendar" className="text-xs font-bold text-[var(--brand-500)] hover:underline">Voir le calendrier</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingDeadlines.map((deadline: any) => {
                    const isUrgent = deadline.priority === "high";
                    return (
                      <div key={deadline.id} className={`p-5 rounded-2xl border flex items-start gap-4 transition-all hover:-translate-y-0.5 ${
                        isUrgent ? 'bg-[var(--warning-light)] border-amber-200 shadow-sm' : 'bg-white border-[var(--border-default)] shadow-sm'
                      }`}>
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isUrgent ? 'bg-[var(--warning)] text-white shadow-sm' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]'
                        }`}>
                          {deadline.type === "quiz" ? <Zap className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isUrgent ? 'text-amber-600' : 'text-[var(--text-tertiary)]'}`}>
                            {deadline.type === 'quiz' ? 'Quiz à venir' : 'Projet final'}
                          </p>
                          <h4 className="font-bold text-sm text-[var(--text-primary)] mt-1 truncate">{deadline.title}</h4>
                          <div className="flex items-center gap-1.5 mt-2">
                             <Clock className={`h-3.5 w-3.5 ${isUrgent ? 'text-amber-500' : 'text-[var(--text-tertiary)]'}`} />
                             <span className={`text-[10px] font-semibold ${isUrgent ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`}>
                                Avant le {new Date(deadline.date).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        {isUrgent && (
                          <div className="h-2 w-2 rounded-full bg-[var(--warning)] animate-pulse mt-1 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Formations en cours */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Play className="h-5 w-5 text-[var(--brand-500)] fill-[var(--brand-100)]" />
                  <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Reprendre l'apprentissage</h2>
                </div>
                <Link href="/dashboard/courses" className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--brand-500)] transition-colors">Voir tout</Link>
              </div>

              {(activeCourses.length === 0 && activePaths.length === 0) ? (
                <div className="card-flat border-dashed p-16 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-[var(--brand-50)] border border-[var(--brand-100)] flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-[var(--brand-500)]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Prêt à commencer ?</h3>
                    <p className="text-[var(--text-secondary)] text-sm">Découvrez nos parcours certifiants et développez de nouvelles compétences.</p>
                  </div>
                  <Link href="/parcours" className="btn-secondary px-8 py-3 text-sm">
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
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

          {/* Panneau Latéral */}
          <aside className="space-y-6">
             
             {/* Mes Statistiques */}
             <div className="card p-6 space-y-6">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Performance</h3>
                
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                            <Flame className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-lg font-bold text-[var(--text-primary)]">{stats.streak_days} jours</p>
                            <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mt-0.5">Série actuelle</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-lg bg-[var(--success-light)] border border-emerald-100 flex items-center justify-center text-[var(--success)]">
                            <Award className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-lg font-bold text-[var(--text-primary)]">{certificatesCount}</p>
                            <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mt-0.5">Certificats</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-5 border-t border-[var(--border-subtle)]">
                   <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Moyenne Quiz</p>
                   <div className="flex items-end gap-2">
                      <p className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{stats.avg_quiz_score}%</p>
                      <TrendingUp className="h-5 w-5 text-[var(--success)] mb-1.5" />
                   </div>
                </div>
             </div>

             {/* Ressources Rapides */}
             <div className="card p-6 space-y-5">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Ressources & Notes</h3>
                <div className="space-y-3">
                   <Link href="/dashboard/notes" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--brand-200)] hover:bg-white transition-colors group">
                      <div className="h-9 w-9 rounded-lg bg-[var(--brand-50)] flex items-center justify-center text-[var(--brand-500)] shrink-0">
                         <BookOpen className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors">Mes notes de cours</span>
                   </Link>
                   <Link href="/dashboard/grades" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-emerald-200 hover:bg-white transition-colors group">
                      <div className="h-9 w-9 rounded-lg bg-[var(--success-light)] flex items-center justify-center text-[var(--success)] shrink-0">
                         <BarChart3 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--success)] transition-colors">Notes & Résultats</span>
                   </Link>
                </div>
             </div>

             {/* Community Promo */}
             <div className="p-8 rounded-2xl bg-[var(--brand-500)] relative overflow-hidden group shadow-md">
                <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 space-y-4">
                   <h4 className="font-extrabold text-xl leading-tight text-white">Besoin d'aide ?</h4>
                   <p className="text-[var(--brand-100)] text-sm leading-relaxed">Rejoignez la communauté et échangez avec d'autres apprenants en IA.</p>
                   <Link href="/communaute" className="inline-flex items-center mt-2 text-xs font-bold uppercase tracking-wider text-white hover:opacity-80 transition-opacity">
                      Accéder au forum <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                   </Link>
                </div>
             </div>
          </aside>

        </div>
>>>>>>> develop
      </div>
    </div>
  );
}

<<<<<<< HEAD
function LearningItemCard({ item, progress, type }: { item: any, progress: number, type: 'course' | 'path' }) {
  // Defensive check in case item is null
  if (!item) return null;

  const title = item.title || item.path_title || 'Titre inconnu';
  const thumbnail = item.thumbnail || item.path_thumbnail;
  const slug = item.slug || item.path_slug || item.course_slug;
  const isPath = type === 'path';
  const url = isPath ? `/parcours/${slug}` : `/learning/${slug}/lesson/`;

  return (
    <Link href={url} className="group flex flex-col sm:flex-row bg-white overflow-hidden border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-300">
      
      {/* Thumbnail */}
      <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto shrink-0 bg-slate-100 border-r border-slate-200 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50">
             <BookOpen className="h-8 w-8 text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-widest shadow-sm ${
             isPath ? 'bg-indigo-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}>
             {isPath ? 'Certificat' : 'Cours'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0">
        <div>
           <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
             {title}
           </h3>
           <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.duration_hours || 12}h estimées</span>
           </div>
        </div>

        <div className="mt-6 space-y-2.5">
          <div className="flex justify-between items-end text-xs">
             <span className="font-semibold text-slate-700">{progress}% complété</span>
             <span className="font-bold text-indigo-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
               {progress > 0 ? 'Continuer' : 'Démarrer'} <ArrowRight className="w-3.5 h-3.5" />
             </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
    </Link>
=======
function CourseraItemCard({ item, progress, enrolledAt, type }: { item: any, progress: number, enrolledAt: string, type: 'course' | 'path' }) {
  const daysSinceEnrollment = Math.floor((new Date().getTime() - new Date(enrolledAt).getTime()) / (1000 * 60 * 60 * 24));
  const isLate = daysSinceEnrollment > 10 && progress < 15;
  const isOnTrack = progress > (daysSinceEnrollment * 2);

  return (
    <div className="card flex flex-col md:flex-row overflow-hidden group">
      <div className="relative w-full md:w-64 aspect-video md:aspect-auto shrink-0 bg-[var(--bg-tertiary)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] overflow-hidden">
        <CourseImage
          src={item.thumbnail || item.path_thumbnail}
          title={item.title || item.path_title || ""}
          isPath={type === 'path'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
           <span className={`badge shadow-sm backdrop-blur-md bg-opacity-95 ${
             isLate ? 'badge-error' : 'badge-brand'
           }`}>
              {type === 'path' ? 'Spécialisation' : 'Cours MOOC'}
           </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
        <div className="space-y-3">
           <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors line-clamp-2 leading-tight">
                {item.title || item.path_title}
              </h3>
           </div>
           
           <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                 <Clock className="h-3.5 w-3.5" /> {item.duration_hours || 12}h estimées
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${isLate ? 'text-[var(--warning)]' : isOnTrack ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'}`}>
                 <div className={`h-2 w-2 rounded-full ${isLate ? 'bg-[var(--warning)]' : isOnTrack ? 'bg-[var(--success)]' : 'bg-[var(--text-secondary)]'}`} />
                 {isLate ? 'En retard' : isOnTrack ? 'En avance' : 'Sur la bonne voie'}
              </div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
               <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Prochaine étape</span>
               <p className="text-[var(--text-primary)] font-semibold text-sm">{progress < 10 ? "Introduction & Setup" : "Module 2 : Data Processing"}</p>
            </div>
            <span className="text-[var(--brand-500)] font-bold">{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="pt-3">
            <Link href={type === 'path' ? `/parcours/${item.slug || item.path_slug}` : `/learning/${item.slug || item.course_slug}/lesson/`} className={`inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              isLate ? 'bg-[var(--warning-light)] text-[var(--warning)] border border-amber-200 hover:bg-amber-100' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-500)] hover:border-[var(--brand-200)]'
            }`}>
              {progress > 0 ? 'Reprendre le module' : 'Commencer le cours'} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
>>>>>>> develop
  );
}
