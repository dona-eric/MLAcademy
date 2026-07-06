"use client";

import { useState } from "react";
import { X, ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { ProjectSubmission } from "../types";
import { fetchApi } from "@/lib/api";

interface ReviewModalProps {
  submission: ProjectSubmission;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ submission, onClose, onSuccess }: ReviewModalProps) {
  const [score, setScore] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === "" || score < 0 || score > 100) {
      setError("Veuillez entrer une note valide entre 0 et 100.");
      return;
    }
    if (!feedback.trim()) {
      setError("Le feedback est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await fetchApi(`/api/private/studio/peer-reviews/${submission.id}/review/`, {
        method: "POST",
        body: JSON.stringify({
          scores: { global: Number(score) },
          feedback: feedback,
        }),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la soumission de l'évaluation.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0A192F]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-[#0A192F] uppercase tracking-tight">Évaluation de Projet</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Soumis par <span className="text-[#00D1FF] font-bold">@{submission.student_username}</span> • {submission.project_title}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Submission Content Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Travail Soumis
            </h3>
            
            {submission.repo_url && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Dépôt distant (GitHub, etc.)</p>
                  <p className="text-xs text-slate-500">{submission.repo_url}</p>
                </div>
                <a 
                  href={submission.repo_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#0A192F] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Ouvrir <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {submission.code_content && (
              <div className="bg-[#112240] rounded-2xl p-4 overflow-hidden shadow-inner border border-[#0A192F]/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <pre className="text-xs text-emerald-50 font-mono overflow-x-auto p-2 bg-[#0A192F]/50 rounded-xl">
                  <code>{submission.code_content}</code>
                </pre>
              </div>
            )}

            {!submission.repo_url && !submission.code_content && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-sm font-medium text-slate-500">
                Aucun contenu fourni dans cette soumission.
              </div>
            )}
          </section>

          {/* Form Section */}
          <form id="review-form" onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Votre Évaluation
            </h3>
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Note Globale (/100)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={score} 
                  onChange={(e) => setScore(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Ex: 85"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0A192F] focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Feedback Détaillé (Markdown)</label>
                <textarea 
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Qu'est-ce qui a bien fonctionné ? Que peut-on améliorer ?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] outline-none transition-all shadow-sm resize-y"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            form="review-form"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#00D1FF] hover:bg-[#00b8e6] text-[#0A192F] rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#00D1FF]/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Valider l'évaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
