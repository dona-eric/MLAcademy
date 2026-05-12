"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Award, Trophy, ChevronRight, Loader2, Star, Download, Target, Zap, CheckCircle2} from "lucide-react";

export default function MyCertificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [pathEnrollments, setPathEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const [paths, certs] = await Promise.all([
          fetchApi("/api/private/learning/my-paths/"),
          fetchApi("/api/private/learning/my-certificates/")
        ]);
        setPathEnrollments(paths || []);
        setCertificates(certs || []);
      } catch (err) {
        console.error("Failed to load certification data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090C14]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 text-white">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Mes Certifications</h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="p-5 rounded-[20px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white space-y-6 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <Trophy className="h-5 w-5 text-indigo-200 relative z-10" />
            <div className="relative z-10">
               <p className="text-4xl font-black">{certificates.length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mt-2">Certificats obtenus</p>
            </div>
         </div>
         <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-6 hover:border-white/20 transition-all">
            <Target className="h-10 w-10 text-slate-500" />
            <div>
               <p className="text-4xl font-black text-white">{pathEnrollments.filter(p => !p.is_completed).length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">En cours</p>
            </div>
         </div>
         <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-6 hover:border-white/20 transition-all">
            <Star className="h-10 w-10 text-amber-500 fill-amber-500/20" />
            <div>
               <p className="text-4xl font-black text-white">{pathEnrollments.length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Cours Inscrits</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        
        {/* Left: Active Paths */}
        <div className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
             <Zap className="h-5 w-5 text-indigo-400" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Parcours Certifiants</h2>
          </div>

          {pathEnrollments.length === 0 ? (
            <div className="p-20 rounded-[48px] bg-white/5 border-2 border-dashed border-white/10 text-center space-y-8">
               <Award className="h-12 w-12 text-slate-800 mx-auto" />
               <div className="space-y-3">
                 <h3 className="text-xl font-bold text-white">Aucun parcours professionnel</h3>
                 <p className="text-sm text-slate-500 max-w-xs mx-auto">Visez l'excellence en vous inscrivant à un parcours complet de certification.</p>
               </div>
               <Link href="/certifications" className="btn-secondary py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Voir les certifications</Link>
            </div>
          ) : (
            <div className="space-y-8">
              {pathEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-24 h-24 rounded-[24px] bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                         <Trophy className="h-10 w-10 text-indigo-400" />
                      </div>
                      <div className="flex-1 space-y-6">
                         <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{enrollment.path_title}</h3>
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{enrollment.path_level }</span>
                               <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{enrollment.progress_percentage}% Complété</span>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000"
                                 style={{ width: `${enrollment.progress_percentage}%` }}
                               />
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  {enrollment.is_certified ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                       <CheckCircle2 className="h-3.5 w-3.5" /> Certifié
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                       {enrollment.can_take_exam ? "Examen disponible" : "En cours d'apprentissage"}
                                    </span>
                                  )}
                               </div>
                               <Link href={`/parcours/${enrollment.path_slug}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:translate-x-2 transition-transform flex items-center gap-2">
                                  Continuer <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Certificates List */}
        <div className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
             <Star className="h-5 w-5 text-amber-500" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Diplômes Obtenus</h2>
          </div>

          {certificates.length === 0 ? (
            <div className="p-12 rounded-[40px] bg-white/5 border border-white/5 text-center space-y-4">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aucun certificat pour le moment</p>
               <p className="text-xs text-slate-500 leading-relaxed">Terminez un cours ou une certification pour voir vos succès ici.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex items-center gap-6 group hover:border-emerald-500/30 transition-all shadow-sm">
                   <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                      <Award className="h-6 w-6" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white truncate">{cert.target_name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{cert.certificate_id}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Score: {cert.final_score}%</span>
                      </div>
                   </div>
                   <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                      <Download className="h-4 w-4" />
                   </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-10 rounded-[40px] bg-gradient-to-br from-slate-900 to-black border border-white/5 text-white space-y-6 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <h4 className="text-2xl font-black leading-tight relative z-10">Partagez vos succès sur LinkedIn</h4>
             <p className="text-sm text-slate-500 leading-relaxed relative z-10">MLAcademy vous permet d'ajouter vos certifications directement à votre profil professionnel en un clic.</p>
             <button className="w-full py-5 rounded-[20px] bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10">
                Lier mon compte LinkedIn
             </button>
          </div>
        </div>

      </div>

    </div>
  );
}
