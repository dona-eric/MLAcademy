"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Filter,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

interface CourseSummary {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  thumbnail: string;
  level: string;
  duration_hours: number;
  is_free: boolean;
  avg_rating: string;
  category?: { name: string };
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export default function ParcoursPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchApi("/api/courses/");
        setCourses(data.results ?? data);
      } catch (error) {
        console.error("Erreur de chargement des cours:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filtered = courses.filter((course) => {
    const matchesLevel = activeLevel === "all" || course.level === activeLevel;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(q) ||
      course.short_description.toLowerCase().includes(q);
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="mesh-gradient" />
      
      <section className="relative px-6 pb-16 lg:px-8">
        <div className="relative mx-auto max-w-7xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-indigo-500/20 text-indigo-400 text-sm font-medium animate-reveal">
            <Sparkles className="h-4 w-4" />
            <span>Propulsez votre carrière</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
            Maîtrisez les technologies <br />
            <span className="text-gradient">du futur</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
            Des parcours structurés pour passer de zéro à expert en Machine Learning, 
            Data Engineering et Intelligence Artificielle.
          </p>

          <div className="mx-auto mt-12 max-w-3xl space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Quelle compétence voulez-vous acquérir aujourd'hui ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-slate-900/60 px-16 py-5 text-lg text-white outline-none backdrop-blur-xl transition focus:border-indigo-500/50"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeLevel === level 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105" 
                      : "glass-card bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {level === "all" ? "Tous les niveaux" : LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-xl font-bold text-white whitespace-nowrap">
             {filtered.length} Formations disponibles
           </h2>
           <div className="h-px w-full bg-white/5" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] glass-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card border-dashed border-slate-700 p-20 text-center">
            <Search className="mx-auto h-16 w-16 text-slate-700 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-500">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <Link
                key={course.id}
                href={`/parcours/${course.slug}`}
                className="group glass-card overflow-hidden hover:bg-white/[0.04]"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-800">
                      <Zap className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {LEVEL_LABELS[course.level]}
                    </span>
                    {course.is_free && (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Offert
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8 flex flex-col gap-6">
                  <div className="space-y-4">
                    {course.category && (
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        {course.category.name}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {course.short_description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                        {parseFloat(course.avg_rating).toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {course.duration_hours}h
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
