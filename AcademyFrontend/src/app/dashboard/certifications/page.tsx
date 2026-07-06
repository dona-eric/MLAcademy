"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Award, Trophy, Loader2, Star, Download, Target, Zap, CheckCircle2, ChevronRight } from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)]">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-500)]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-secondary)] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-50)] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-60"></div>
      
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 relative z-10 text-[var(--text-primary)]">
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Mes <span className="text-[var(--brand-500)]">Certifications</span>
          </h1>
        </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="card p-6 bg-[var(--brand-500)] text-white space-y-4 shadow-md relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <Trophy className="h-5 w-5 text-[var(--brand-100)] relative z-10" />
            <div className="relative z-10">
               <p className="text-3xl font-black">{certificates.length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-100)] mt-1">Certificats obtenus</p>
            </div>
         </div>
         <div className="card p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-default)]">
               <Target className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <div>
               <p className="text-3xl font-black text-[var(--text-primary)]">{pathEnrollments.filter(p => !p.is_completed).length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1">En cours</p>
            </div>
         </div>
         <div className="card p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="h-10 w-10 rounded-xl bg-[var(--warning-light)] flex items-center justify-center border border-amber-200">
               <Star className="h-5 w-5 text-[var(--warning)] fill-amber-100" />
            </div>
            <div>
               <p className="text-3xl font-black text-[var(--text-primary)]">{pathEnrollments.length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1">Cours Inscrits</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* Left: Active Paths */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
             <Zap className="h-4 w-4 text-[var(--brand-500)]" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Parcours Certifiants</h2>
          </div>

          {pathEnrollments.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[var(--bg-primary)] border border-dashed border-[var(--border-default)] text-center space-y-4">
               <div className="h-12 w-12 mx-auto rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)]">
                 <Award className="h-6 w-6 text-[var(--text-tertiary)]" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-base font-bold text-[var(--text-primary)]">Aucun parcours professionnel</h3>
                 <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">Visez l'excellence en vous inscrivant à un parcours complet de certification.</p>
               </div>
               <Link href="/certifications" className="btn-secondary py-2 px-6 text-[10px] inline-block font-bold">Voir les certifications</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pathEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="card p-6 hover:border-[var(--brand-300)] transition-all group">
                   <div className="flex flex-col md:flex-row gap-5">
                      <div className="w-16 h-16 rounded-xl bg-[var(--brand-50)] flex items-center justify-center shrink-0 border border-[var(--brand-100)]">
                         <Trophy className="h-6 w-6 text-[var(--brand-500)]" />
                      </div>
                      <div className="flex-1 space-y-4">
                         <div className="space-y-1">
                            <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors leading-tight">{enrollment.path_title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{enrollment.path_level || 'Niveau Standard'}</span>
                               <span className="w-1 h-1 rounded-full bg-[var(--border-default)]"></span>
                               <span className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-500)]">{enrollment.progress_percentage}% Complété</span>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <div className="progress-bar-container">
                               <div 
                                 className="progress-bar-fill"
                                 style={{ width: `${enrollment.progress_percentage}%` }}
                               />
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  {enrollment.is_certified ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[var(--success)] uppercase tracking-widest">
                                       <CheckCircle2 className="h-3.5 w-3.5" /> Certifié
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                                       {enrollment.can_take_exam ? "Examen disponible" : "En cours d'apprentissage"}
                                    </span>
                                  )}
                               </div>
                               <Link href={`/parcours/${enrollment.path_slug}`} className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-500)] hover:underline flex items-center gap-1">
                                  Continuer <ChevronRight className="h-3 w-3" />
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
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
             <Star className="h-4 w-4 text-[var(--warning)]" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Diplômes Obtenus</h2>
          </div>

          {certificates.length === 0 ? (
            <div className="card-flat p-10 text-center space-y-3">
               <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Aucun certificat pour le moment</p>
               <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Terminez un cours ou une certification pour voir vos succès ici.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="card p-5 flex items-center gap-5 group hover:border-[var(--success-300)] transition-all">
                   <div className="h-10 w-10 rounded-lg bg-[var(--success-light)] flex items-center justify-center text-[var(--success)] shrink-0 border border-emerald-200">
                      <Award className="h-5 w-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{cert.target_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{cert.certificate_id}</span>
                         <span className="w-1 h-1 rounded-full bg-[var(--border-default)]"></span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--success)]">Score: {cert.final_score}%</span>
                      </div>
                   </div>
                   <button className="h-9 w-9 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all border border-[var(--border-default)]">
                      <Download className="h-4 w-4" />
                   </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[var(--brand-50)] border border-[var(--brand-100)] text-[var(--text-primary)] space-y-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <h4 className="text-lg font-black leading-tight relative z-10 text-[var(--text-primary)]">
               Partagez vos succès sur LinkedIn
             </h4>
             <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed relative z-10">MLAcademy vous permet d'ajouter vos certifications directement à votre profil professionnel en un clic.</p>
             <button className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 border border-[var(--border-default)] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 shadow-sm text-[var(--text-primary)] hover:text-[#0A66C2]">
                Lier mon compte LinkedIn
             </button>
          </div>
        </div>

      </div>

    </div>
    </div>
  );
}
