"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, BookOpen, Clock, 
  Target, Image as ImageIcon, Save, 
  Plus, Trash2, ChevronRight, Check
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
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
        const list = Array.isArray(data) ? data : (data?.results || []);
        setCategories(list);
        if (list.length > 0) setFormData(prev => ({ ...prev, category: list[0].id }));
      } catch (err) {
        console.error("Failed to load categories", err);
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

      const course = await fetchApi("/api/private/studio/courses/", {
        method: "POST",
        body: payload,
      });

      router.push(`/studio/courses/${course.id}/edit`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du cours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090C14] text-white p-6 lg:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/studio/courses" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            <Sparkles className="w-3 h-3" /> Nouveau Contenu
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Créer un nouveau parcours</h1>
          <p className="text-slate-500 font-medium text-lg">Partagez votre expertise avec des milliers d'apprenants.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Titre de la formation</label>
                <input 
                  required name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Ex: Maîtriser Apache Spark pour le Big Data"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Résumé court</label>
                <input 
                  required name="short_description" value={formData.short_description} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Une phrase accrocheuse pour le catalogue..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description complète</label>
                <textarea 
                  required name="description" value={formData.description} onChange={handleChange}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Détaillez le programme, les objectifs et ce que l'apprenant va accomplir..."
                />
              </div>
            </section>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <section className="glass-card p-6 rounded-[32px] border border-white/5 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Paramètres</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white appearance-none focus:outline-none focus:border-indigo-500/50"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Niveau</label>
                  <select 
                    name="level" value={formData.level} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white appearance-none focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Durée (Heures)</label>
                  <input 
                    type="number" name="duration_hours" value={formData.duration_hours} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </section>

            <section className="glass-card p-6 rounded-[32px] border border-white/5 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Image de couverture</h3>
              <div className="relative group aspect-video rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-700 mb-2" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cliquez pour uploader</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} accept="image/*" />
              </div>
            </section>

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-5 rounded-[24px] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Créer le brouillon</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
