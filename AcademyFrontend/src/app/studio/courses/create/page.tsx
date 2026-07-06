"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, BookOpen, Clock, 
  Target, Image as ImageIcon, Save, 
  Plus, Trash2, ChevronRight, Check, Loader2
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategoryLoading, setCreatingCategoryLoading] = useState(false);
  
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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategoryLoading(true);
    try {
      const data = await fetchApi("/api/public/courses/categories/", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName.trim(), icon: "📁" }),
      });
      setCategories(prev => [...prev, data]);
      setFormData(prev => ({ ...prev, category: data.id }));
      setNewCategoryName("");
      setIsCreatingCategory(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la catégorie.");
    } finally {
      setCreatingCategoryLoading(false);
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
    <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)] p-6 lg:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-500)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/studio/courses" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--brand-50)] rounded-full border border-[var(--brand-200)] text-[10px] font-black uppercase tracking-widest text-[var(--brand-600)] shadow-sm">
            <Sparkles className="w-3 h-3" /> Nouveau Contenu
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Créer une nouvelle formation</h1>
          <p className="text-[var(--text-secondary)] font-medium text-base">Partagez votre expertise avec des milliers d'apprenants.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-8 border border-[var(--border-subtle)] space-y-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Titre de la formation</label>
                <input 
                  required name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-4 px-6 text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all placeholder:text-[var(--text-tertiary)]"
                  placeholder="Ex: Maîtriser Apache Spark pour le Big Data"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Résumé court</label>
                <input 
                  required name="short_description" value={formData.short_description} onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-6 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all placeholder:text-[var(--text-tertiary)]"
                  placeholder="Une phrase accrocheuse pour le catalogue..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Description complète</label>
                <textarea 
                  required name="description" value={formData.description} onChange={handleChange}
                  rows={8}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-4 px-6 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all placeholder:text-[var(--text-tertiary)]"
                  placeholder="Détaillez le programme, les objectifs et ce que l'apprenant va accomplir..."
                />
              </div>
            </section>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <section className="card p-6 border border-[var(--border-subtle)] space-y-6 shadow-sm">
              <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-4">Paramètres</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Catégorie</label>
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                      className="text-[10px] font-bold text-[var(--brand-600)] hover:text-[var(--brand-700)] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> {isCreatingCategory ? 'Annuler' : 'Nouvelle'}
                    </button>
                  </div>
                  {isCreatingCategory ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nom de la catégorie"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-2 px-3 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={handleCreateCategory}
                        disabled={!newCategoryName.trim() || creatingCategoryLoading}
                        className="bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white p-2 rounded-xl disabled:opacity-50"
                      >
                        {creatingCategoryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <select 
                      name="category" value={formData.category} onChange={handleChange}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all"
                    >
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      ) : (
                        <option value="" disabled>Aucune catégorie disponible</option>
                      )}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Niveau</label>
                  <select 
                    name="level" value={formData.level} onChange={handleChange}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Durée (Heures)</label>
                  <input 
                    type="number" name="duration_hours" value={formData.duration_hours} onChange={handleChange}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="card p-6 border border-[var(--border-subtle)] space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest border-b border-[var(--border-subtle)] pb-4">Image de couverture</h3>
              <div className="relative group aspect-video rounded-xl bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-default)] hover:border-[var(--brand-400)] hover:bg-[var(--brand-50)] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all">
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-[var(--text-tertiary)] group-hover:text-[var(--brand-500)] transition-colors mb-2" />
                    <span className="text-[10px] font-black text-[var(--text-tertiary)] group-hover:text-[var(--brand-600)] uppercase tracking-widest transition-colors">Cliquez pour uploader</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} accept="image/*" />
              </div>
            </section>

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold uppercase tracking-wide">Créer le brouillon</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
