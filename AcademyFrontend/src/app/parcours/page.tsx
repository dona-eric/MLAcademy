"use client";

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

