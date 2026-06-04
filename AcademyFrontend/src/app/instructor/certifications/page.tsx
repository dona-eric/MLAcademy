"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Plus, Sparkles, Edit3, Eye, Users, Loader2, BookOpen } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function InstructorCertificationsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      try {
        const data = await fetchApi("/api/instructor/learning-paths/");
        setPaths(Array.isArray(data) ? data : (data.results ?? []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPaths();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">Espace Certifications</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Gérer vos Certifications</h1>
        </div>
        <Link href="/instructor/learning-paths/create" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Créer un parcours
        </Link>
      </div>

      {paths.length === 0 ? (
        <div className="bg-slate-200 rounded-lg p-16 text-center">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun parcours certifiant</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Regroupez vos cours pour offrir une certification structurée et reconnue dans votre domaine.
          </p>
          <Link
            href="/instructor/learning-paths/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
          >
            Lancer mon premier parcours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paths.map((path) => (
            <div key={path.id} className="bg-white group flex flex-col sm:flex-row rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all">

              <div className="relative w-full sm:w-48 aspect-video sm:aspect-square bg-slate-100 overflow-hidden shrink-0">
                {path.thumbnail ? (
                  <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                    <Award className="w-8 h-8 text-emerald-200" />
                  </div>
                )}
                {path.is_published ? (
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold uppercase rounded">Publié</div>
                ) : (
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase rounded">Brouillon</div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {path.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> {path.enrolled_count || 0} inscrits</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> {path.courses_count || 0} cours</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <button className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center justify-center gap-2">
                    <Edit3 className="w-3.5 h-3.5" /> Modifier
                  </button>
                  <Link
                    href={"/parcours/${path.slug}"}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-md transition-colors"
                    title="Voir le parcours public"
                  >
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
