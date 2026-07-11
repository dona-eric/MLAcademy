"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Sparkles, Loader2, PlayCircle, Clock } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { ProjectSubmission } from "./types";
import { ReviewModal } from "./components/ReviewModal";

export default function PeerReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "pending" 
        ? "/api/private/studio/peer-reviews/to-review/" 
        : "/api/private/studio/peer-reviews/";
      
      const data = await fetchApi(endpoint);
      
      // If we are on the completed tab, we might need to filter manually if the backend returns all.
      // But according to the API, /to-review/ returns pending, and / returns all (or completed?). 
      // Actually, /to-review/ excludes those reviewed by the instructor. 
      // The base / returns all submissions for the instructor's courses. 
      // Let's filter locally if needed for the "completed" tab to only show those reviewed by this instructor.
      if (activeTab === "completed") {
        // We filter for those where the user is in the reviews list, or simply where status is not pending.
        // Assuming the backend returns all, we filter to show only those the instructor has reviewed.
        // Or those that are no longer pending.
        setSubmissions(data.filter((s: ProjectSubmission) => s.reviews && s.reviews.length > 0));
      } else {
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const handleReviewSuccess = () => {
    setSelectedSubmission(null);
    fetchSubmissions(); // Refresh the list
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A192F]/5 rounded-full border border-[#0A192F]/5">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            <span className="text-[10px] font-black text-[#0A192F] uppercase tracking-widest">Évaluations</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A192F] font-georgia tracking-tight">Peer Reviews</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "pending" ? "text-[#00D1FF]" : "text-gray-400 hover:text-gray-600"}`}
        >
          En attente
          {activeTab === "pending" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D1FF]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "completed" ? "text-[#00D1FF]" : "text-gray-400 hover:text-gray-600"}`}
        >
          Déjà corrigés
          {activeTab === "completed" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D1FF]"></div>}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-200 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0A192F]">Tout est à jour !</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              {activeTab === "pending" 
                ? "Vous n'avez aucune évaluation en attente. Beau travail ! 🎉" 
                : "Vous n'avez pas encore corrigé de projets."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${submission.project_is_final ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {submission.project_is_final ? 'Projet Final' : 'Exercice'}
                  </span>
                  <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-[#0A192F]">{submission.project_title}</h3>
                <p className="text-sm text-gray-500 font-medium">Cours: <span className="text-gray-700">{submission.course_title}</span></p>
                <p className="text-sm text-gray-500 font-medium">Soumis par: <span className="text-[#00D1FF] font-bold">@{submission.student_username}</span></p>
              </div>

              {activeTab === "pending" ? (
                <button 
                  onClick={() => setSelectedSubmission(submission)}
                  className="bg-[#0A192F] hover:bg-slate-800 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <PlayCircle className="w-4 h-4" /> Corriger
                </button>
              ) : (
                <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                  Corrigé
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedSubmission && (
        <ReviewModal 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
