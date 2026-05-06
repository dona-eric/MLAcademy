"use client";

import { useState, useEffect } from "react";
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
  Play
} from "lucide-react";

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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        const cData = await fetchApi(`/api/courses/${courseSlug}/`);
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

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await fetchApi(`/api/lessons/${lessonId}/complete/`, { method: 'POST' });
      // In a real scenario, we might navigate to next lesson or update local state
      // For now, reload lesson state to reflect completion
      const lData = await fetchApi(`/api/lessons/${lessonId}/`);
      setLesson(lData);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson || !course) return <div className="p-10 text-center text-white">Leçon introuvable.</div>;

  return (
    <div className="flex h-screen bg-[#0A192F] overflow-hidden font-inter text-gray-300">
      
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Curriculum Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-80 bg-[#112240] border-r border-white/5 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <Link href={`/parcours/${courseSlug}`} className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest hover:underline mb-1 inline-block">
              <ChevronLeft className="w-3 h-3 inline mr-1" />
              Retour au parcours
            </Link>
            <h2 className="text-white font-bold line-clamp-1">{course.title}</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {course.modules?.map((mod: any, mIdx: number) => (
            <div key={mod.id}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">
                Module {mIdx + 1}: {mod.title}
              </h3>
              <div className="space-y-1">
                {mod.lessons?.map((les: any) => {
                  const isActive = les.id.toString() === lessonId;
                  // For demo purposes, we don't have is_completed in this payload without tracking, but pretend:
                  const isCompleted = false; 
                  
                  return (
                    <Link 
                      key={les.id} 
                      href={`/learning/${courseSlug}/lesson/${les.id}`}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-[#00D1FF]/10 border border-[#00D1FF]/20' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <PlayCircle className={`w-4 h-4 ${isActive ? 'text-[#00D1FF]' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-[#00D1FF]' : 'text-gray-300'}`}>
                        {les.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D1FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        {/* Topbar */}
        <header className="h-16 shrink-0 bg-[#0A192F]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-white font-bold font-georgia line-clamp-1">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleComplete}
              disabled={completing}
              className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {completing ? 'Validation...' : 'Terminer'}
            </button>
          </div>
        </header>

        {/* Player & Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 z-10 relative">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Video Player Placeholder */}
            {lesson.video_url ? (
              <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
                <img src={course.thumbnail || ''} alt="Video poster" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#00D1FF] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_40px_rgba(0,209,255,0.4)]">
                    <Play className="w-8 h-8 text-[#0A192F] ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-[#112240] rounded-3xl flex flex-col items-center justify-center shadow-2xl border border-white/10">
                <FileText className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">Contenu textuel uniquement</p>
              </div>
            )}

            {/* Lesson Content */}
            <div className="bg-[#112240] rounded-[40px] p-10 border border-white/5 shadow-xl">
              <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                {lesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                ) : (
                  <p>Le contenu textuel de cette leçon n'est pas encore disponible.</p>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-bold text-sm">Leçon précédente</span>
              </button>
              <button className="flex items-center gap-2 text-[#00D1FF] hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-[#00D1FF]/10">
                <span className="font-bold text-sm">Leçon suivante</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
