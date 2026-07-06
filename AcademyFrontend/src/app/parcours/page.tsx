"use client";

<<<<<<< HEAD
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import {
  Search, Star, Clock, Users, BookOpen,
  Award, Filter, X, SlidersHorizontal, ChevronDown, Loader2
} from "lucide-react";
import { Category, CourseSummary, LearningPathSummary } from "@/types/course";
import { LEVEL_LABELS, ORDERING_OPTIONS } from "@/types/constant";


// ─── Utilities ────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function buildParams(params: Record<string, string | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "" && val !== "all") {
      sp.set(key, String(val));
    }
  }
  return sp.toString() ? `?${sp.toString()}` : "";
}

// ─── Sub-components ───────────────────────────────

function ResultCard({ item, type }: { item: CourseSummary | LearningPathSummary; type: "course" | "path" }) {
  const href = type === "path" ? `/parcours/${item.slug}` : `/learning/${item.slug}`;
  const rating = parseFloat(item.avg_rating || "0");

  return (
    <Link href={href} className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col">

      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden shrink-0">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
            item.level === "beginner" ? "bg-green-100 text-green-700" :
          item.level === "intermediate" ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-700"
          }`}>
          {LEVEL_LABELS[item.level] || item.level}
        </span>
        {item.is_free && (
          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-semibold uppercase">Gratuit</span>
        )}
        {type === "path" && (item as LearningPathSummary).is_certifying && (
          <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold uppercase">Certifiant</span>
        )}
      </div>
    </div>

      {/* Body */ }
  <div className="p-5 flex flex-col flex-1 gap-3">
    {item.category && (
      <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">{item.category.name}</span>
    )}
    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
      {item.title}
    </h3>
    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">{item.short_description}</p>

    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
      {rating > 0 && (
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {rating.toFixed(1)}
        </span>
      )}
      <span className="flex items-center gap-1">
        <Users className="w-3 h-3" />
        {item.enrolled_count}
      </span>
      {type === "course" ? (
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {(item as CourseSummary).duration_hours}h
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Award className="w-3 h-3" />
          {(item as LearningPathSummary).courses_count} cours
        </span>
      )}
      <span className="ml-auto text-[10px] text-slate-400 font-medium">
        {type === "path" ? "par " + (item as LearningPathSummary).creator_name : "par " + (item as CourseSummary).instructor_name}
      </span>
    </div>
  </div>
    </Link >
  );
}

// ─── Main Page ────────────────────────────────────

function ParcoursContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "paths" ? "paths" : searchParams.get("tab") === "courses" ? "courses" : "paths";

  // Filters State
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"paths" | "courses">(initialTab);
  const [level, setLevel] = useState("all");
  const [categorySlug, setCategorySlug] = useState("all");
  const [isFree, setIsFree] = useState<boolean | undefined>(undefined);
  const [ordering, setOrdering] = useState("-created_at");

  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<(CourseSummary | LearningPathSummary)[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  // Load categories once
  useEffect(() => {
    fetchApi("/api/public/courses/categories/")
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Run search on any filter change
  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "paths" ? "/api/public/courses/paths/" : "/api/public/courses/";
      const params = buildParams({
        search: debouncedQuery || undefined,
        level: level !== "all" ? level : undefined,
        category_slug: categorySlug !== "all" ? categorySlug : undefined,
        is_free: isFree !== undefined ? isFree : undefined,
        ordering,
      });

      const data = await fetchApi(`${endpoint}${params}`);
      const items = data.results ?? data;
      setResults(items);
      setTotalCount(data.count ?? items.length);
    } catch (err) {
      console.error("Erreur de recherche:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, activeTab, level, categorySlug, isFree, ordering]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const hasActiveFilters = level !== "all" || categorySlug !== "all" || isFree !== undefined;

  const resetFilters = () => {
    setLevel("all");
    setCategorySlug("all");
    setIsFree(undefined);
    setOrdering("-created_at");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER / SEARCH ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un cours, un parcours, une compétence..."
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-slate-100 rounded-md p-1 gap-1 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("paths")}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "paths" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
              Parcours
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "courses" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
            Cours
          </button>
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-md text-sm font-medium transition-colors ${filtersOpen || hasActiveFilters ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
        <SlidersHorizontal className="w-4 h-4" />
        Filtres
        {hasActiveFilters && <span className="w-2 h-2 bg-indigo-600 rounded-full" />}
      </button>
    </div>

          {/* Expanded Filters */ }
  {
    filtersOpen && (
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">

        {/* Level */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Niveau</span>
          <div className="flex gap-1.5">
            {["all", "beginner", "intermediate", "advanced"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${level === l ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
            {l === "all" ? "Tous" : LEVEL_LABELS[l]}
          </button>
                  ))}
        </div>
      </div>

              {/* Category */ }
    {
      categories.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Catégorie</span>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
      )
    }

    {/* Free only */ }
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isFree === true}
        onChange={(e) => setIsFree(e.target.checked ? true : undefined)}
        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-xs font-medium text-slate-700">Gratuit uniquement</span>
    </label>

    {/* Ordering */ }
    <div className="flex items-center gap-2 ml-auto">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Trier par</span>
      <select
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
        className="bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      >
        {ORDERING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>

    {
      hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Réinitialiser
        </button>
      )
    }
            </div >
          )
  }
        </div >
      </div >

    {/* ── RESULTS AREA ── */ }
    < div className = "max-w-7xl mx-auto px-4 md:px-8 py-8" >

      {/* Result count */ }
      < div className = "flex items-center justify-between mb-6" >
        <p className="text-sm font-medium text-slate-600">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Recherche en cours...</span>
          ) : (
            <><span className="font-semibold text-slate-900">{totalCount}</span> {activeTab === "paths" ? "parcours" : "cours"} {debouncedQuery ? `pour "${debouncedQuery}"` : "disponibles"}</>
          )}
        </p>
        </div >

    {/* Grid */ }
  {
    !loading && results.length === 0 ? (
      <div className="bg-white border border-dashed border-slate-200 rounded-lg p-16 text-center">
        <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun résultat</h3>
        <p className="text-sm text-slate-500 mb-4">
          Aucun {activeTab === "paths" ? "parcours" : "cours"} ne correspond à votre recherche.
        </p>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-sm font-medium text-indigo-600 hover:underline">
            Réinitialiser les filtres
          </button>
        )}
      </div>
    ) : (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
  {
    results.map((item) => (
      <ResultCard key={item.id} item={item} type={activeTab === "paths" ? "path" : "course"} />
    ))
  }
          </div >
        )
}
      </div >
    </div >
  );
}

export default function ParcoursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>}>
      <ParcoursContent />
    </Suspense>
  );
}

=======
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
            Les technologies qui façonnent <br />
            <span className="text-[var(--brand-500)]">votre futur</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
            Des parcours structurés pour passer de zéro à expert en Machine Learning, Data, Développement, AI, Quantum etc...
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
>>>>>>> develop
