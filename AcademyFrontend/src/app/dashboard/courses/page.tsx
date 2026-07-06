"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { 
<<<<<<< HEAD
  BookOpen, ChevronRight, 
  Search, Loader2, BarChart3,
  CheckCircle2, PlayCircle
} from "lucide-react";
=======
  BookOpen, Clock, ChevronRight, 
  Search, Filter, Loader2, BarChart3,
  CheckCircle2, PlayCircle
} from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";
>>>>>>> develop

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadCourses() {
      try {
        const data = await fetchApi("/api/private/learning/my-courses/");
        setEnrollments(data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [user, authLoading, router]);

  const filteredEnrollments = enrollments.filter(e => 
    e.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEnrollments = filteredEnrollments.filter(e => !e.is_completed);
  const completedEnrollments = filteredEnrollments.filter(e => e.is_completed);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090C14]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 text-white">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">Mes Cours</h1>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-20 text-center space-y-6 bg-white/5">
          <BookOpen className="w-16 h-16 text-slate-800 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Vous n'êtes inscrit à aucun cours</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">Explorez notre catalogue pour trouver la formation qui vous correspond.</p>
          </div>
          <Link href="/parcours" className="btn btn-secondary mt-4 px-8 py-3 rounded-xl inline-block">Découvrir le catalogue</Link>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Active Courses */}
          {activeEnrollments.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-widest text-[10px]">En cours d'apprentissage ({activeEnrollments.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeEnrollments.map((enrollment) => (
                  <CourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedEnrollments.length > 0 && (
            <div className="space-y-8 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-black text-white uppercase tracking-widest text-[10px]">Terminés ({completedEnrollments.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedEnrollments.map((enrollment) => (
                  <CourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          )}

          {filteredEnrollments.length === 0 && searchQuery && (
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Aucun résultat pour "{searchQuery}"</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: any }) {
  const progress = enrollment.progress_percentage || 0;
  
  return (
    <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all group flex flex-col h-full bg-white/5">
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
<<<<<<< HEAD
        {enrollment.course_thumbnail ? (
          <img src={enrollment.course_thumbnail} alt={enrollment.course_title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-500/5">
            <BarChart3 className="w-12 h-12 text-white/5" />
          </div>
        )}
=======
        <CourseImage
          src={enrollment.course_thumbnail}
          title={enrollment.course_title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
>>>>>>> develop
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10 shadow-sm">
              {enrollment.course_level || "Mixte"}
           </span>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">{enrollment.course_title}</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">Progression</span>
            <span className="text-indigo-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'}`}
              style={{ width: `${progress}%` }} 
            />
          </div>
          <Link 
            href={`/learning/${enrollment.course_slug}/lesson/`} 
            className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              enrollment.is_completed 
                ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
            }`}
          >
            {enrollment.is_completed ? 'Revoir le cours' : 'Continuer'} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
