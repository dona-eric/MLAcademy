"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Play, Clock, Star, CheckCircle2, BookOpen, Users, ArrowLeft, ChevronRight, Lock, Loader2, Award } from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";

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
        const data = await fetchApi(`/api/public/courses/${slug}/`);
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
      await fetchApi(`/api/private/learning/enroll/${slug}/`, { method: 'POST' });
      const updated = await fetchApi(`/api/public/courses/${slug}/`);
      setCourse(updated);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090C14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#090C14] text-white flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden">
        <div className="glow-extremity-top"></div>
        <div className="glow-extremity-bottom"></div>
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-10 animate-pulse">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10">Parcours Introuvable</h1>
        <p className="text-slate-400 font-medium relative z-10">Le parcours que vous recherchez n'existe pas ou plus.</p>
        <Link href="/parcours" className="btn-primary relative z-10 py-3 px-8 text-sm shadow-xl shadow-indigo-500/20">
          Retour aux parcours
        </Link>
      </div>
    );
  }

  const isEnrolled = course.is_enrolled;

  return (
    <div className="min-h-screen bg-[#090C14] pb-20 text-white animate-in fade-in duration-700 relative overflow-hidden">
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      {/* Course Hero - Premium Style */}
      <section className="relative pt-32 pb-24 border-b border-white/5 bg-[#090C14]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#6366F1_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_#00D1FF_0%,_transparent_40%)] opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <Link href="/parcours" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Tous les parcours
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {course.category && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{course.category.name}</span>
                </div>
              )}

              <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                {course.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold">{parseFloat(course.avg_rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium text-sm">250+ inscrits</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium text-sm">{course.duration_hours}h de contenu</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-[60px] rounded-full"></div>
              <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white/10">
                <CourseImage
                  src={course.thumbnail}
                  title={course.title}
                  categoryName={course.category?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar */}
      <section className="container mx-auto px-6 py-20 max-w-7xl z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">À propos de ce parcours</h2>
              <div className="text-slate-400 text-sm font-medium leading-relaxed space-y-4">
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
                <h2 className="text-2xl font-bold text-white tracking-tight">Programme détaillé</h2>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-6">
                  {course.modules.map((mod: any, index: number) => (
                    <div key={mod.id} className="glass-card border border-white/5 rounded-[32px] p-8 hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-indigo-400">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{mod.title}</h3>
                          <p className="text-sm font-medium text-slate-500">{mod.lessons?.length || 0} leçons</p>
                        </div>
                      </div>

                      <div className="space-y-2 pl-0 md:pl-20">
                        {mod.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                              {isEnrolled ? (
                                <Play className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-500" />
                              )}
                              <span className="font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors text-sm">{lesson.title}</span>
                            </div>
                            {isEnrolled && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors">Accéder</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-[32px] p-12 text-center border border-dashed border-white/10">
                  <p className="text-slate-500 font-medium">Le programme est en cours de création. Revenez bientôt !</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 glass-card bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[48px] shadow-2xl p-10 space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investissement</p>
                {course.is_free ? (
                  <div className="text-4xl font-black text-white">Gratuit</div>
                ) : (
                  <div className="text-4xl font-black text-white">Premium</div>
                )}
              </div>

              {isEnrolled ? (
                <Link href={`/learning/${course.slug}/lesson/${course.modules?.[0]?.lessons?.[0]?.id || ''}`} className="btn btn-primary w-full py-5 text-base shadow-xl shadow-indigo-500/20 block text-center">
                  Continuer l'apprentissage
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || authLoading}
                  className="btn btn-primary w-full py-5 text-base shadow-xl shadow-indigo-500/20 group"
                >
                  {enrolling ? "Inscription..." : (
                    <span className="flex items-center justify-center gap-2">
                      S'inscrire maintenant <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              )}

              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Ce que vous obtenez :</p>
                {[
                  "Accès illimité au contenu",
                  "Environnement de code interactif",
                  "Projets réels et datasets",
                  "Certificat de réussite",
                  "Accès à la communauté"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-medium text-slate-300">{item}</span>
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
