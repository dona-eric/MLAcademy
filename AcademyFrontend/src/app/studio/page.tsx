"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {Users, DollarSign, BookOpen, Star, Plus, Play, Clock, Award, ChevronRight,Zap, Sparkles, UserPlus, MessageSquare, FileCheck, Loader2} from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";

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
        const [statsData, myCourses] = await Promise.allSettled([
          fetchApi('/api/studio/stats/'),
          fetchApi('/api/studio/courses/')
        ]);
        if (statsData.status === 'fulfilled') setStats(statsData.value);
        if (myCourses.status === 'fulfilled') setCourses(myCourses.value?.results || myCourses.value || []);
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
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="mt-3 text-[12px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Chargement du Studio</p>
      </div>
    );
  }

  const kpis = [
    { icon: Users, label: "Apprenants", value: stats?.total_students ?? courses.reduce((s: number, c: any) => s + (c.enrolled_count || 0), 0), trend: stats?.growth || "+12%", color: "indigo" },
    { icon: BookOpen, label: "Cours publiés", value: courses.filter((c: any) => c.is_published).length, trend: `${courses.length} total`, color: "cyan" },
    { icon: DollarSign, label: "Revenus", value: stats?.total_revenue ?? "0 FCFA", trend: "Ce mois", color: "emerald" },
    { icon: Clock, label: "Temps d'étude", value: stats?.total_study_hours ?? "+0h", trend: "Cette semaine", color: "amber" },
  ];

  const recentActivity = stats?.recent_activity || [];

  const activityIconMap: Record<string, any> = {
    enrollment: UserPlus,
    review: Star,
    submission: FileCheck,
    welcome: Sparkles,
  };

  const quickActions = [
    { label: "Nouveau cours", icon: Plus, href: "/studio/courses/create", color: "indigo" },
    { label: "Nouveau tutoriel", icon: Play, href: "/studio/tutos/create", color: "amber" },
    { label: "Certification", icon: Award, href: "/studio/learning-paths/create", color: "emerald" },
    { label: "Importer", icon: Zap, href: "/studio/resources?action=upload", color: "purple" },
  ];

  // Dynamic Chart Heights
  const enrollmentCounts = stats?.daily_enrollments || Array(30).fill(0);
  const maxEnrollments = Math.max(...enrollmentCounts, 1);

  // Dynamic Date Labels
  const formatDateLabel = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">

      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Bienvenue, {user?.first_name || user?.username}
        </h1>
        <p className="text-[13px] text-slate-500">Voici un aperçu de l'activité de votre chaîne.</p>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-500/10 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Analytics Chart */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-bold text-white">Performances des 30 derniers jours</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Inscriptions et engagement</p>
          </div>
          <Link href="/studio/analytics" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            Détails <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-32">
          {enrollmentCounts.map((count: number, i: number) => {
            const h = Math.max((count / maxEnrollments) * 100, 2);
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-indigo-500/30 to-indigo-400/10 rounded-t transition-all hover:from-indigo-500/60 hover:to-indigo-400/30 cursor-pointer"
                style={{ height: `${h}%` }}
                title={`${count} inscription(s)`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-medium text-slate-600">
          <span>{formatDateLabel(30)}</span>
          <span>{formatDateLabel(15)}</span>
          <span>{formatDateLabel(0)}</span>
        </div>
      </div>

      {/* Row 3: Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-[15px] font-bold text-white mb-5">Activité récente</h2>
          <div className="space-y-3">
            {recentActivity.map((item: any, i: number) => {
              const Icon = activityIconMap[item.type] || MessageSquare;
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all">
                  <div className={`w-9 h-9 rounded-xl bg-${item.color}-500/10 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 text-${item.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-300 truncate">{item.text}</p>
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium shrink-0">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>


        {/* Quick Actions */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-[15px] font-bold text-white mb-5">Actions rapides</h2>
          <div className="space-y-2">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl bg-${action.color}-500/10 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                </div>
                <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Latest Content */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-white">Vos derniers contenus</h2>
          <Link href="/studio/courses" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            Tout voir <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
              <Play className="w-7 h-7 text-slate-700" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Votre catalogue est vide</p>
              <p className="text-[12px] text-slate-500 mt-1 max-w-sm mx-auto">Partagez votre expertise dès maintenant.</p>
            </div>
            <Link href="/studio/courses/create" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-[12px] font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
              <Plus className="w-4 h-4" /> Créer ma première formation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course: any) => (
              <Link
                key={course.id}
                href={`/studio/courses/${course.id}/edit`}
                className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-28 h-16 rounded-lg bg-slate-800/50 overflow-hidden shrink-0">
                  <CourseImage src={course.thumbnail} title={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[13px] font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{course.title}</p>
                  <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count || 0}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      course.is_published ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                    }`}>
                      {course.is_published ? "Public" : "Brouillon"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
