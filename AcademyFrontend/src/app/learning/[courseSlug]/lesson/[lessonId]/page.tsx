"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  PlayCircle,
  FileText,
  Code2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Lock,
  StickyNote,
  Loader2,
  Check
} from "lucide-react";
import QuizView from "@/components/learning/QuizView";
import CodeSandbox from "@/components/learning/CodeSandbox";
import MuxVideoPlayer from "@/components/learning/MuxVideoPlayer";
import LessonNotes from "@/components/learning/LessonNotes";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { courseSlug, lessonId } = params;
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'practice' | 'quiz' | 'notes'>('content');
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        const cData = await fetchApi(`/api/public/courses/${courseSlug}/`);
        setCourse(cData);
        if (lessonId) {
          const lData = await fetchApi(`/api/lessons/${lessonId}/`);
          setLesson(lData);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseSlug, lessonId, user, authLoading, router]);

  const { prevLesson, nextLesson } = useMemo(() => {
    if (!course || !lessonId) return { prevLesson: null, nextLesson: null };

    const allLessons: any[] = [];
    course.modules?.forEach((mod: any) => {
      mod.lessons?.forEach((les: any) => {
        allLessons.push(les);
      });
    });

    const currentIndex = allLessons.findIndex((l) => l.id.toString() === lessonId);
    return {
      prevLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  }, [course, lessonId]);

  const handleComplete = async () => {
    if (lesson?.is_completed) return;
    setCompleting(true);
    try {
      await fetchApi(`/api/lessons/${lessonId}/complete/`, { method: 'POST' });
      const lData = await fetchApi(`/api/lessons/${lessonId}/`);
      setLesson(lData);

      // Update the lesson status in the sidebar (course object) as well
      if (course) {
        const updatedModules = course.modules.map((mod: any) => {
          return {
            ...mod,
            lessons: mod.lessons.map((l: any) => {
              if (l.id.toString() === lessonId) return { ...l, is_completed: true };
              return l;
            })
          };
        });
        setCourse({ ...course, modules: updatedModules });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Chargement de la classe...</p>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500 font-medium text-lg">Leçon introuvable.</p>
        <Link href={`/parcours/${courseSlug}`} className="text-indigo-600 font-semibold hover:underline">
          Retourner au cours
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'content', label: 'Vidéo & Cours', icon: PlayCircle },
    { id: 'practice', label: 'Pratique (Code)', icon: Code2 },
    { id: 'quiz', label: 'Évaluation', icon: FileText },
    { id: 'notes', label: 'Notes perso', icon: StickyNote },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Curriculum Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-80 bg-white border-r border-slate-200 shadow-sm z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Course Header in Sidebar */}
        <div className="p-6 border-b border-slate-100 flex flex-col shrink-0">
          <div className="flex items-center justify-between mb-3">
            <Link href={`/parcours/${courseSlug}`} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Retour
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">{course.title}</h2>
        </div>

        {/* Modules & Lessons List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50/50">
          {course.modules?.map((mod: any, mIdx: number) => (
            <div key={mod.id}>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
                Module {mIdx + 1}: {mod.title}
              </h3>
              <div className="space-y-1.5">
                {mod.lessons?.map((les: any) => {
                  const isActive = les.id.toString() === lessonId;
                  const isCompleted = les.is_completed;

                  return (
                    <Link
                      key={les.id}
                      href={`/learning/${courseSlug}/lesson/${les.id}`}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border ${
                         isActive 
                           ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                      }`}
                >
                      <div className="mt-0.5 shrink-0 flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                             <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                        ) : (
                          <PlayCircle className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-semibold leading-tight line-clamp-2 ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {les.title}
                      </span>
                    </Link>
              );
                })}
            </div>
            </div>
          ))}
    </div>
      </aside >

    <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">

      {/* Topbar */}
      <header className="h-[72px] shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-md transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 line-clamp-1">{lesson.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleComplete}
            disabled={completing || lesson?.is_completed}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 border shadow-sm ${
                 lesson?.is_completed
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 hover:shadow-md'
              }`}
            >
          {lesson?.is_completed ? <CheckCircle2 className="w-4 h-4" /> : (completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />)}
          {lesson?.is_completed ? 'Terminé' : 'Valider'}
        </button>
      </div>
    </header>

  {/* Tab Navigation (Desktop & Mobile) */ }
  <div className="bg-white border-b border-slate-200 shrink-0 z-10 px-4 sm:px-8 overflow-x-auto custom-scrollbar">
    <div className="flex items-center gap-2 sm:gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-2 py-4 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap px-2 sm:px-0 ${
                    activeTab === tab.id
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                 }`}
               >
      <tab.icon className="w-4 h-4" />
      {tab.label}
    </button>
             ))}
  </div>
        </div >

    {/* Content Area */ }
    < div className = "flex-1 overflow-y-auto custom-scrollbar relative" >

      { activeTab === 'content' && (
        <div className="p-4 sm:p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Video Player */}
            {(lesson.video_url || lesson.mux_playback_id) ? (
              <div className="bg-black rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xl border border-slate-200/50">
                <MuxVideoPlayer
                  playerRef={playerRef}
                  playbackId={lesson.mux_playback_id || "qxb01yV02npx9S019401v2K9870102L6n01q"} // Fallback test ID
                  metadata={{
                    video_id: lesson.id.toString(),
                    video_title: lesson.title,
                    viewer_user_id: user?.id?.toString() || ""
                  }}
                  onTimeUpdate={(time) => setCurrentTime(time)}
                  onEnded={handleComplete}
                />
              </div>
            ) : (
              <div className="aspect-video bg-white rounded-2xl sm:rounded-[32px] flex flex-col items-center justify-center shadow-sm border border-slate-200">
                <FileText className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-500 font-semibold text-lg">Contenu textuel uniquement</p>
              </div>
            )}

            {/* Markdown Content */}
            <div className="bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                {lesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 italic">Le contenu textuel de cette leçon n'est pas encore disponible.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
}

{
  activeTab === 'practice' && (
    <div className="h-full p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-white h-full rounded-2xl sm:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <CodeSandbox lessonId={lesson.id} />
      </div>
    </div>
  )
}

{
  activeTab === 'quiz' && (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] border border-slate-200 shadow-sm">
          <QuizView lessonId={lesson.id} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}

{
  activeTab === 'notes' && (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-3xl mx-auto h-full min-h-[500px]">
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] border border-slate-200 shadow-sm h-full flex flex-col">
          <LessonNotes
            lessonId={lesson.id}
            currentTime={currentTime}
            onSeek={(time) => {
              if (playerRef.current) {
                playerRef.current.currentTime = time;
                setActiveTab('content');
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

        </div >

  {/* Bottom Navigation */ }
  < footer className = "h-20 shrink-0 bg-white border-t border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10" >
  {
    prevLesson?(
            <Link 
              href={`/learning/${courseSlug}/lesson/${prevLesson.id}`}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors px-5 py-2.5 rounded-xl hover:bg-slate-100 font-semibold text-sm"
        >
        <ChevronLeft className="w-5 h-5" />
              Précédent
            </Link>
          ) : <div />}

{
  nextLesson && (
    <button
      onClick={() => {
        if (lesson.is_completed) {
          router.push(`/learning/${courseSlug}/lesson/${nextLesson.id}`);
        }
      }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all border shadow-sm ${
                 lesson.is_completed 
                   ? 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 hover:shadow-md' 
                   : 'bg-white border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
} `}
  >
  Suivant
{ lesson.is_completed ? <ChevronRight className="w-5 h-5" /> : <Lock className="w-4 h-4 ml-1" /> }
            </button >
          )}
        </footer >

      </main >
    </div >
  );
}
