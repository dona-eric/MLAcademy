"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Clock, Settings, Layout,
  Video, FileText, Plus, Save, ChevronRight, GripVertical,
  Edit3, Trash2, Eye, Loader2, Target, ChevronDown, Code, CheckCircle
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

  // Expanded modules state
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [courseData, catData] = await Promise.all([
          fetchApi("/api/private/instructor/courses/${id}/"),
          fetchApi("/api/public/courses/categories/")
        ]);
        setCourse(courseData);
        // Extract array correctly if paginated
        setCategories(Array.isArray(catData) ? catData : (catData.results ?? []));

        // Expand all modules by default
        const initialExpanded: Record<number, boolean> = {};
        if (courseData?.modules) {
          courseData.modules.forEach((m: any) => {
            initialExpanded[m.id] = true;
          });
        }
        setExpandedModules(initialExpanded);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await fetchApi("/api/private/instructor/courses/${id}/", {
        method: "PATCH",
        body: JSON.stringify({
          title: course.title,
          short_description: course.short_description,
          description: course.description,
          category: course.category,
          level: course.level,
          price: course.price,
          is_published: course.is_published,
          is_free: course.is_free,
        }),
      });
      // Minimalist success feedback could be added here
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

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newModule = await fetchApi("/api/private/instructor/modules/", {
        method: "POST",
        body: JSON.stringify({ ...moduleForm, course: course.id }),
      });
      await fetchApi("/api/private/instructor/courses/${id}/add-module/", {
        method: "POST",
        body: JSON.stringify({ module_id: newModule.id }),
      });

      setCourse({ ...course, modules: [...(course.modules || []), { ...newModule, lessons: [] }] });
      setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
      setIsModuleModalOpen(false);
      setModuleForm({ title: "", description: "" });
    } catch (err) { console.error(err); }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLesson = await fetchApi("/api/private/instructor/lessons/", {
        method: "POST",
        body: JSON.stringify({ ...lessonForm, module: currentModuleId }),
      });

      const updatedModules = course.modules.map((m: any) => {
        if (m.id === currentModuleId) {
          return { ...m, lessons: [...(m.lessons || []), newLesson] };
        }
        return m;
      });

      setCourse({ ...course, modules: updatedModules });
      setIsLessonModalOpen(false);
      setLessonForm({ title: "", lesson_type: "video", video_url: "", content: "", order: 1 });
    } catch (err) { console.error(err); }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce module et toutes ses leçons ? Cette action est irréversible.")) return;
    try {
      await fetchApi("/api/private/instructor/modules/${moduleId}/", { method: "DELETE" });
      setCourse({ ...course, modules: course.modules.filter((m: any) => m.id !== moduleId) });
    } catch (err) { console.error(err); }
  };

  const handleDeleteLesson = async (lessonId: number, moduleId: number) => {
    if (!confirm("Voulez-vous supprimer cette leçon ?")) return;
    try {
      await fetchApi("/api/private/instructor/lessons/${lessonId}/", { method: "DELETE" });
      const updatedModules = course.modules.map((m: any) => {
        if (m.id === moduleId) {
          return { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) };
        }
        return m;
      });
      setCourse({ ...course, modules: updatedModules });
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Modals */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddModule} className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900">Nouveau Module</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Titre du module</label>
                <input
                  required autoFocus
                  placeholder="Ex: Introduction au Deep Learning"
                  value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description (optionnelle)</label>
                <textarea
                  placeholder="Ce que les étudiants vont apprendre..."
                  value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                  rows={3} className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Annuler</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Créer le module</button>
            </div>
          </form>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddLesson} className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900">Nouvelle Leçon</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Titre de la leçon</label>
                <input
                  required autoFocus
                  placeholder="Ex: Les réseaux de neurones"
                  value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Type de contenu</label>
                <select
                  value={lessonForm.lesson_type} onChange={e => setLessonForm({ ...lessonForm, lesson_type: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                >
                  <option value="video">Vidéo Mux</option>
                  <option value="text">Texte / Article Markdown</option>
                  <option value="notebook">Exercice de Code (Sandbox)</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              {lessonForm.lesson_type === 'video' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">URL ou Playback ID</label>
                  <input
                    required
                    placeholder="ID de la vidéo Mux..."
                    value={lessonForm.video_url} onChange={e => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contenu de base (Optionnel)</label>
                  <textarea
                    placeholder="Écrivez ici ou utilisez l'éditeur complet plus tard..."
                    value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                    rows={4} className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm custom-scrollbar"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Annuler</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Ajouter la leçon</button>
            </div>
          </form>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-slate-900 tracking-tight truncate max-w-xs">{course.title}</h1>
              <span className={"px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${course.is_published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}"}>
                {course.is_published ? "En ligne" : "Brouillon"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/parcours/${course.slug}"} className="hidden sm:flex px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors shadow-sm items-center gap-2">
            <Eye className="w-4 h-4" /> Aperçu
          </Link>
          <button
            onClick={handleSaveGeneral}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Menu */}
        <aside className="w-64 border-r border-slate-200 bg-white p-6 space-y-2 hidden lg:block overflow-y-auto">
          {[
            { id: "curriculum", label: "Plan du cours", icon: Layout },
            { id: "details", label: "Informations générales", icon: FileText },
            { id: "pricing", label: "Tarification & Accès", icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={"w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto">

            {activeTab === "details" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Informations générales</h2>
                  <p className="text-sm text-slate-500">Définissez l'identité de votre cours pour le catalogue.</p>
                </div>

                <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Titre du cours</label>
                      <input
                        value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Catégorie</label>
                      <select
                        value={course.category} onChange={e => setCourse({ ...course, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
                      >
                        <option value="">Sélectionner...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description Courte</label>
                    <textarea
                      value={course.short_description || ''} onChange={e => setCourse({ ...course, short_description: e.target.value })}
                      rows={2} className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm custom-scrollbar"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Description détaillée</label>
                    <textarea
                      value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })}
                      rows={10} className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm custom-scrollbar"
                    />
                  </div>
                </section>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Plan du cours</h2>
                    <p className="text-sm text-slate-500">Organisez votre contenu en modules et leçons.</p>
                  </div>
                  <button
                    onClick={() => setIsModuleModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Créer un Module
                  </button>
                </div>

                <div className="space-y-4">
                  {(!course.modules || course.modules.length === 0) ? (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center space-y-4 shadow-sm">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="max-w-sm mx-auto">
                        <h3 className="text-base font-semibold text-slate-900">Le curriculum est vide</h3>
                        <p className="text-sm text-slate-500 mt-1">Commencez par ajouter un module thématique, puis ajoutez-y vos vidéos et quiz.</p>
                      </div>
                      <button
                        onClick={() => setIsModuleModalOpen(true)}
                        className="inline-flex mt-2 px-5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Ajouter le premier module
                      </button>
                    </div>
                  ) : (
                    course.modules.map((module: any, idx: number) => {
                      const isExpanded = expandedModules[module.id];
                      return (
                        <div key={module.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                          {/* Module Header */}
                          <div
                            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="cursor-grab p-1 hover:bg-slate-200 rounded text-slate-400" onClick={e => e.stopPropagation()}>
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="flex items-center gap-3">
                                <ChevronDown className={"w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}"} />
                                <div>
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Module {idx + 1}</span>
                                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{module.title}</h3>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <button className="p-2 hover:bg-slate-200 rounded-md transition-colors text-slate-500"><Edit3 className="w-4 h-4" /></button>
                              <button
                                onClick={() => handleDeleteModule(module.id)}
                                className="p-2 hover:bg-red-50 rounded-md transition-colors text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Module Content (Lessons) */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                              <div className="space-y-2 mt-4">
                                {(!module.lessons || module.lessons.length === 0) ? (
                                  <p className="text-xs text-slate-400 italic py-2 text-center">Aucune leçon dans ce module.</p>
                                ) : (
                                  module.lessons.map((lesson: any, lidx: number) => (
                                    <div key={lesson.id} className="bg-white border border-slate-200 p-3 sm:p-4 rounded-lg flex items-center justify-between group hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                                      <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                          {lesson.lesson_type === 'video' && <Video className="w-4 h-4 text-indigo-500" />}
                                          {lesson.lesson_type === 'text' && <FileText className="w-4 h-4 text-emerald-500" />}
                                          {lesson.lesson_type === 'notebook' && <Code className="w-4 h-4 text-orange-500" />}
                                          {lesson.lesson_type === 'quiz' && <CheckCircle className="w-4 h-4 text-rose-500" />}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leçon {lidx + 1}</span>
                                          <span className="text-sm font-semibold text-slate-800">{lesson.title}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">Modifier</button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id, module.id); }}
                                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}

                                {/* Add Lesson Button inside Module */}
                                <div className="pt-2">
                                  <button
                                    onClick={() => { setCurrentModuleId(module.id); setIsLessonModalOpen(true); }}
                                    className="w-full py-3 bg-white border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" /> Ajouter une leçon
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tarification & Visibilité</h2>
                  <p className="text-sm text-slate-500">Configurez l'accès à votre contenu.</p>
                </div>

                <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">Modèle de revenus</h3>
                      <p className="text-xs text-slate-500 font-medium">Définissez comment ce cours sera facturé.</p>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setCourse({ ...course, is_free: true })}
                        className={"px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${course.is_free ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"}
                      >
                        Gratuit
                      </button>
                      <button
                        onClick={() => setCourse({ ...course, is_free: false })}
                        className={"px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${!course.is_free ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"}
                      >
                        Payant
                      </button>
                    </div>
                  </div>

                  {!course.is_free && (
                    <div className="space-y-2 pt-6 border-t border-slate-100">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Prix de vente</label>
                      <div className="relative max-w-sm">
                        <input
                          type="number" value={course.price} onChange={e => setCourse({ ...course, price: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">FCFA</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium pt-1">Note: MLAcademy prélève une commission de 20% sur chaque vente.</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900">Visibilité publique</h3>
                        <p className="text-xs text-slate-500 font-medium">Activez pour rendre le cours visible dans le catalogue public.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={"text-[10px] font-bold uppercase tracking-widest ${course.is_published ? 'text-emerald-600' : 'text-slate-400'}"}>
                          {course.is_published ? "Publié" : "Masqué"}
                        </span>
                        <button
                          onClick={() => setCourse({ ...course, is_published: !course.is_published })}
                          className={"w-11 h-6 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${course.is_published ? 'bg-emerald-500' : 'bg-slate-300'}"}
                        >
                          <div className={"absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${course.is_published ? 'right-1' : 'left-1'}"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
