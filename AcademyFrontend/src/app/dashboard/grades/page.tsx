"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {Award, Loader2, TrendingUp, BookOpen, ChevronRight} from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#090C14]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const enrollments = summary.active_courses || [];
  const stats = summary.stats || {};
  const certificatesCount = summary.certificates_count || 0;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 text-white">
      
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-white tracking-tight">Notes & Résultats</h1>
        <p className="text-slate-500 font-medium">Consultez vos performances académiques et vos scores de certification.</p>
      </div>

      {/* Global Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Moyenne Générale</p>
            <div className="flex items-end gap-2">
               <p className="text-4xl font-black text-white">{stats.avg_quiz_score}%</p>
               <TrendingUp className="h-5 w-5 text-emerald-500 mb-1" />
            </div>
         </div>
         <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Quiz Réussis</p>
            <p className="text-4xl font-black text-white">{enrollments.length > 0 ? 'En cours' : '—'}</p>
         </div>
         <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Projets Validés</p>
            <p className="text-4xl font-black text-white">0</p>
         </div>
         <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Certificats</p>
            <p className="text-4xl font-black text-white">{certificatesCount}</p>
         </div>
      </div>

      {/* Detailed Course Grades */}
      <div className="space-y-6">
         <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Détail par formation</h2>
         
         <div className="grid grid-cols-1 gap-6">
            {enrollments.map((enrollment: any) => (
               <div key={enrollment.id} className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/5 hover:border-white/10 transition-all group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                           <BookOpen className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{enrollment.course_title}</h3>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center gap-8 lg:gap-16">
                        <div className="text-center lg:text-right">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Progression</p>
                           <p className="text-xl font-black text-white">{enrollment.progress_percentage}%</p>
                        </div>
                        <div className="text-center lg:text-right">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernier Quiz</p>
                           <p className="text-xl font-black text-emerald-500">95%</p>
                        </div>
                        <div className="text-center lg:text-right">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Statut</p>
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${enrollment.is_completed ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                              {enrollment.is_completed ? 'Terminé' : 'En cours'}
                           </span>
                        </div>
                        <Link href={`/learning/${enrollment.course_slug}/lesson/`} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                           <ChevronRight className="h-5 w-5" />
                        </Link>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Upcoming Exams Info */}
      <div className="p-10 rounded-[40px] bg-gradient-to-br from-slate-900 to-black border border-white/5 text-white space-y-6 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
         <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
               <Award className="h-6 w-6" />
            </div>
            <h4 className="text-2xl font-black leading-tight">Prêt pour la certification ?</h4>
         </div>
         <p className="text-sm text-slate-500 leading-relaxed max-w-2xl relative z-10">Une fois qu'un cours atteint 100% de progression et que tous les quiz sont validés avec un score supérieur à 70%, vous pouvez générer votre certificat officiel MLAcademy.</p>
         <button className="px-10 py-5 rounded-[20px] bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10">
            Consulter mes accomplissements
         </button>
      </div>

    </div>
  );
}
