"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { ShieldAlert, ShieldCheck, Download, Loader2, Award, Calendar, BarChart3, ArrowRight } from "lucide-react";

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = params.id as string;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [typedId, setTypedId] = useState("");

  useEffect(() => {
    async function verifyCertificate() {
      if (!certificateId) return;
      setLoading(true);
      try {
        const data = await fetchApi(`/api/public/certificates/${certificateId}/`);
        setCert(data);
      } catch (err) {
        console.error("Erreur de verification de certificat:", err);
        setCert(null);
      } finally {
        setLoading(false);
      }
    }
    verifyCertificate();
  }, [certificateId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedId.trim()) {
      router.push(`/certifications/${typedId.trim()}`);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#090C14] text-white">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 z-10 relative space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Award className="h-4 w-4 text-indigo-400" />
            <span>Registre de vérification MLAcademy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Vérifier un <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Certificat</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Saisissez ou cliquez sur un lien de certificat pour valider officiellement l'acquisition des compétences sur MLAcademy.
          </p>
        </div>

        {loading ? (
          <div className="glass-card rounded-[40px] border border-white/5 p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-slate-500 font-bold text-sm">Vérification dans la blockchain de données...</p>
          </div>
        ) : cert ? (
          /* Certificate Details Card */
          <div className="glass-card rounded-[40px] border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/60 to-black p-8 md:p-12 relative shadow-2xl">
            {/* Holographic style effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-white/10 pb-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 text-emerald-400">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Certificat vérifié et valide
                  </span>
                  <h2 className="text-sm font-bold text-slate-500 mt-2">ID: {cert.certificate_id}</h2>
                </div>
              </div>

              {cert.pdf_url && (
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/15"
                >
                  <Download className="h-4 w-4" /> Télécharger le PDF
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Titulaire</span>
                <p className="text-2xl font-black text-white">{cert.student_name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type de certification</span>
                <p className="text-2xl font-black text-white">{cert.cert_type}</p>
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Programme certifié</span>
              <p className="text-2xl font-black text-indigo-400 leading-snug">{cert.target_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Délivré le</p>
                  <p className="text-sm font-bold text-white">
                    {new Date(cert.issued_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score final obtenu</p>
                  <p className="text-sm font-bold text-white">{cert.final_score}% de réussite</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Invalid / Not Found Card */
          <div className="glass-card rounded-[40px] border border-red-500/10 bg-red-500/5 p-12 text-center space-y-6">
            <div className="h-16 w-16 rounded-[24px] bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0 mx-auto text-red-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Certificat Inconnu ou Invalide</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                L'identifiant de certificat fourni n'existe pas dans le registre public de MLAcademy. Assurez-vous que l'URL est correcte.
              </p>
            </div>
          </div>
        )}

        {/* Verify another form */}
        <div className="glass-card rounded-[32px] border border-white/5 bg-white/5 p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Vérifier un autre ID</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: c7a82b3d-1a2c..."
                value={typedId}
                onChange={(e) => setTypedId(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-slate-900/40 px-6 py-4 pr-16 text-sm text-white outline-none backdrop-blur-xl transition focus:border-indigo-500/30 font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
