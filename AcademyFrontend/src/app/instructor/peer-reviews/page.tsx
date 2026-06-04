"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckCircle2, Search, Users, Sparkles,
  Clock, FileCode2, Link as LinkIcon,
  X, Send, Loader2, Star
} from "lucide-react";

interface ProjectSubmission {
  id: number;
  project: {
    id: number;
    title: string;
    description: string;
    instructions: string;
  };
  user: {
    first_name: string;
    last_name: string;
    username: string;
  };
  repo_url: string;
  code_content: string;
  submitted_at: string;
  status: string;
}

const DEFAULT_CRITERIA = [
  { key: "clarte", label: "Clarté et Lisibilité", max: 5 },
  { key: "technique", label: "Exactitude Technique", max: 5 },
  { key: "structure", label: "Structure du Code", max: 5 },
  { key: "originalite", label: "Originalité / Effort", max: 5 },
];

export default function PeerReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Review Form State
  const [scores, setScores] = useState<Record<string, number>>({
    clarte: 0, technique: 0, structure: 0, originalite: 0
  });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadReviews() {
      try {
        const data = await fetchApi("/api/private/learning/peer-reviews/to_review/");
        setSubmissions(data);
      } catch (err) {
        console.error("Erreur lors du chargement des évaluations", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [user, authLoading, router]);

  const handleScoreChange = (criteriaKey: string, score: number) => {
    setScores(prev => ({ ...prev, [criteriaKey]: score }));
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;

    // Check if all criteria are scored
    const allScored = Object.values(scores).every(val => val > 0);
    if (!allScored) {
      alert("Veuillez donner une note pour chaque critère.");
      return;
    }

    if (feedback.trim().length < 20) {
      alert("Veuillez fournir un feedback d'au moins 20 caractères.");
      return;
    }

    setSubmitting(true);
    try {
      await fetchApi("/api/private/learning/reviews/submit/", {
        method: "POST",
        body: JSON.stringify({
          submission: selectedSubmission.id,
          scores: scores,
          feedback: feedback
        })
      });

      alert("Évaluation soumise avec succès !");
      // Remove the submitted review from the list
      setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmission.id));
      setSelectedSubmission(null);
      // Reset form
      setScores({ clarte: 0, technique: 0, structure: 0, originalite: 0 });
      setFeedback("");

    } catch (err: any) {
      alert("Erreur lors de la soumission: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalCurrentScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxPossibleScore = DEFAULT_CRITERIA.length * 5;

  if (loading || authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Espace d'évaluation</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Corrections par les Pairs</h1>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Évaluez le travail de vos pairs pour les aider à progresser. Votre évaluation compte pour leur note finale et leur certification.
          </p>
        </div>

        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En attente</p>
            <p className="text-2xl font-black text-slate-900">{submissions.length}</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="bg-white rounded-[40px] border border-dashed border-slate-300 p-20 text-center space-y-6 shadow-sm">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Tout est à jour !</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Vous n'avez aucune évaluation en attente. Revenez plus tard lorsque de nouveaux projets vous seront assignés.
            </p>
          </div>
        </div>
      )}

      {/* Submissions Grid */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
                    Assigné
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                  {sub.project.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{sub.user.first_name || sub.user.username}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(sub)}
                className="w-full py-4 bg-slate-50 text-slate-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Évaluer ce projet
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal / Slide-over */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
          {/* Slide-over Panel */}
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="h-20 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Évaluation de projet</p>
                <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{selectedSubmission.project.title}</h2>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">

              {/* Student Work Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileCode2 className="w-4 h-4" /> Travail Soumis
                </h3>

                {selectedSubmission.repo_url && (
                  <a href={selectedSubmission.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-105 transition-transform">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-indigo-900 text-sm">Ouvrir le dépôt du projet</p>
                      <p className="text-xs text-indigo-600/70 truncate max-w-md">{selectedSubmission.repo_url}</p>
                    </div>
                  </a>
                )}

                {selectedSubmission.code_content && (
                  <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800">
                    <pre className="text-sm font-mono text-emerald-400">
                      {selectedSubmission.code_content}
                    </pre>
                  </div>
                )}
              </section>

              <hr className="border-slate-100" />

              {/* Rubric / Grading Grid */}
              <section className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Grille d'évaluation</h3>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score Actuel</p>
                    <p className="text-2xl font-black text-indigo-600">{totalCurrentScore} <span className="text-sm text-slate-400">/ {maxPossibleScore}</span></p>
                  </div>
                </div>

                <div className="space-y-6">
                  {DEFAULT_CRITERIA.map((criteria) => (
                    <div key={criteria.key} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-slate-800">{criteria.label}</p>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                          {scores[criteria.key]} / {criteria.max}
                        </span>
                      </div>

                      {/* Star Rating UI */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(criteria.key, val)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        scores[criteria.key] >= val
                          ? 'bg-amber-100 text-amber-500 border border-amber-200 scale-110 shadow-sm'
                          : 'bg-white text-slate-300 border border-slate-200 hover:border-amber-200 hover:text-amber-300'
                                     }`}
                                   >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                                ))}
                    </div>
                          </div>
                       ))}
            </div>
          </section>

          {/* Feedback Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Feedback constructif</h3>
            <p className="text-sm text-slate-500">Un bon feedback est précis, bienveillant, et propose des axes d'amélioration clairs. (Min. 20 caractères).</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              placeholder="Ex: J'ai beaucoup aimé l'approche que tu as prise pour le nettoyage des données, cependant..."
              className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium placeholder:text-slate-300 text-slate-700 resize-none shadow-sm"
            ></textarea>
          </section>
        </div>

              {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200 bg-white shrink-0 flex gap-4">
        <button
          onClick={() => setSelectedSubmission(null)}
          className="flex-1 px-6 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Soumettre l'évaluation
        </button>
      </div>
    </div>
        </div >
      )
}

    </div >
  );
}
