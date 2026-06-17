"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, BookOpen, Clock, 
  Settings, Layout, Video, FileText, 
  Plus, Save, ChevronRight, GripVertical,
  MoreVertical, Edit3, Trash2, Globe, Eye,
  Loader2, CheckCircle2, AlertCircle
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("curriculum"); // curriculum, settings, details
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseData, catData] = await Promise.all([
          fetchApi(`/api/private/studio/courses/${id}/`),
          fetchApi("/api/public/courses/categories/")
        ]);
        setCourse(courseData);
        setCategories(Array.isArray(catData) ? catData : (catData?.results || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await fetchApi(`/api/private/studio/courses/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          title: course.title,
          short_description: course.short_description,
          description: course.description,
          category: course.category,
          level: course.level,
          price: course.price,
          is_published: course.is_published,
        }),
      });
      alert("Modifications enregistrées !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", lesson_type: "video", video_url: "", content: "", order: 1 });

  const handleAddModule = async () => {
    try {
      const newModule = await fetchApi("/api/private/studio/modules/", {
        method: "POST",
        body: JSON.stringify({ ...moduleForm, course: course.id }),
      });
      // Link module to course (table junction if needed, but here Course has Module)
      // Actually, my model says CourseModule is the link.
      await fetchApi(`/api/private/studio/courses/${id}/add-module/`, {
        method: "POST",
        body: JSON.stringify({ module_id: newModule.id }),
      });
      
      setCourse({ ...course, modules: [...course.modules, { ...newModule, lessons: [] }] });
      setIsModuleModalOpen(false);
      setModuleForm({ title: "", description: "" });
    } catch (err) { console.error(err); }
  };

  const handleAddLesson = async () => {
    try {
      const newLesson = await fetchApi("/api/private/studio/lessons/", {
        method: "POST",
        body: JSON.stringify({ ...lessonForm, module: currentModuleId }),
      });
      
      const updatedModules = course.modules.map((m: any) => {
        if (m.id === currentModuleId) {
          return { ...m, lessons: [...m.lessons, newLesson] };
        }
        return m;
      });
      
      setCourse({ ...course, modules: updatedModules });
      setIsLessonModalOpen(false);
      setLessonForm({ title: "", lesson_type: "video", video_url: "", content: "", order: 1 });
    } catch (err) { console.error(err); }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Supprimer ce module et toutes ses leçons ?")) return;
    try {
      await fetchApi(`/api/private/studio/modules/${moduleId}/`, { method: "DELETE" });
      setCourse({ ...course, modules: course.modules.filter((m: any) => m.id !== moduleId) });
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090C14] text-white flex flex-col">
      
      {/* Modals */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-md p-8 rounded-[32px] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold">Nouveau Module</h3>
            <div className="space-y-4">
              <input 
                placeholder="Titre du module" value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
              />
              <textarea 
                placeholder="Description (optionnelle)" value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-xs font-bold">Annuler</button>
              <button onClick={handleAddModule} className="flex-1 py-3 rounded-xl bg-indigo-500 text-xs font-bold">Créer</button>
            </div>
          </div>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-lg p-8 rounded-[32px] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold">Nouvelle Leçon</h3>
            <div className="space-y-4">
              <input 
                placeholder="Titre de la leçon" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
              />
              <select 
                value={lessonForm.lesson_type} onChange={e => setLessonForm({...lessonForm, lesson_type: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
              >
                <option value="video">Vidéo</option>
                <option value="text">Texte / Lecture</option>
                <option value="notebook">Notebook</option>
                <option value="quiz">Quiz</option>
              </select>
              {lessonForm.lesson_type === 'video' ? (
                <input 
                  placeholder="URL de la vidéo (Mux/Vimeo)" value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
                />
              ) : (
                <textarea 
                  placeholder="Contenu Markdown" value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})}
                  rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
                />
              )
              }
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-xs font-bold">Annuler</button>
              <button onClick={handleAddLesson} className="flex-1 py-3 rounded-xl bg-indigo-500 text-xs font-bold">Ajouter</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Header Bar */}
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#090C14]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <Link href="/studio/courses" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="font-black tracking-tight">{course.title}</h1>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${course.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-white/10'}`}>
                {course.is_published ? "En ligne" : "Brouillon"}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">ID: {course.id} • Dernière mise à jour: {new Date(course.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/parcours/${course.slug}`} className="btn-secondary px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs">
            <Eye className="w-4 h-4" /> Voir l'aperçu
          </Link>
          <button 
            onClick={handleSaveGeneral}
            disabled={saving}
            className="btn-primary px-8 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-indigo-500/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar Menu */}
        <aside className="w-64 border-r border-white/5 p-6 space-y-2 hidden lg:block">
           {[
             { id: "details", label: "Infos Générales", icon: Layout },
             { id: "curriculum", label: "Curriculum", icon: BookOpen },
             { id: "projects", label: "Projets & Quiz", icon: FileText },
             { id: "pricing", label: "Tarification", icon: Settings },
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
             >
               <item.icon className="w-4 h-4" />
               {item.label}
             </button>
           ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto">
          
          {activeTab === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Titre</label>
                       <input 
                         value={course.title} onChange={e => setCourse({...course, title: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                       <select 
                         value={course.category} onChange={e => setCourse({...course, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white appearance-none"
                       >
                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description complète</label>
                    <textarea 
                      value={course.description} onChange={e => setCourse({...course, description: e.target.value})}
                      rows={10} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/50" 
                    />
                  </div>
               </section>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight">Plan du cours</h2>
                <button 
                  onClick={() => setIsModuleModalOpen(true)}
                  className="btn-primary px-6 py-2 rounded-xl text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Nouveau Module
                </button>
              </div>

              <div className="space-y-6">
                {course.modules?.length === 0 ? (
                  <div className="glass-card p-12 rounded-[32px] border border-dashed border-white/10 text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-slate-800 mx-auto" />
                    <p className="text-slate-500 font-medium">Votre curriculum est vide. Commencez par ajouter un module thématique.</p>
                  </div>
                ) : (
                  course.modules.map((module: any, idx: number) => (
                    <div key={module.id} className="glass-card rounded-[32px] border border-white/5 overflow-hidden">
                      <div className="p-6 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <GripVertical className="w-4 h-4 text-slate-700 cursor-grab" />
                          <div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Module {idx + 1}</span>
                            <h3 className="font-bold text-white">{module.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                           <button 
                             onClick={() => handleDeleteModule(module.id)}
                             className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-slate-700 hover:text-rose-500"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        {module.lessons?.map((lesson: any, lidx: number) => (
                          <div key={lesson.id} className="bg-[#090C14] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                             <div className="flex items-center gap-4">
                               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                  {lesson.lesson_type === 'video' ? <Video className="w-4 h-4 text-cyan-400" /> : <FileText className="w-4 h-4 text-emerald-400" />}
                               </div>
                               <span className="text-xs font-bold text-slate-300">Leçon {lidx + 1}: {lesson.title}</span>
                             </div>
                             <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest">Modifier</button>
                               <button className="p-1 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5 text-slate-700 hover:text-rose-500" /></button>
                             </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => { setCurrentModuleId(module.id); setIsLessonModalOpen(true); }}
                          className="w-full py-4 border border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-[0.2em] transition-all"
                        >
                          + Ajouter une leçon
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <section className="glass-card p-8 rounded-[32px] border border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-bold">Modèle de revenus</h3>
                        <p className="text-sm text-slate-500 font-medium">Définissez comment vous souhaitez monétiser ce contenu.</p>
                     </div>
                     <div className="flex items-center gap-3 p-1 bg-white/5 rounded-xl border border-white/10">
                        <button 
                          onClick={() => setCourse({...course, is_free: true})}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${course.is_free ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                          Gratuit
                        </button>
                        <button 
                          onClick={() => setCourse({...course, is_free: false})}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!course.is_free ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                          Payant
                        </button>
                     </div>
                  </div>

                  {!course.is_free && (
                    <div className="space-y-2 pt-6 border-t border-white/5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prix de vente (FCFA)</label>
                      <div className="relative">
                        <input 
                          type="number" value={course.price} onChange={e => setCourse({...course, price: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white focus:outline-none focus:border-indigo-500/50" 
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-600">CFA</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium pt-2">Note: MLAcademy prélève une commission de 20% sur chaque vente.</p>
                    </div>
                  )}

                  <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h3 className="text-lg font-bold">Visibilité</h3>
                          <p className="text-sm text-slate-500 font-medium">Rendre le cours accessible aux étudiants.</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${course.is_published ? 'text-emerald-400' : 'text-slate-500'}`}>
                             {course.is_published ? "Publié" : "Masqué"}
                          </span>
                          <button 
                            onClick={() => setCourse({...course, is_published: !course.is_published})}
                            className={`w-12 h-6 rounded-full relative transition-all ${course.is_published ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          >
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${course.is_published ? 'right-1' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                  </div>
               </section>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
