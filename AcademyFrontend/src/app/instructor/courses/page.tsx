"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Plus, Sparkles, Edit3, Eye, Users, BarChart3, Clock, Loader2} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchApi("/api/private/instructor/courses/");
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            <Sparkles className="w-3 h-3" /> Space Studio
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Mes Formations</h1>
        </div>
        <Link href="/instructor/courses/create" className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-indigo-500/20">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Créer un parcours
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-20 text-center space-y-6 bg-white/5">
          <BookOpen className="w-16 h-16 text-slate-800 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Aucune formation trouvée</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">Vous n'avez pas encore créé de formation. Commencez dès maintenant à partager votre expertise.</p>
          </div>
          <Link href="/instructor/courses/create" className="btn-secondary mt-4 px-8 py-3 rounded-xl inline-block">Créer ma première formation</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card group flex flex-col rounded-[32px] border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-500/5">
                    <BarChart3 className="w-12 h-12 text-white/5" />
                  </div>
                )}
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                  {course.is_published ? "En ligne" : "Brouillon"}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">{course.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {course.enrolled_count} élèves</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {course.duration_hours}h</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                  <Link href={"/instructor/courses/${course.id}/edit"} className="flex-1 bg-white/5 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Edit3 className="w-3 h-3" /> Modifier
                  </Link>
                  <Link href={"/parcours/${course.slug}"} className="w-12 h-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl flex items-center justify-center border border-white/5 transition-all">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
