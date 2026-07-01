"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Users, DollarSign, BookOpen, Star, Plus, Play, Clock, Award, ChevronRight, Zap, Sparkles, UserPlus, MessageSquare, FileCheck, Loader2 } from "lucide-react";
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
        <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
        <p className="mt-3 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Chargement du Studio</p>
      </div>
    );
  }

  const kpis = [
    { icon: Users, label: "Apprenants", value: stats?.total_students ?? courses.reduce((s: number, c: any) => s + (c.enrolled_count || 0), 0), trend: stats?.growth || "+12%", color: "indigo", bgColor: "var(--brand-50)", textColor: "var(--brand-500)" },
    { icon: BookOpen, label: "Cours publiés", value: courses.filter((c: any) => c.is_published).length, trend: `${courses.length} total`, color: "cyan", bgColor: "var(--info-light)", textColor: "var(--info)" },
    { icon: DollarSign, label: "Revenus", value: stats?.total_revenue ?? "0 FCFA", trend: "Ce mois", color: "emerald", bgColor: "var(--success-light)", textColor: "var(--success)" },
    { icon: Clock, label: "Temps d'étude", value: stats?.total_study_hours ?? "+0h", trend: "Cette semaine", color: "amber", bgColor: "var(--warning-light)", textColor: "var(--warning)" },
  ];

  const recentActivity = stats?.recent_activity || [];

  const activityIconMap: Record<string, any> = {
    enrollment: UserPlus,
    review: Star,
    submission: FileCheck,
    welcome: Sparkles,
  };

  const quickActions = [
    { label: "Nouveau cours", icon: Plus, href: "/studio/courses/create", color: "text-[var(--brand-500)]", bgColor: "bg-[var(--brand-50)]" },
    { label: "Nouveau tutoriel", icon: Play, href: "/studio/tutos/create", color: "text-[var(--warning)]", bgColor: "bg-[var(--warning-light)]" },
    { label: "Certification", icon: Award, href: "/studio/learning-paths/create", color: "text-[var(--success)]", bgColor: "bg-[var(--success-light)]" },
    { label: "Importer", icon: Zap, href: "/studio/resources?action=upload", color: "text-purple-500", bgColor: "bg-purple-50" },
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
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8 min-h-screen bg-[var(--bg-secondary)]">

      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Bienvenue, {user?.first_name || user?.username}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Voici un aperçu de l'activité de votre chaîne d'enseignement.</p>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="card p-5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: kpi.bgColor }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.textColor }} />
              </div>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Analytics Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Performances des 30 derniers jours</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Inscriptions et engagement</p>
          </div>
          <Link href="/studio/analytics" className="text-xs font-bold text-[var(--brand-500)] hover:underline flex items-center gap-1">
            Détails <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-32">
          {enrollmentCounts.map((count: number, i: number) => {
            const h = Math.max((count / maxEnrollments) * 100, 2);
            return (
              <div
                key={i}
                className="flex-1 bg-[var(--brand-200)] rounded-t hover:bg-[var(--brand-400)] transition-colors cursor-pointer"
                style={{ height: `${h}%` }}
                title={`${count} inscription(s)`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
          <span>{formatDateLabel(30)}</span>
          <span>{formatDateLabel(15)}</span>
          <span>{formatDateLabel(0)}</span>
        </div>
      </div>

      {/* Row 3: Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-5">Activité récente</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? recentActivity.map((item: any, i: number) => {
              const Icon = activityIconMap[item.type] || MessageSquare;
              // Add safe defaults for color to avoid dynamic tailwind classes failing in JIT
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.text}</p>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] font-medium shrink-0">{item.time}</span>
                </div>
              );
            }) : (
              <p className="text-sm text-[var(--text-secondary)] italic">Aucune activité récente.</p>
            )}
          </div>
        </div>


        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-5">Actions rapides</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-subtle)] transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${action.bgColor}`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Latest Content */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Vos derniers contenus</h2>
          <Link href="/studio/courses" className="text-xs font-bold text-[var(--brand-500)] hover:underline flex items-center gap-1">
            Tout voir <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 space-y-4 rounded-xl border border-dashed border-[var(--border-default)]">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-50)] border border-[var(--brand-100)] flex items-center justify-center mx-auto">
              <Play className="w-6 h-6 text-[var(--brand-500)]" />
            </div>
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">Votre catalogue est vide</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">Partagez votre expertise dès maintenant en créant votre premier cours.</p>
            </div>
            <Link href="/studio/courses/create" className="btn-primary px-6 py-2.5 mt-2 inline-flex">
              <Plus className="w-4 h-4 mr-2" /> Créer ma première formation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((course: any) => (
              <Link
                key={course.id}
                href={`/studio/courses/${course.id}/edit`}
                className="flex gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-subtle)] transition-all group"
              >
                <div className="w-28 h-16 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
                  <CourseImage src={course.thumbnail} title={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5">
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--brand-500)] transition-colors">{course.title}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count || 0}</span>
                    <span className={`badge ${
                      course.is_published ? "badge-success" : "badge-neutral"
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
