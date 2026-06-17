"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { 
  Users, DollarSign, BookOpen, Star, TrendingUp, 
  ArrowRight, Sparkles, BarChart3, Plus, Play,
  Clock, Award, ChevronRight, Zap, Target
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.is_instructor) {
      router.push('/dashboard');
      return;
    }

    async function loadData() {
      try {
        const statsData = await fetchApi('/api/instructor/stats/');
        setStats(statsData);

        const myCourses = await fetchApi('/api/public/courses/?instructor=me');
        setCourses(myCourses.results || myCourses);
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold animate-pulse">Chargement de votre Studio...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
      
      {/* Welcome & Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">MLAcademy Studio • Mode Expert</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ravi de vous voir, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Prof. {user?.first_name || user?.username}
            </span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Prêt à propulser la prochaine génération d'experts en IA ?</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/instructor/courses/create" className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-indigo-500/20">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Nouveau Parcours
          </Link>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Rapports détaillés
          </button>
        </div>
      </div>

      {/* Studio Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Publier un Cours", desc: "Formations longues et structurées", icon: <BookOpen className="w-6 h-6" />, color: "indigo", href: "/instructor/courses/create" },
          { label: "Créer une Certification", desc: "Validation officielle d'expertise", icon: <Award className="w-6 h-6" />, color: "emerald", href: "/instructor/certifications" },
          { label: "Nouveau Tutoriel", desc: "Contenu court et focus technique", icon: <Play className="w-6 h-6" />, color: "amber", href: "/instructor/tutos" },
        ].map((action, i) => (
          <Link key={i} href={action.href} className={`glass-card p-6 rounded-[32px] border border-white/5 hover:border-${action.color}-500/30 hover:bg-${action.color}-500/5 transition-all group flex items-start gap-5`}>
            <div className={`w-12 h-12 rounded-2xl bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-400 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-white">{action.label}</h4>
              <p className="text-xs text-slate-500 font-medium">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Users className="w-6 h-6 text-indigo-400" />, label: "Apprenants", value: stats?.total_students, trend: stats?.growth, color: "indigo" },
          { icon: <DollarSign className="w-6 h-6 text-emerald-400" />, label: "Revenus", value: stats?.total_revenue, trend: "Stable", color: "emerald" },
          { icon: <Zap className="w-6 h-6 text-amber-400" />, label: "Vues Profil", value: stats?.views, trend: "+24%", color: "amber" },
          { icon: <Star className="w-6 h-6 text-rose-400" />, label: "Note Moyenne", value: stats?.avg_rating, trend: "Top 5%", color: "rose" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4 hover:border-white/10 transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-${kpi.color}-500/10 border border-${kpi.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-black text-white">{kpi.value}</p>
                <span className={`text-[10px] font-bold ${kpi.trend?.startsWith('+') ? 'text-emerald-400' : 'text-slate-500'}`}>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Course List Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-black text-white tracking-tight">Vos Formations</h2>
            </div>
            <Link href="/instructor/courses" className="text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-1">
              Tout voir <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            {courses.length === 0 ? (
              <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-16 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-xl font-bold">Votre catalogue est vide</p>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Commencez à partager votre savoir dès aujourd'hui en créant votre premier parcours.</p>
                </div>
                <Link href="/instructor/courses/create" className="btn-primary py-4 px-10 rounded-2xl inline-block">Créer ma première leçon</Link>
              </div>
            ) : (
              courses.map((course: any) => (
                <div key={course.id} className="glass-card rounded-[32px] border border-white/5 p-6 flex items-center gap-6 hover:border-indigo-500/30 hover:bg-white/5 transition-all group">
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 overflow-hidden shrink-0 relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase border border-white/10">
                      {course.level}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> 245 Apprenants</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 12h de contenu</div>
                      <div className="flex items-center gap-1.5 text-emerald-400"><Award className="w-3 h-3" /> {course.is_free ? 'Gratuit' : 'Premium'}</div>
                    </div>
                  </div>
                  <Link href={`/instructor/courses/${course.id}`} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all shadow-xl group-hover:translate-x-2">
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-10">
          {/* Notifications / Actions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-white tracking-tight">À faire d'urgence</h2>
            </div>
            <div className="glass-card rounded-[32px] border border-white/5 p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">8 Peer-Reviews en attente</p>
                  <p className="text-xs text-slate-500 mt-1">Vos étudiants attendent vos retours sur leurs projets finaux.</p>
                  <Link href="/instructor/peer-reviews" className="text-xs font-black text-amber-400 mt-3 inline-block hover:underline uppercase tracking-wider">Évaluer maintenant</Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 italic">Mise à jour suggérée</p>
                  <p className="text-xs text-slate-600 mt-1">Le module "Deep Learning" nécessite une mise à jour des librairies.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Activity / Progress */}
          <section className="space-y-6">
             <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-black text-white tracking-tight">Performances</h2>
            </div>
            <div className="glass-card rounded-[32px] border border-white/5 p-8 relative overflow-hidden h-48 flex items-end justify-between">
              {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                <div key={i} className="w-4 bg-gradient-to-t from-indigo-500/40 to-cyan-400/40 rounded-t-lg transition-all hover:from-indigo-500 hover:to-cyan-400" style={{ height: `${h}%` }}></div>
              ))}
              <div className="absolute top-8 right-8 text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temps d'étude</p>
                <p className="text-2xl font-black text-white">+145h</p>
                <p className="text-[10px] font-bold text-emerald-400">cette semaine</p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
