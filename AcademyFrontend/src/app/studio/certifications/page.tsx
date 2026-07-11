"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, Plus, Sparkles, Edit3, 
  Eye, Users, Loader2, BookOpen
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import CourseImage from "@/components/learning/CourseImage";

export default function InstructorCertificationsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      try {
        const data = await fetchApi("/api/private/studio/learning-paths/");
        setPaths(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPaths();
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Espace Certifications</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Gérer vos Certifications</h1>
        </div>
        <Link href="/studio/learning-paths/create" className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-emerald-500/20 bg-emerald-500 border-emerald-500 hover:bg-emerald-600">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
          Créer une certification
        </Link>
      </div>

      {paths.length === 0 ? (
        <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-20 text-center space-y-6 bg-white/5">
          <Award className="w-16 h-16 text-slate-800 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Aucun parcours certifiant</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">Regroupez vos cours pour offrir une certification reconnue dans le domaine de l'IA.</p>
          </div>
          <Link href="/studio/learning-paths/create" className="btn-secondary mt-4 px-8 py-3 rounded-xl inline-block">Lancer mon premier parcours</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path) => (
            <div key={path.id} className="glass-card group flex flex-col md:flex-row rounded-[40px] border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all">
              <div className="relative w-full md:w-56 aspect-video md:aspect-square bg-slate-900 overflow-hidden shrink-0">
                <CourseImage
                  src={path.thumbnail}
                  title={path.title}
                  isPath={true}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{path.title}</h3>
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Users className="h-4 h-4 text-emerald-500" /> {path.enrolled_count} inscrits</span>
                    <span className="flex items-center gap-2"><BookOpen className="h-4 h-4 text-emerald-500" /> {path.courses_count} cours</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all">
                    <Edit3 className="w-4 h-4" /> Modifier le parcours
                  </button>
                  <Link href={`/parcours/path/${path.slug}`} className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center border border-white/5 transition-all">
                    <Eye className="w-5 h-5" />
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
