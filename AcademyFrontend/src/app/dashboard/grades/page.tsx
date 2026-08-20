"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {Award, Loader2, TrendingUp, BookOpen, ChevronRight, FileCheck, CheckCircle2, Trophy} from "lucide-react";
import Link from "next/link";

export default function GradesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadGrades() {
      try {
        const data = await fetchApi("/api/private/learning/dashboard-summary/");
        setSummary(data);
      } catch (err) {
        console.error("Failed to load grades", err);
      } finally {
        setLoading(false);
      }
    }

    loadGrades();
  }, [user, authLoading, router]);

  if (authLoading || loading || !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Chargement de vos notes...</p>
        </div>
      </div>
    );
  }

  const enrollments = summary.active_courses || [];
  const stats = summary.stats || {};
  const certificatesCount = summary.certificates_count || 0;

  return (
    <div className="p-6 lg:p-10 space-y-12 relative overflow-hidden min-h-screen bg-[#fafafa]">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 via-purple-50/20 to-transparent blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100/50 text-[11px] font-bold uppercase tracking-widest">
            <Trophy className="w-4 h-4" /> Suivi Académique
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">Notes & Résultats</h1>
          <p className="text-slate-500 text-base font-medium max-w-2xl">
            Consultez vos performances académiques, vos scores de certification et l'historique de vos réussites.
          </p>
        </div>

        {/* Global Performance Stats (Bento Box Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                 <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyenne Générale</p>
                 <div className="flex items-end gap-1">
                    <p className="text-4xl font-black text-slate-900">{stats.avg_quiz_score}</p>
                    <span className="text-xl font-bold text-slate-400 mb-1">%</span>
                 </div>
              </div>
           </div>
           
           <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                 <FileCheck className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Quiz Réussis</p>
                 <p className="text-4xl font-black text-slate-900">{enrollments.length > 0 ? 'En cours' : '—'}</p>
              </div>
           </div>
           
           <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                 <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Projets Validés</p>
                 <p className="text-4xl font-black text-slate-900">0</p>
              </div>
           </div>
           
           <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-indigo-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none"></div>
              <div className="h-12 w-12 rounded-2xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-4 relative z-10 shadow-sm">
                 <Award className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                 <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-1">Certificats</p>
                 <p className="text-4xl font-black text-indigo-950">{certificatesCount}</p>
              </div>
           </div>
        </div>

        {/* Detailed Course Grades */}
        <div className="space-y-6">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
             <BookOpen className="w-4 h-4 text-slate-400" /> Détail par formation
           </h2>
           
           {enrollments.length === 0 ? (
             <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center space-y-4">
               <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
               <p className="text-slate-500 font-medium">Vous n'avez pas encore de formations en cours.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-5">
                {enrollments.map((enrollment: any) => {
                  const isCompleted = enrollment.is_completed || enrollment.progress_percentage === 100;
                  
                  return (
                    <div key={enrollment.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                          
                          <div className="flex items-center gap-5">
                              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-indigo-500 border border-slate-200'}`}>
                                <BookOpen className="h-7 w-7" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{enrollment.course_title}</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                              </div>
                          </div>

                          <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 md:gap-10">
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progression</p>
                                <p className="text-2xl font-black text-slate-900">{enrollment.progress_percentage}%</p>
                              </div>
                              <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernier Quiz</p>
                                <p className="text-2xl font-black text-emerald-500">95%</p>
                              </div>
                              <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Statut</p>
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                  isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}>
                                    {isCompleted ? 'Terminé' : 'En cours'}
                                </span>
                              </div>
                              
                              <Link href={`/learning/${enrollment.course_slug}/lesson/`} className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 text-slate-500 shadow-sm shrink-0 mt-4 lg:mt-0">
                                <ChevronRight className="h-5 w-5" />
                              </Link>
                          </div>
                          
                        </div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>

        {/* Upcoming Exams Info */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-800 text-white space-y-6 relative overflow-hidden group shadow-[0_10px_40px_rgba(79,70,229,0.25)]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
           <div className="absolute bottom-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
           
           <div className="flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                 <Award className="h-7 w-7" />
              </div>
              <h4 className="text-2xl md:text-3xl font-black leading-tight drop-shadow-sm">Prêt pour la certification ?</h4>
           </div>
           <p className="text-indigo-100 text-base md:text-lg font-medium leading-relaxed max-w-2xl relative z-10">
             Une fois qu'un cours atteint 100% de progression et que tous les quiz sont validés avec un score supérieur à 70%, vous pouvez générer votre certificat officiel MLAcademy.
           </p>
           <button className="mt-4 px-8 py-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-white/50">
              Consulter mes accomplissements
           </button>
        </div>

      </div>
    </div>
  );
}
