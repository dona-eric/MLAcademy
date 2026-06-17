"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { ArrowUpRight, Clock, Search, Sparkles, Star, Zap, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";
import CourseImage from "@/components/learning/CourseImage";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export default function ParcoursPage() {
  const [catalogType, setCatalogType] = useState<"courses" | "paths">("courses");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const endpoint = catalogType === "courses" ? "/api/public/courses/" : "/api/public/courses/paths/";
        const data = await fetchApi(endpoint);
        setItems(data.results ?? data);
      } catch (error) {
        console.error("Erreur de chargement du catalogue:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [catalogType]);

  const filtered = items.filter((item) => {
    const matchesLevel = activeLevel === "all" || item.level === activeLevel;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.short_description.toLowerCase().includes(q);
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-24 pb-20 overflow-hidden bg-[#090C14]">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>
      
      <section className="relative px-6 pb-12 lg:px-8 z-10">
        <div className="relative mx-auto max-w-7xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/10 text-indigo-400 text-sm font-bold animate-reveal">
            <Sparkles className="h-4 w-4" />
            <span>Propulsez votre carrière</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Maîtrisez les technologies <br />
            <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">du futur</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
            Des parcours structurés pour passer de zéro à expert en Machine Learning, 
            Data Engineering et Intelligence Artificielle.
          </p>

          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Quelle compétence voulez-vous acquérir aujourd'hui ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-slate-900/40 px-16 py-5 text-lg text-white outline-none backdrop-blur-xl transition focus:border-indigo-500/30"
                />
              </div>
            </div>

            {/* Catalog Type Switch Tabs */}
            <div className="flex items-center justify-center gap-8 border-b border-white/5 pb-4 mt-8">
              <button
                onClick={() => {
                  setCatalogType("courses");
                  setActiveLevel("all");
                }}
                className={`pb-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all relative ${
                  catalogType === "courses" ? "text-white font-bold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>Cours Individuels</span>
                {catalogType === "courses" && (
                  <motion.div 
                    layoutId="catalog-underline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" 
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setCatalogType("paths");
                  setActiveLevel("all");
                }}
                className={`pb-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all relative ${
                  catalogType === "paths" ? "text-white font-bold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>Parcours Certifiants</span>
                {catalogType === "paths" && (
                  <motion.div 
                    layoutId="catalog-underline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" 
                  />
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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

      <section className="mx-auto max-w-7xl px-6 lg:px-8 z-10 relative">
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-xl font-extrabold text-white whitespace-nowrap tracking-tight">
             {filtered.length} {catalogType === "courses" ? "Cours disponibles" : "Parcours disponibles"}
           </h2>
           <div className="h-px w-full bg-white/5" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] glass-card animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card border-dashed border-slate-700 p-20 text-center rounded-[32px]">
            <Search className="mx-auto h-16 w-16 text-slate-700 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-500">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const detailUrl = catalogType === "courses" ? `/parcours/${item.slug}` : `/parcours/path/${item.slug}`;
              return (
                <Link
                  key={item.id}
                  href={detailUrl}
                  className="group glass-card overflow-hidden hover:bg-white/[0.04] flex flex-col justify-between h-full rounded-[32px] border border-white/5 hover:border-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <CourseImage
                        src={item.thumbnail}
                        title={item.title}
                        categoryName={item.category?.name}
                        isPath={catalogType === "paths"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute left-4 top-4 flex flex-col gap-2">
                        <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {LEVEL_LABELS[item.level]}
                        </span>
                        {item.is_free && (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Offert
                          </span>
                        )}
                        {catalogType === "paths" && (
                          <span className="px-3 py-1 rounded-lg bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Parcours
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-8 space-y-4">
                      {item.category && (
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                          {item.category.name}
                        </span>
                      )}
                      <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {item.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                          {parseFloat(item.avg_rating).toFixed(1)}
                        </span>
                        {catalogType === "courses" ? (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {item.duration_hours}h
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-indigo-400" /> {item.courses_count} cours
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" /> {item.estimated_weeks} sem
                            </span>
                          </>
                        )}
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
