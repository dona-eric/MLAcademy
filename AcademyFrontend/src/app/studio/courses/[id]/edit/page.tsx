"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Sparkles, BookOpen, Clock, 
  Settings, Layout, Video, FileText, 
  Plus, Save, ChevronRight, GripVertical,
  MoreVertical, Edit3, Trash2, Globe, Eye,Loader2, AlertCircle, Check} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("curriculum"); // curriculum, settings, details
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategoryLoading, setCreatingCategoryLoading] = useState(false);

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
  
  const [moduleForm, setModuleForm] = useState<any>({ id: null, title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", lesson_type: "video", content: "", video_url: "", order: 1 });
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<any>({
    id: null, title: "", description: "", instructions: "",
    starter_code: "", solution_code: "", passing_score: 80, is_final: false
  });

  const handleSaveModule = async () => {
    try {
      if (moduleForm.id) {
        // Mode édition
        const updatedModule = await fetchApi(`/api/private/studio/modules/${moduleForm.id}/`, {
          method: "PATCH",
          body: JSON.stringify({ title: moduleForm.title, description: moduleForm.description }),
        });
        setCourse({
          ...course,
          modules: course.modules.map((m: any) => 
            m.id === moduleForm.id ? { ...m, title: updatedModule.title, description: updatedModule.description } : m
          )
        });
      } else {
        // Mode création
        const newModule = await fetchApi("/api/private/studio/modules/", {
          method: "POST",
          body: JSON.stringify({ title: moduleForm.title, description: moduleForm.description, course: course.id }),
        });
        await fetchApi(`/api/private/studio/courses/${id}/add-module/`, {
          method: "POST",
          body: JSON.stringify({ module_id: newModule.id }),
        });
        setCourse({ ...course, modules: [...course.modules, { ...newModule, lessons: [] }] });
      }
      setIsModuleModalOpen(false);
      setModuleForm({ id: null, title: "", description: "" });
    } catch (err) { console.error(err); alert("Erreur lors de l'enregistrement du module"); }
  };

  const handleAddLesson = async () => {
    try {
      if (!currentModuleId) return;
      const payload = { ...lessonForm, module: currentModuleId };
      const data = await fetchApi(`/api/private/studio/lessons/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const updatedModules = course.modules.map((m: any) => {
        if (m.id === currentModuleId) {
          return { ...m, lessons: [...(m.lessons || []), data] };
        }
        return m;
      });
      setCourse({ ...course, modules: updatedModules });
      setIsLessonModalOpen(false);
      setLessonForm({ title: "", lesson_type: "video", content: "", video_url: "", order: 1 });
      setCurrentModuleId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur ajout leçon");
    }
  };

  const handleSaveProject = async () => {
    try {
      if (!currentModuleId) return;
      if (projectForm.id) {
        const data = await fetchApi(`/api/private/studio/projects/${projectForm.id}/`, {
          method: "PATCH",
          body: JSON.stringify(projectForm)
        });
        const updatedModules = course.modules.map((m: any) => m.id === currentModuleId ? { ...m, project: data } : m);
        setCourse({ ...course, modules: updatedModules });
      } else {
        const data = await fetchApi("/api/private/studio/projects/", {
          method: "POST",
          body: JSON.stringify({ ...projectForm, module: currentModuleId })
        });
        const updatedModules = course.modules.map((m: any) => m.id === currentModuleId ? { ...m, project: data } : m);
        setCourse({ ...course, modules: updatedModules });
      }
      setIsProjectModalOpen(false);
      setProjectForm({ id: null, title: "", description: "", instructions: "", starter_code: "", solution_code: "", passing_score: 80, is_final: false });
      setCurrentModuleId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du projet");
    }
  };

  const handleDeleteProject = async (projectId: number, moduleId: number) => {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await fetchApi(`/api/private/studio/projects/${projectId}/`, { method: "DELETE" });
      const updatedModules = course.modules.map((m: any) => m.id === moduleId ? { ...m, project: null } : m);
      setCourse({ ...course, modules: updatedModules });
    } catch (err) { console.error(err); }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategoryLoading(true);
    try {
      const data = await fetchApi("/api/public/courses/categories/", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName.trim(), icon: "📁" }),
      });
      setCategories((prev: any[]) => [...prev, data]);
      setCourse((prev: any) => ({ ...prev, category: data.id }));
      setNewCategoryName("");
      setIsCreatingCategory(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la catégorie.");
    } finally {
      setCreatingCategoryLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Supprimer ce module et toutes ses leçons ?")) return;
    try {
      await fetchApi(`/api/private/studio/modules/${moduleId}/`, { method: "DELETE" });
      setCourse({ ...course, modules: course.modules.filter((m: any) => m.id !== moduleId) });
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-[var(--brand-500)] animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
      <p className="text-[var(--text-secondary)] text-center font-medium">
        Impossible de charger ce cours.<br/>Il a peut-être été supprimé ou votre session a expiré.
      </p>
      <Link href="/studio/courses" className="btn-primary px-6 py-2 rounded-xl text-sm mt-2">
        Retour au Studio
      </Link>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)] text-[var(--text-primary)] flex flex-col">
      
      {/* Modals */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="card w-full max-w-md p-8 shadow-xl border border-[var(--border-default)] space-y-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{moduleForm.id ? "Modifier le Module" : "Nouveau Module"}</h3>
            <div className="space-y-4">
              <input 
                placeholder="Titre du module" value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 outline-none transition-all"
              />
              <textarea 
                placeholder="Description (optionnelle)" value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] text-xs font-bold transition-colors">Annuler</button>
              <button onClick={handleSaveModule} className="flex-1 py-3 rounded-xl btn-primary text-xs font-bold">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="card w-full max-w-lg p-8 shadow-xl border border-[var(--border-default)] space-y-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Nouvelle Leçon</h3>
            <div className="space-y-4">
              <input 
                placeholder="Titre de la leçon" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
              />
              <select 
                value={lessonForm.lesson_type} onChange={e => setLessonForm({...lessonForm, lesson_type: e.target.value})}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
              >
                <option value="video">Vidéo</option>
                <option value="text">Texte / Lecture</option>
                <option value="notebook">Notebook</option>
                <option value="quiz">Quiz</option>
              </select>
              {lessonForm.lesson_type === 'video' ? (
                <input 
                  placeholder="URL de la vidéo (Mux/Vimeo)" value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
                />
              ) : (
                <textarea 
                  placeholder="Contenu Markdown" value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})}
                  rows={5} className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
                />
              )
              }
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-bold">Annuler</button>
              <button onClick={handleAddLesson} className="flex-1 py-3 rounded-xl btn-primary text-xs font-bold">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="card w-full max-w-2xl p-8 shadow-xl border border-[var(--border-default)] space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{projectForm.id ? "Modifier le Projet" : "Nouveau Projet de Fin de Module"}</h3>
            <div className="space-y-4">
              <input 
                placeholder="Titre du projet" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
              />
              <textarea 
                placeholder="Description globale" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                rows={2} className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
              />
              <textarea 
                placeholder="Instructions détaillées (Markdown)" value={projectForm.instructions} onChange={e => setProjectForm({...projectForm, instructions: e.target.value})}
                rows={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm focus:border-[var(--brand-500)] outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Code de démarrage (Optionnel)</label>
                   <textarea 
                     placeholder="def main():\n  pass" value={projectForm.starter_code} onChange={e => setProjectForm({...projectForm, starter_code: e.target.value})}
                     rows={4} className="w-full mt-1 bg-slate-900 text-[var(--brand-50)] font-mono border border-[var(--border-default)] rounded-xl py-3 px-4 text-xs focus:border-[var(--brand-500)] outline-none"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Solution attendue (Optionnel)</label>
                   <textarea 
                     placeholder="def main():\n  print('Hello')" value={projectForm.solution_code} onChange={e => setProjectForm({...projectForm, solution_code: e.target.value})}
                     rows={4} className="w-full mt-1 bg-slate-900 text-emerald-50 font-mono border border-[var(--border-default)] rounded-xl py-3 px-4 text-xs focus:border-[var(--brand-500)] outline-none"
                   />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl">
                 <div>
                   <p className="text-sm font-bold text-[var(--text-primary)]">Projet certifiant</p>
                   <p className="text-xs text-[var(--text-secondary)]">Marquer ce projet comme l'évaluation finale de ce cours.</p>
                 </div>
                 <input 
                   type="checkbox" checked={projectForm.is_final} onChange={e => setProjectForm({...projectForm, is_final: e.target.checked})}
                   className="w-5 h-5 accent-[var(--brand-500)] cursor-pointer"
                 />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-bold transition-colors">Annuler</button>
              <button onClick={handleSaveProject} className="flex-1 py-3 rounded-xl btn-primary text-xs font-bold">Enregistrer le projet</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Header Bar */}
      <header className="h-20 border-b border-[var(--border-subtle)] px-8 flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)]/90 backdrop-blur-xl z-40 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/studio/courses" className="p-2 hover:bg-[var(--brand-50)] hover:text-[var(--brand-500)] rounded-xl transition-colors text-[var(--text-secondary)] border border-transparent hover:border-[var(--brand-200)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="font-black tracking-tight text-lg">{course.title}</h1>
              <span className={`badge ${course.is_published ? 'badge-success' : 'badge-neutral'}`}>
                {course.is_published ? "En ligne" : "Brouillon"}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest">ID: {course.id} • Dernière mise à jour: {new Date(course.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/parcours/${course.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold">
            <Eye className="w-4 h-4" /> Voir l'aperçu
          </Link>
          <button 
            onClick={handleSaveGeneral}
            disabled={saving}
            className="btn-primary px-8 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar Menu */}
        <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-2 hidden lg:block shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
           {[
             { id: "details", label: "Infos Générales", icon: Layout },
             { id: "curriculum", label: "Curriculum", icon: BookOpen },
             { id: "projects", label: "Projets & Quiz", icon: FileText },
             { id: "pricing", label: "Tarification", icon: Settings },
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[var(--brand-50)] text-[var(--brand-600)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
             >
               <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[var(--brand-500)]' : 'text-[var(--text-tertiary)]'}`} />
               {item.label}
             </button>
           ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto">
          
          {activeTab === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <section className="card p-8 border border-[var(--border-subtle)] space-y-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Titre</label>
                       <input 
                         value={course.title} onChange={e => setCourse({...course, title: e.target.value})}
                         className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm font-bold focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 outline-none transition-all" 
                       />
                    </div>
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
                           value={course.category || ""} onChange={e => setCourse({...course, category: e.target.value})}
                           className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm font-bold focus:border-[var(--brand-500)] outline-none transition-all"
                         >
                           <option value="" disabled>Sélectionnez une catégorie</option>
                           {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                         </select>
                       )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Description complète</label>
                    <textarea 
                      value={course.description} onChange={e => setCourse({...course, description: e.target.value})}
                      rows={10} className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-4 px-4 text-sm focus:border-[var(--brand-500)] outline-none transition-all" 
                    />
                  </div>
               </section>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Plan du cours</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Organisez votre contenu en modules et leçons.</p>
                </div>
                <button 
                  onClick={() => {
                    setModuleForm({ id: null, title: "", description: "" });
                    setIsModuleModalOpen(true);
                  }}
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 font-bold"
                >
                  <Plus className="w-4 h-4" /> Nouveau Module
                </button>
              </div>

              <div className="space-y-6">
                {course.modules?.length === 0 ? (
                  <div className="card p-12 border border-dashed border-[var(--border-default)] shadow-none text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-[var(--brand-500)] mx-auto opacity-50" />
                    <p className="text-[var(--text-secondary)] font-medium">Votre curriculum est vide. Commencez par ajouter un module thématique.</p>
                  </div>
                ) : (
                  course.modules.map((module: any, idx: number) => (
                    <div key={module.id} className="card border border-[var(--border-subtle)] overflow-hidden shadow-sm">
                      <div className="p-5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <GripVertical className="w-5 h-5 text-[var(--text-tertiary)] cursor-grab hover:text-[var(--brand-500)] transition-colors" />
                          <div>
                            <span className="text-[10px] font-black text-[var(--brand-600)] uppercase tracking-widest">Module {idx + 1}</span>
                            <h3 className="font-bold text-[var(--text-primary)] text-base">{module.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => {
                               setModuleForm({ id: module.id, title: module.title, description: module.description || "" });
                               setIsModuleModalOpen(true);
                             }}
                             className="p-2 hover:bg-[var(--brand-50)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--brand-500)]"
                           >
                             <Edit3 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleDeleteModule(module.id)}
                             className="p-2 hover:bg-red-50 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-red-600"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2 bg-[var(--bg-primary)]">
                        {module.lessons?.map((lesson: any, lidx: number) => (
                          <div key={lesson.id} className="bg-[var(--bg-primary)] border border-[var(--border-default)] p-3.5 rounded-xl flex items-center justify-between group hover:border-[var(--brand-300)] hover:shadow-sm transition-all">
                             <div className="flex items-center gap-4">
                               <div className="w-9 h-9 rounded-lg bg-[var(--brand-50)] flex items-center justify-center">
                                  {lesson.lesson_type === 'video' ? <Video className="w-4 h-4 text-[var(--brand-500)]" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                               </div>
                               <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Leçon {lidx + 1}: {lesson.title}</span>
                             </div>
                             <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="text-[10px] font-black text-[var(--text-tertiary)] hover:text-[var(--brand-500)] uppercase tracking-widest">Modifier</button>
                               <button className="p-1.5 hover:text-red-500"><Trash2 className="w-4 h-4 text-[var(--text-tertiary)] hover:text-red-500 transition-colors" /></button>
                             </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => { setCurrentModuleId(module.id); setIsLessonModalOpen(true); }}
                          className="w-full py-4 mt-2 border border-dashed border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-[var(--brand-50)] hover:border-[var(--brand-300)] rounded-xl text-[10px] font-black text-[var(--text-tertiary)] hover:text-[var(--brand-600)] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" /> Ajouter une leçon
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Projets & Quiz</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Évaluez vos apprenants avec des projets pratiques ou quiz certifiants.</p>
                </div>
              </div>

              <div className="space-y-6">
                {course.modules?.length === 0 ? (
                  <div className="card p-12 border border-dashed border-[var(--border-default)] shadow-none text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-[var(--brand-500)] mx-auto opacity-50" />
                    <p className="text-[var(--text-secondary)] font-medium">Créez d'abord des modules dans le Curriculum pour y ajouter des projets.</p>
                  </div>
                ) : (
                  course.modules.map((module: any, idx: number) => (
                    <div key={`proj-${module.id}`} className="card border border-[var(--border-subtle)] overflow-hidden shadow-sm">
                      <div className="p-5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-[var(--brand-600)] uppercase tracking-widest">Module {idx + 1}</span>
                          <h3 className="font-bold text-[var(--text-primary)] text-base">{module.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-[var(--bg-primary)] flex flex-col items-center justify-center min-h-[120px]">
                        {module.project ? (
                          <div className="w-full bg-[var(--bg-secondary)] border border-[var(--brand-200)] p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-[var(--brand-100)] flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-[var(--brand-600)]" />
                               </div>
                               <div>
                                 <div className="flex items-center gap-2">
                                   <h4 className="font-bold text-[var(--text-primary)]">{module.project.title}</h4>
                                   {module.project.is_final && <span className="badge badge-success text-[10px]">Certifiant</span>}
                                 </div>
                                 <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">{module.project.description || "Aucune description"}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => {
                                   setCurrentModuleId(module.id);
                                   setProjectForm(module.project);
                                   setIsProjectModalOpen(true);
                                 }}
                                 className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                               >
                                 Modifier
                               </button>
                               <button 
                                 onClick={() => handleDeleteProject(module.project.id, module.id)}
                                 className="p-2.5 rounded-xl border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                            <p className="text-sm text-[var(--text-secondary)]">Aucun projet défini pour ce module.</p>
                            <button 
                              onClick={() => {
                                setCurrentModuleId(module.id);
                                setProjectForm({ id: null, title: "", description: "", instructions: "", starter_code: "", solution_code: "", passing_score: 80, is_final: false });
                                setIsProjectModalOpen(true);
                              }}
                              className="btn-primary px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 font-bold mx-auto"
                            >
                              <Plus className="w-4 h-4" /> Ajouter un projet
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <section className="card p-8 border border-[var(--border-subtle)] space-y-8 shadow-sm">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Modèle de revenus</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">Définissez comment vous souhaitez monétiser ce contenu.</p>
                     </div>
                     <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)]">
                        <button 
                          onClick={() => setCourse({...course, is_free: true})}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${course.is_free ? 'bg-white shadow-sm text-[var(--brand-600)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
                        >
                          Gratuit
                        </button>
                        <button 
                          onClick={() => setCourse({...course, is_free: false})}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${!course.is_free ? 'bg-white shadow-sm text-[var(--brand-600)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
                        >
                          Payant
                        </button>
                     </div>
                  </div>

                  {!course.is_free && (
                    <div className="space-y-3 pt-6 border-t border-[var(--border-subtle)]">
                      <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Prix de vente (FCFA)</label>
                      <div className="relative max-w-md">
                        <input 
                          type="number" value={course.price} onChange={e => setCourse({...course, price: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl py-4 px-6 text-lg font-black focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 outline-none transition-all" 
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[var(--text-tertiary)]">CFA</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium pt-2">Note: MLAcademy prélève une commission de 20% sur chaque vente.</p>
                    </div>
                  )}

                  <div className="pt-8 border-t border-[var(--border-subtle)] space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h3 className="text-lg font-bold text-[var(--text-primary)]">Visibilité</h3>
                          <p className="text-sm text-[var(--text-secondary)] font-medium">Rendre le cours accessible aux étudiants.</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${course.is_published ? 'text-emerald-500' : 'text-[var(--text-tertiary)]'}`}>
                             {course.is_published ? "Publié" : "Masqué"}
                          </span>
                          <button 
                            onClick={() => setCourse({...course, is_published: !course.is_published})}
                            className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${course.is_published ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${course.is_published ? 'right-1' : 'left-1'}`} />
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
