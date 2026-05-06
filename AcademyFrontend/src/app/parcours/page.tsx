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
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden px-6 pb-10 pt-20 lg:px-8 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.10),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.08),_transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Parcours d’apprentissage
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Choisis un parcours et progresse en{" "}
            <span className="text-gradient">IA</span> à ton rythme.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Explore les formations disponibles en machine learning, data science
            et intelligence artificielle avec une expérience claire et
            responsive.
          </p>

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-14 py-4 text-base outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Niveaux
                </span>
              </div>
              {(["all", "beginner", "intermediate", "advanced"] as const).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${activeLevel === level ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700"}`}
                  >
                    {level === "all" ? "Tous" : LEVEL_LABELS[level]}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 md:text-2xl">
            {filtered.length} formations trouvées
          </h2>
          <div className="hidden h-px flex-1 bg-slate-200 md:block" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-[1.75rem] bg-white"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">
              Aucun résultat
            </h3>
            <p className="mt-2 text-slate-500">
              Essaie un autre mot-clé ou réinitialise les filtres.
            </p>
            <button
              onClick={() => {
                setActiveLevel("all");
                setSearchQuery("");
              }}
              className="btn btn-secondary mt-6"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <Link
                key={course.id}
                href={`/parcours/${course.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900 text-white/20">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
                  <div className="absolute left-5 top-5 flex flex-col gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 backdrop-blur">
                      {LEVEL_LABELS[course.level]}
                    </span>
                    {course.is_free && (
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                        Gratuit
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-full flex-col p-6">
                  <div className="space-y-3">
                    {course.category && (
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                        {course.category.name}
                      </p>
                    )}
                    <h3 className="text-xl font-semibold leading-tight text-slate-950 transition group-hover:text-indigo-700">
                      {course.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {course.short_description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{" "}
                        {parseFloat(course.avg_rating).toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {course.duration_hours}h
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
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
