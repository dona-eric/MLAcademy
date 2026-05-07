"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Flame,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const enrollments = await fetchApi("/api/users/me/enrollments/");
        setEnrolledCourses(enrollments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative pt-24 pb-20">
      <div className="mesh-gradient" />
      
      <div className="mx-auto max-w-7xl space-y-10 px-6 lg:px-8">
        {/* Hero Header */}
        <section className="relative glass-card overflow-hidden p-8 md:p-12">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <TrendingUp className="h-40 w-40 text-indigo-400" />
          </div>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Votre espace personnel
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                Ravi de vous revoir, <br />
                <span className="text-gradient">
                  {user?.first_name || user?.username || "Explorateur"}
                </span>
              </h1>
              <p className="max-w-2xl text-slate-400 text-lg leading-relaxed">
                Continuez votre ascension vers l'expertise en Machine Learning. 
                Voici un aperçu de vos progrès actuels.
              </p>
            </div>
            <Link href="/parcours" className="btn btn-primary px-8 py-4">
              Nouvelle Formation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Stats Grid - Bento Style */}
        <section className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-2 glass-card p-8 bg-indigo-600/5 flex items-center justify-between group">
             <div className="space-y-2">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Cours en cours</p>
                <p className="text-5xl font-black text-white">{enrolledCourses.length}</p>
             </div>
             <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8" />
             </div>
          </div>
          
          <div className="glass-card p-8 flex flex-col justify-between">
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Assiduité</p>
             <div className="flex items-end justify-between mt-4">
                <p className="text-3xl font-black text-white">3 jrs</p>
                <Flame className="h-8 w-8 text-orange-500" />
             </div>
          </div>

          <div className="glass-card p-8 flex flex-col justify-between border-emerald-500/10">
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Certificats</p>
             <div className="flex items-end justify-between mt-4">
                <p className="text-3xl font-black text-white">0</p>
                <Award className="h-8 w-8 text-emerald-500" />
             </div>
          </div>
        </section>

        {/* Learning Content */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Play className="h-6 w-6 text-indigo-500" />
              Reprendre l'apprentissage
            </h2>
            <Link href="/parcours" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-2">
               Catalogue Complet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="glass-card border-dashed border-slate-700 bg-white/5 p-16 text-center">
              <Target className="mx-auto h-16 w-16 text-slate-700 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Aucun parcours commencé</h3>
              <p className="text-slate-400 max-w-sm mx-auto mb-8">
                C'est le moment idéal pour choisir votre première formation et commencer à builder.
              </p>
              <Link href="/parcours" className="btn btn-primary px-8">
                Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {enrolledCourses.map((enrollment: any) => {
                const course = enrollment.course;
                const progress = enrollment.progress || 15;

                return (
                  <div
                    key={enrollment.id}
                    className="glass-card group flex flex-col md:flex-row overflow-hidden hover:bg-white/[0.04]"
                  >
                    <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0 bg-slate-900">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-800">
                          <BarChart3 className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                         <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {course.title}
                            </h3>
                            <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded border border-white/5 text-slate-500 uppercase tracking-tighter">
                               {course.level || "Mixte"}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {course.duration_hours}h</span>
                            <span className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {course.modules_count || 'N/A'} mod.</span>
                         </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Progression</span>
                          <span className="text-indigo-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <Link
                          href={`/learning/${course.slug}/lesson/`}
                          className="btn btn-secondary w-full py-3 text-xs uppercase tracking-widest font-bold mt-2"
                        >
                          Continuer la leçon
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
