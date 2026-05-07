"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'instructor') {
      router.push('/dashboard');
      return;
    }

    async function loadData() {
      try {
        // Fetch dashboard stats (fake data for now until API is ready)
        setStats({
          total_students: 1240,
          total_revenue: "4,500 €",
          active_courses: 5,
          avg_rating: "4.8"
        });

        const myCourses = await fetchApi('/api/courses/?instructor=me');
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFB800]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A192F]/5 rounded-full border border-[#0A192F]/5">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            <span className="text-[10px] font-black text-[#0A192F] uppercase tracking-widest">Instructor Studio</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A192F] font-georgia tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-gray-500 font-medium">Gérez vos formations et suivez vos performances.</p>
        </div>
        <Link href="/instructor/courses/create" className="btn btn-primary shadow-xl shadow-cyan-100">
          Créer un nouveau parcours
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <Users className="w-6 h-6 text-[#00D1FF]" />, label: "Apprenants", value: stats?.total_students, bg: "bg-[#00D1FF]/10" },
          { icon: <DollarSign className="w-6 h-6 text-green-500" />, label: "Revenus", value: stats?.total_revenue, bg: "bg-green-500/10" },
          { icon: <BookOpen className="w-6 h-6 text-[#FFB800]" />, label: "Cours Actifs", value: stats?.active_courses, bg: "bg-[#FFB800]/10" },
          { icon: <Star className="w-6 h-6 text-purple-500" />, label: "Note Globale", value: stats?.avg_rating, bg: "bg-purple-500/10" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
            <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-bold text-[#0A192F]">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Course List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0A192F] font-georgia">Vos Parcours Récents</h2>
            <Link href="/instructor/courses" className="text-sm font-bold text-[#00D1FF] hover:underline">Voir tout</Link>
          </div>

          <div className="space-y-4">
            {courses.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 text-center">
                <p className="text-gray-500 font-medium">Vous n'avez pas encore créé de parcours.</p>
                <Link href="/instructor/courses/create" className="btn btn-secondary mt-4">Créer mon premier parcours</Link>
              </div>
            ) : (
              courses.slice(0, 3).map((course: any) => (
                <div key={course.id} className="bg-white rounded-[32px] border border-gray-100 p-6 flex items-center gap-6 hover:shadow-lg transition-all group">
                  <div className="w-20 h-20 rounded-2xl bg-[#0A192F] overflow-hidden shrink-0 relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <BarChart3 className="w-8 h-8 text-white/20 absolute inset-0 m-auto" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold text-[#0A192F] group-hover:text-[#00D1FF] transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{course.level}</span>
                      <span>•</span>
                      <span className="text-[#FFB800]">{course.is_free ? 'Gratuit' : 'Premium'}</span>
                    </div>
                  </div>
                  <Link href={`/instructor/courses/${course.id}`} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#00D1FF] hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0A192F] font-georgia">Actions Requises</h2>
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A192F]">12 Peer-Reviews en attente</p>
                <p className="text-xs text-gray-500 mt-1">Vos étudiants attendent vos retours sur leurs projets finaux.</p>
                <Link href="/instructor/peer-reviews" className="text-xs font-bold text-orange-600 mt-2 inline-block hover:underline">Évaluer maintenant</Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A192F]">Mise à jour suggérée</p>
                <p className="text-xs text-gray-500 mt-1">Le module "Deep Learning" de votre parcours "Python IA" a besoin d'être actualisé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
