"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, Award, Clock, 
  Target, Image as ImageIcon, Save, 
  Plus, Check, Loader2, ShieldCheck,
  TrendingUp, Globe
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
        const list = Array.isArray(data) ? data : (data?.results || []);
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

      const path = await fetchApi("/api/private/studio/learning-paths/", {
        method: "POST",
        body: payload,
      });

      router.push(`/studio/learning-paths/${path.id}/edit`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du parcours.");
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
          <Link href="/studio" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au Studio
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            <Award className="w-3 h-3" /> Certification Expert
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            Lancer un nouveau <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Parcours Certifiant</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Regroupez plusieurs cours pour créer une expertise reconnue.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-card p-8 rounded-[40px] border border-white/5 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Titre de la Certification</label>
                <input 
                  required name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xl font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                  placeholder="Ex: Data Engineer Professional Certificate"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Promesse courte</label>
                <textarea 
                  required name="short_description" value={formData.short_description} onChange={handleChange}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Ce que l'apprenant sera capable de faire en une phrase..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Programme & Objectifs</label>
                <textarea 
                  required name="description" value={formData.description} onChange={handleChange}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Détaillez les compétences clés, les outils enseignés et le projet Capstone final..."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="glass-card p-6 rounded-[32px] border border-white/5 space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Paramètres
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white appearance-none"
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Niveau Cible</label>
                  <select 
                    name="level" value={formData.level} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white appearance-none"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                    <option value="professional">Professionnel</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Durée (Semaines)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="number" name="estimated_weeks" value={formData.estimated_weeks} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-card p-6 rounded-[32px] border border-white/5 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Branding du Parcours</h3>
              <div className="relative aspect-video rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500/50 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-800 mb-2" />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Image de couverture</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} accept="image/*" />
              </div>
            </section>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-5 rounded-[24px] shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 group transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Lancer le parcours</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
