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
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-error",
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
      <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500 bg-[var(--bg-secondary)] min-h-[calc(100vh-64px)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Contenu de la chaîne</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{courses.length} élément{courses.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/studio/courses/create" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shrink-0">
          <Plus className="w-4 h-4" /> Nouveau cours
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[var(--bg-primary)] rounded-xl p-1 shadow-sm border border-[var(--border-subtle)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--brand-50)] text-[var(--brand-600)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer les contenus..."
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] py-2 pl-10 pr-4 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 px-4 py-2.5 bg-[var(--brand-50)] border border-[var(--brand-200)] rounded-xl shadow-sm animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[var(--brand-600)]">{selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}</span>
          <div className="h-4 w-px bg-[var(--brand-200)]" />
          <button className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--brand-600)] transition-colors">Publier</button>
          <button className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--brand-600)] transition-colors">Archiver</button>
          <button className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors">Supprimer</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-4 card border border-dashed border-[var(--border-default)] shadow-none">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-50)] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-[var(--brand-500)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Aucun contenu trouvé</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Essayez de modifier vos filtres ou créez votre premier cours.</p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_100px_100px_90px_80px_100px_60px] items-center px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            <button onClick={toggleAll} className="flex items-center justify-center">
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-[var(--brand-500)]" />
              ) : (
                <Square className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]" />
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
              className={`grid grid-cols-[40px_1fr_100px_100px_90px_80px_100px_60px] items-center px-4 py-3 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-all group ${
                selectedIds.has(course.id) ? "bg-[var(--brand-50)]" : "bg-[var(--bg-primary)]"
              }`}
            >
              <button onClick={() => toggleOne(course.id)} className="flex items-center justify-center">
                {selectedIds.has(course.id) ? (
                  <CheckSquare className="w-4 h-4 text-[var(--brand-500)]" />
                ) : (
                  <Square className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
                )}
              </button>

              {/* Course Info */}
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-[100px] h-14 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                  <CourseImage src={course.thumbnail} title={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <Link href={`/studio/courses/${course.id}/edit`} className="text-[13px] font-bold text-[var(--text-primary)] hover:text-[var(--brand-500)] transition-colors truncate block">
                    {course.title}
                  </Link>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{course.short_description}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className={`badge ${
                  course.is_published
                    ? "badge-success"
                    : "badge-neutral"
                }`}>
                  {course.is_published ? "Public" : "Brouillon"}
                </span>
              </div>

              {/* Level */}
              <div>
                <span className={`badge ${LEVEL_COLORS[course.level] || "badge-neutral"}`}>
                  {LEVEL_LABELS[course.level] || course.level}
                </span>
              </div>

              {/* Enrolled */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                <Users className="w-3 h-3 text-[var(--text-tertiary)]" />
                {course.enrolled_count || 0}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{parseFloat(course.avg_rating || "0").toFixed(1)}</span>
              </div>

              {/* Date */}
              <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                {course.created_at ? new Date(course.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' }) : "—"}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/studio/courses/${course.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-all" title="Modifier">
                  <Edit3 className="w-4 h-4" />
                </Link>
                <Link href={`/parcours/${course.slug}`} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-all" title="Voir">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
