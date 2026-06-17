"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Plus, Edit3, Eye, Trash2,
  Users, Clock, Star, Loader2, Search,
  CheckSquare, Square, MoreVertical, BarChart3, Filter
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import CourseImage from "@/components/learning/CourseImage";

const TABS = [
  { key: "all", label: "Tous" },
  { key: "published", label: "Publiés" },
  { key: "draft", label: "Brouillons" },
];

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-rose-500/10 text-rose-400",
};

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchApi("/api/studio/courses/");
        setCourses(data?.results || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filtered = courses.filter((c) => {
    if (activeTab === "published" && !c.is_published) return false;
    if (activeTab === "draft" && c.is_published) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.short_description?.toLowerCase().includes(q);
    }
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Contenu de la chaîne</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">{courses.length} élément{courses.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/studio/courses/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-[12px] font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 shrink-0">
          <Plus className="w-4 h-4" /> Nouveau cours
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer les contenus..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-[12px] text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/40 transition-all"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in fade-in duration-200">
          <span className="text-[12px] font-bold text-indigo-400">{selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}</span>
          <div className="h-4 w-px bg-indigo-500/20" />
          <button className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors">Publier</button>
          <button className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors">Archiver</button>
          <button className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors">Supprimer</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-800 mx-auto" />
          <div>
            <p className="text-[14px] font-semibold text-white">Aucun contenu trouvé</p>
            <p className="text-[12px] text-slate-500 mt-1">Essayez de modifier vos filtres ou créez votre premier cours.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_100px_100px_90px_80px_100px_60px] items-center px-4 py-3 border-b border-white/[0.06] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <button onClick={toggleAll} className="flex items-center justify-center">
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <span>Cours</span>
            <span>Statut</span>
            <span>Niveau</span>
            <span>Inscrits</span>
            <span>Note</span>
            <span>Créé le</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map((course) => (
            <div
              key={course.id}
              className={`grid grid-cols-[40px_1fr_100px_100px_90px_80px_100px_60px] items-center px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-all group ${
                selectedIds.has(course.id) ? "bg-indigo-500/[0.04]" : ""
              }`}
            >
              <button onClick={() => toggleOne(course.id)} className="flex items-center justify-center">
                {selectedIds.has(course.id) ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-700 group-hover:text-slate-500" />
                )}
              </button>

              {/* Course Info */}
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-[100px] h-14 rounded-lg bg-slate-800/50 overflow-hidden shrink-0">
                  <CourseImage src={course.thumbnail} title={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <Link href={`/studio/courses/${course.id}/edit`} className="text-[13px] font-semibold text-white hover:text-indigo-400 transition-colors truncate block">
                    {course.title}
                  </Link>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">{course.short_description}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  course.is_published
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-500/10 text-slate-400"
                }`}>
                  {course.is_published ? "Public" : "Brouillon"}
                </span>
              </div>

              {/* Level */}
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${LEVEL_COLORS[course.level] || "text-slate-400"}`}>
                  {LEVEL_LABELS[course.level] || course.level}
                </span>
              </div>

              {/* Enrolled */}
              <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
                <Users className="w-3 h-3" />
                {course.enrolled_count || 0}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[12px] font-medium">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-slate-400">{parseFloat(course.avg_rating || "0").toFixed(1)}</span>
              </div>

              {/* Date */}
              <div className="text-[11px] text-slate-600 font-medium">
                {course.created_at ? new Date(course.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' }) : "—"}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/studio/courses/${course.id}/edit`} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all" title="Modifier">
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>
                <Link href={`/parcours/${course.slug}`} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all" title="Voir">
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
