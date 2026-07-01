"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { ArrowUpRight, Clock, Search, Sparkles, Star, BookOpen } from "lucide-react";
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
    <div className="relative min-h-screen pt-24 pb-20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--brand-50)] rounded-full blur-[120px] opacity-70 pointer-events-none"></div>

      <section className="relative px-6 pb-12 lg:px-8 z-10">
        <div className="relative mx-auto max-w-7xl text-center space-y-8">
          <div className="badge badge-brand animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Propulsez votre carrière</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
            Maîtrisez les technologies <br />
            <span className="text-[var(--brand-500)]">du futur</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
            Des parcours structurés pour passer de zéro à expert en Machine Learning, 
            Data Engineering et Intelligence Artificielle.
          </p>

          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
              <input
                type="text"
                placeholder="Quelle compétence voulez-vous acquérir aujourd'hui ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-16 py-5 text-base text-[var(--text-primary)] shadow-sm outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)]"
              />
            </div>

            {/* Catalog Type Switch Tabs */}
            <div className="flex items-center justify-center gap-8 border-b border-[var(--border-subtle)] pb-4 mt-8">
              <button
                onClick={() => {
                  setCatalogType("courses");
                  setActiveLevel("all");
                }}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  catalogType === "courses" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span>Cours Individuels</span>
                {catalogType === "courses" && (
                  <motion.div 
                    layoutId="catalog-underline" 
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--brand-500)] rounded-t-full" 
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setCatalogType("paths");
                  setActiveLevel("all");
                }}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  catalogType === "paths" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span>Parcours Certifiants</span>
                {catalogType === "paths" && (
                  <motion.div 
                    layoutId="catalog-underline" 
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--brand-500)] rounded-t-full" 
                  />
                )}
              </button>
            </div>
            
            {/* Level Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeLevel === level 
                      ? "bg-[var(--brand-500)] text-white shadow-md" 
                      : "bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-active)] hover:text-[var(--brand-500)]"
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
        <div className="flex items-center gap-4 mb-8">
           <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
             {filtered.length} {catalogType === "courses" ? "Cours disponibles" : "Parcours disponibles"}
           </h2>
           <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-flat border-dashed p-20 text-center">
            <Search className="mx-auto h-12 w-12 text-[var(--text-tertiary)] mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Aucun résultat trouvé</h3>
            <p className="text-[var(--text-secondary)]">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const detailUrl = catalogType === "courses" ? `/parcours/${item.slug}` : `/parcours/path/${item.slug}`;
              return (
                <Link
                  key={item.id}
                  href={detailUrl}
                  className="card flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-[var(--bg-tertiary)] rounded-t-[11px]">
                      <CourseImage
                        src={item.thumbnail}
                        title={item.title}
                        categoryName={item.category?.name}
                        isPath={catalogType === "paths"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay to ensure badge readability if needed, but in light theme we can just use opaque badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className={`badge ${
                          item.level === 'beginner' ? 'badge-beginner' :
                          item.level === 'intermediate' ? 'badge-intermediate' :
                          'badge-advanced'
                        } shadow-sm backdrop-blur-md bg-opacity-90`}>
                          {LEVEL_LABELS[item.level]}
                        </span>
                        {item.is_free && (
                          <span className="badge badge-success shadow-sm backdrop-blur-md bg-opacity-90">
                            Offert
                          </span>
                        )}
                        {catalogType === "paths" && (
                          <span className="badge badge-brand shadow-sm backdrop-blur-md bg-opacity-90">
                            Parcours
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      {item.category && (
                        <span className="text-[10px] font-bold text-[var(--brand-500)] uppercase tracking-wider block">
                          {item.category.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">
                        {item.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-4 text-xs font-semibold text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-[var(--warning)] fill-[var(--warning)]" />
                          {parseFloat(item.avg_rating).toFixed(1)}
                        </span>
                        {catalogType === "courses" ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {item.duration_hours}h
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" /> {item.courses_count} cours
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {item.estimated_weeks} sem
                            </span>
                          </>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-[var(--brand-50)] group-hover:text-[var(--brand-500)] transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
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
