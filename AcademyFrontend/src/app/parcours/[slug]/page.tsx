"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { 
  Play, 
  Clock, 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Lock
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchApi(`/api/courses/${slug}/`);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await fetchApi(`/api/courses/${course.id}/enroll/`, { method: 'POST' });
      const updated = await fetchApi(`/api/courses/${slug}/`);
      setCourse(updated);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-[#0A192F] font-georgia">Parcours Introuvable</h1>
        <p className="text-gray-500 font-medium">Le parcours que vous recherchez n'existe pas ou plus.</p>
        <Link href="/parcours" className="btn btn-primary">Retour aux parcours</Link>
      </div>
    );
  }

  const isEnrolled = course.is_enrolled;

  return (
    <div className="min-h-screen bg-white pb-20 animate-in fade-in duration-700">
      {/* Course Hero - Premium Style */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#0A192F]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#00D1FF_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_#FFB800_0%,_transparent_50%)] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/parcours" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Tous les parcours
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {course.category && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest">{course.category.name}</span>
                </div>
              )}
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight font-georgia leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">
                {course.short_description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
                  <span className="font-bold">{parseFloat(course.avg_rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-5 h-5" />
                  <span className="font-medium text-sm">250+ inscrits</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium text-sm">{course.duration_hours}h de contenu</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00D1FF]/20 to-[#FFB800]/20 blur-[60px] rounded-full"></div>
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="relative w-full aspect-[4/3] object-cover rounded-[48px] shadow-2xl border border-white/10" />
              ) : (
                <div className="relative w-full aspect-[4/3] bg-[#112240] rounded-[48px] shadow-2xl border border-white/10 flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-white/10" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#0A192F] font-georgia">À propos de ce parcours</h2>
              <div className="prose prose-lg text-gray-500 font-medium leading-relaxed">
                {course.description ? (
                  <div dangerouslySetInnerHTML={{ __html: course.description }} />
                ) : (
                  <p>Aucune description détaillée n'est disponible pour ce parcours pour le moment.</p>
                )}
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-[#0A192F] font-georgia">Programme détaillé</h2>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-6">
                  {course.modules.map((mod: any, index: number) => (
                    <div key={mod.id} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#0A192F]/5 flex items-center justify-center font-georgia text-2xl font-bold text-[#0A192F]">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#0A192F]">{mod.title}</h3>
                          <p className="text-sm font-medium text-gray-500">{mod.lessons?.length || 0} leçons</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pl-20">
                        {mod.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              {isEnrolled ? (
                                <Play className="w-4 h-4 text-[#00D1FF]" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-300" />
                              )}
                              <span className="font-medium text-[#0A192F] group-hover:text-[#00D1FF] transition-colors">{lesson.title}</span>
                            </div>
                            {isEnrolled && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accéder</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-[32px] p-12 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Le programme est en cours de création. Revenez bientôt !</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[48px] border border-gray-100 shadow-2xl p-10 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investissement</p>
                {course.is_free ? (
                  <div className="text-4xl font-bold text-[#0A192F] font-georgia">Gratuit</div>
                ) : (
                  <div className="text-4xl font-bold text-[#0A192F] font-georgia">Premium</div>
                )}
              </div>

              {isEnrolled ? (
                <Link href={`/learning/${course.slug}/lesson/${course.modules?.[0]?.lessons?.[0]?.id || ''}`} className="btn btn-primary w-full py-5 text-base shadow-xl shadow-cyan-100 block text-center">
                  Continuer l'apprentissage
                </Link>
              ) : (
                <button 
                  onClick={handleEnroll} 
                  disabled={enrolling || authLoading}
                  className="btn btn-primary w-full py-5 text-base shadow-xl shadow-cyan-100 group"
                >
                  {enrolling ? "Inscription..." : (
                    <span className="flex items-center justify-center gap-2">
                      S'inscrire maintenant <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              )}

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <p className="text-[10px] font-black text-[#0A192F] uppercase tracking-widest mb-4">Ce que vous obtenez :</p>
                {[
                  "Accès illimité au contenu",
                  "Environnement de code interactif",
                  "Projets réels et datasets",
                  "Certificat de réussite",
                  "Accès à la communauté"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00D1FF]" />
                    <span className="text-sm font-medium text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
