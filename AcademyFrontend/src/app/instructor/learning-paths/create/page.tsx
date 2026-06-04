"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Award, Clock,
  ImageIcon, Loader2, TrendingUp
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CreateLearningPathPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    level: "beginner",
    estimated_weeks: 12,
    price: 0,
    is_free: false,
    is_certifying: true,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchApi("/api/public/courses/categories/");
        // Fix for categories.map bug: extract array if paginated
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setCategories(list);
        if (list.length > 0) setFormData(prev => ({ ...prev, category: list[0].id }));
      } catch (err) {
        console.error(err);
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

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      if (thumbnail) payload.append("thumbnail", thumbnail);

      const path = await fetchApi("/api/instructor/learning-paths/", {
        method: "POST",
        body: payload,
      });

      router.push("/instructor/learning-paths/${path.id}/edit");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du parcours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <Link href="/instructor/certifications" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour aux certifications
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
            <Award className="w-3 h-3" /> Certification Expert
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Lancer un nouveau Parcours
          </h1>
          <p className="text-slate-500 text-sm">Regroupez plusieurs cours pour créer une expertise reconnue.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Titre de la Certification</label>
                <input
                  required name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="Ex: Data Engineer Professional Certificate"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Promesse courte</label>
                <textarea
                  required name="short_description" value={formData.short_description} onChange={handleChange}
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="Ce que l'apprenant sera capable de faire en une phrase..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Programme & Objectifs</label>
                <textarea
                  required name="description" value={formData.description} onChange={handleChange}
                  rows={6}
                  className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="Détaillez les compétences clés, les outils enseignés et le projet Capstone final..."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Paramètres
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Catégorie</label>
                  <select
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Niveau Cible</label>
                  <select
                    name="level" value={formData.level} onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                    <option value="professional">Professionnel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Durée estimée</label>
                  <div className="relative flex items-center">
                    <input
                      type="number" name="estimated_weeks" value={formData.estimated_weeks} onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-3 pr-20 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                    />
                    <span className="absolute right-3 text-xs text-slate-500 font-medium">semaines</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">Branding</h3>
              <div className="relative aspect-video rounded-md bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Image de couverture</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} accept="image/*" />
              </div>
            </section>

            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Créer le parcours</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
