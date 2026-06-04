"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  Users, DollarSign, Star, TrendingUp,
  ArrowRight, Plus, Clock, Award, Target,
  AlertCircle, FileText, LayoutDashboard, MonitorPlay
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [peerReviews, setPeerReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Appel direct sur l'API instructeur pour la gestion des cours
        const myCourses = await fetchApi('/api/instructor/courses/');
        setCourses(myCourses.results || myCourses || []);

        // Appel direct pour récupérer uniquement les reviews en attente
        const reviewsData = await fetchApi('/api/instructor/peer-reviews/to-review/');
        setPeerReviews(reviewsData.results || reviewsData || []);

      } catch (err: any) {
        console.error("Erreur de chargement des données instructeur:", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-medium text-slate-500">Chargement de votre espace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos formations et suivez les performances de vos étudiants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/instructor/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau parcours
          </Link>
        </div>
      </div>

      {/* KPI METRICS (Real Data Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Apprenants actifs", value: stats?.total_students ?? 0, icon: Users },
          { label: "Revenus totaux", value: stats?.total_revenue ?? "0 FCFA", icon: DollarSign },
          { label: "Vues profil", value: stats?.views ?? 0, icon: TrendingUp },
          { label: "Note moyenne", value: stats?.avg_rating ? "${stats.avg_rating}/5" : "-", icon: Star },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border-b flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
              <kpi.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* COURSES SECTION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Vos Formations ({courses.length})</h2>
            {courses.length > 0 && (
              <Link href="/instructor/courses" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Voir tout
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {courses.length === 0 ? (
              <div className="bg-slate-50  rounded-lg p-10 text-center">
                <MonitorPlay className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-slate-900 mb-1">Aucun cours publié</h3>
                <p className="text-xs text-slate-500 mb-4">Créez votre première formation pour commencer à enseigner.</p>
                <Link href="/instructor/courses/create" className="inline-flex items-center justify-center px-4 py-2 bg-white text-slate-700 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors">
                  Créer un cours
                </Link>
              </div>
            ) : (
              courses.slice(0, 5).map((course: any) => (
                <div key={course.id} className="group bg-white rounded-lg p-4 flex items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="w-16 h-16 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <LayoutDashboard className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      <Link href={"/instructor/courses/${course.id}"}>
                        {course.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count ?? 0}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_hours ?? 0}h</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {course.level === 'beginner' ? 'Débutant' : course.level === 'intermediate' ? 'Interm.' : 'Avancé'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={"/instructor/courses/${course.id}"}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TASKS & NOTIFICATIONS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Tâches en attente</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {peerReviews.length === 0 ? (
              <div className="p-8 text-center">
                <Target className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900">Aucune évaluation en attente</p>
                <p className="text-xs text-slate-500 mt-1">Vos étudiants travaillent sur leurs projets.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                <div className="p-4 bg-orange-50/50">
                  <p className="text-xs font-semibold text-orange-800 mb-1">
                    {peerReviews.length} évaluation{peerReviews.length > 1 ? 's' : ''} requise{peerReviews.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-[11px] text-orange-600">Projets finaux en attente de votre correction.</p>
                </div>
                {peerReviews.slice(0, 4).map((review: any) => (
                  <Link
                    key={review.id}
                    href={"/instructor/peer-reviews/${review.id}"}
                    className="flex flex-col gap-1 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 truncate pr-2">{review.student_name || review.student_username}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(review.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{review.project_title}</span>
                  </Link>
                ))}
                {peerReviews.length > 4 && (
                  <div className="p-3 bg-slate-50 text-center">
                    <Link href="/instructor/peer-reviews" className="text-xs font-medium text-indigo-600 hover:underline">
                      Voir toutes les évaluations
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Outils Rapides */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Ressources</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/instructor/certifications" className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <Award className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">Certifications</span>
              </Link>
              <Link href="/instructor/tutos" className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">Tutoriels</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
