"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Clock,
  Target, Image as ImageIcon, Save,
  ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    level: "beginner",
    duration_hours: 10,
    price: 0,
    is_free: false,
    is_published: false,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchApi("/api/public/courses/categories/");
        // L'API peut retourner un objet paginé {results: [...]} ou un tableau direct
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setCategories(list);
        if (list.length > 0) setFormData(prev => ({ ...prev, category: list[0].id }));
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Erreur lors du chargement des catégories.");
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      if (thumbnail) payload.append("thumbnail", thumbnail);

      const course = await fetchApi("/api/instructor/courses/", {
        method: "POST",
        body: payload,
      });

      router.push("/instructor/courses/${course.id}/edit");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de la création du cours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/instructor"
          className="p-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Créer un parcours</h1>
          <p className="text-sm text-slate-500 mt-1">Configurez les informations générales de votre formation.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 space-y-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-4">
              Informations principales
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Titre de la formation</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: Fondamentaux du Machine Learning"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Résumé court</label>
              <input
                required
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Une phrase accrocheuse pour le catalogue..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description complète</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Détaillez le programme, les objectifs et ce que l'apprenant va accomplir..."
              />
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-4">
              Paramètres
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {categories.length === 0 && <option value="">Chargement...</option>}
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Niveau</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Durée (Heures)</label>
                <input
                  type="number"
                  name="duration_hours"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-4">
              Couverture
            </h2>
            <div className="relative group aspect-video rounded-md bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-100 transition-colors">
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-slate-500">Cliquez pour uploader</span>
                </>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleThumbnailChange}
                accept="image/*"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer le brouillon
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
