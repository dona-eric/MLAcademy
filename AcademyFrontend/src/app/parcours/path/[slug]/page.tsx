"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Play, Clock, Star, CheckCircle2, BookOpen, Users, ArrowLeft, ChevronRight, Lock, Loader2, Award, Shield } from "lucide-react";
import CourseImage from "@/components/learning/CourseImage";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export default function LearningPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();

  const [path, setPath] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const pathData = await fetchApi(`/api/public/courses/paths/${slug}/`);
        setPath(pathData);

        if (user) {
          const myPaths = await fetchApi("/api/private/learning/my-paths/");
          const isUserEnrolled = myPaths?.some((p: any) => p.path_slug === slug);
          setIsEnrolled(isUserEnrolled);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await fetchApi(`/api/private/learning/enroll-path/${slug}/`, { method: 'POST' });
      setIsEnrolled(true);
      
      // Refresh path count
      const updated = await fetchApi(`/api/public/courses/paths/${slug}/`);
      setPath(updated);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription au parcours.');
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

  if (!path) {
    return (
      <div className="min-h-screen bg-[#090C14] text-white flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden">
        <div className="glow-extremity-top"></div>
        <div className="glow-extremity-bottom"></div>
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-10 animate-pulse">
          <Award className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10 font-sans">Parcours Introuvable</h1>
        <p className="text-slate-400 font-medium relative z-10">Le parcours certifiant que vous recherchez n'existe pas ou plus.</p>
        <Link href="/parcours" className="btn-primary relative z-10 py-3 px-8 text-sm shadow-xl shadow-indigo-500/20">
          Retour aux parcours
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090C14] pb-20 text-white animate-in fade-in duration-700 relative overflow-hidden">
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      {/* Course Hero - Premium Style */}
      <section className="relative pt-32 pb-24 border-b border-white/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#6366F1_0%,_transparent_50%)] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <Link href="/parcours" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Tous les parcours
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                {path.category && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{path.category.name}</span>
                  </div>
                )}
                {path.is_certifying && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Certifiant</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {path.title}
              </h1>

              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                {path.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold">{parseFloat(path.avg_rating || "5.0").toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium text-sm">{path.enrolled_count}+ inscrits</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium text-sm">{path.courses_count} cours inclus</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium text-sm">{path.estimated_weeks} semaines estimées</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-[60px] rounded-full"></div>
              <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white/10">
                <CourseImage
                  src={path.thumbnail}
                  title={path.title}
                  categoryName={path.category?.name}
                  isPath={true}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar */}
      <section className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">À propos de ce parcours</h2>
              <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed font-medium">
                {path.description ? (
                  <div dangerouslySetInnerHTML={{ __html: path.description }} />
                ) : (
                  <p>Aucune description détaillée n'est disponible pour ce parcours pour le moment.</p>
                )}
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-extrabold text-white">Programme du parcours</h2>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              {path.courses && path.courses.length > 0 ? (
                <div className="space-y-6">
                  {path.courses.map((pc: any, index: number) => (
                    <div key={pc.id} className="bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/20 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-extrabold text-2xl shrink-0 border border-indigo-500/20">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{pc.course_title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <span>{LEVEL_LABELS[pc.course_level]}</span>
                            <span>•</span>
                            <span>{pc.course_duration}h de cours</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/parcours/${pc.course_slug}`}
                        className="bg-white/5 border border-white/10 hover:border-indigo-500/30 text-indigo-400 hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all self-stretch md:self-auto text-center"
                      >
                        Voir le cours
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-[32px] p-12 text-center border border-dashed border-white/10">
                  <p className="text-slate-500 font-medium">Les cours de ce parcours sont en cours d'organisation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white/5 rounded-[48px] border border-white/5 shadow-2xl p-10 space-y-8 backdrop-blur-xl">
              {error && (
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-xs font-bold text-center border border-red-500/20 animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accès parcours</p>
                {path.is_free ? (
                  <div className="text-4xl font-black text-white">Gratuit</div>
                ) : (
                  <div className="text-4xl font-black text-white">Premium</div>
                )}
              </div>

              {isEnrolled ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xs font-bold border border-emerald-500/20">
                    Vous êtes inscrit à ce parcours !
                  </div>
                  <Link href="/dashboard/certifications" className="btn-primary w-full py-5 text-sm uppercase tracking-widest block text-center">
                    Accéder à mon espace
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || authLoading}
                  className="btn-primary w-full py-5 text-sm uppercase tracking-widest group bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 shadow-xl shadow-indigo-500/20"
                >
                  {enrolling ? "Inscription..." : (
                    <span className="flex items-center justify-center gap-2">
                      S'inscrire au parcours <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              )}

              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Inclus dans le parcours :</p>
                {[
                  "Accès complet aux cours du parcours",
                  "Progression globale unifiée",
                  "Workspace notebook interactif",
                  "Certification officielle de fin d'étude",
                  "Accès au forum d'entraide MLAcademy"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-400">{item}</span>
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
