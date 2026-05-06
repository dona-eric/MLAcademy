'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function PeerReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review form state
  const [activeSubmission, setActiveSubmission] = useState<any | null>(null);
  const [score, setScore] = useState<number>(100);
  const [feedback, setFeedback] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    async function fetchSubmissions() {
      try {
        const data = await fetchApi('/api/learning/peer-reviews/to_review/');
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des soumissions.');
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [user, router]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;
    setSubmittingReview(true);
    
    try {
      await fetchApi(`/api/learning/peer-reviews/${activeSubmission.id}/review/`, {
        method: 'POST',
        body: JSON.stringify({
          score: score,
          feedback: feedback,
          is_approved: score >= 70 // Règle: >= 70 pour valider
        })
      });
      alert('Correction soumise avec succès !');
      // Remove from list
      setSubmissions(submissions.filter(s => s.id !== activeSubmission.id));
      setActiveSubmission(null);
      setScore(100);
      setFeedback('');
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted">Recherche de projets à corriger...</div>;

  return (
    <div className="container py-8" style={{ maxWidth: '1000px', minHeight: 'calc(100vh - 72px)' }}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Espace Correction (Peer Review)</h1>
        <p className="text-secondary">Aidez vos pairs en corrigeant leurs projets. L'enseignement est la meilleure façon d'apprendre.</p>
      </header>

      {error && <div className="alert-error mb-8">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Liste des soumissions en attente */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">À corriger ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <div className="glass-panel p-6 text-center text-muted">
              Aucun projet en attente de correction pour le moment.
            </div>
          ) : (
            submissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setActiveSubmission(sub)}
                className="glass-panel p-4 cursor-pointer hover:border-indigo-500 transition-colors"
                style={{ border: activeSubmission?.id === sub.id ? '2px solid var(--accent-primary)' : '' }}
              >
                <div className="text-sm text-muted mb-1">{new Date(sub.submitted_at).toLocaleDateString()}</div>
                <h3 className="font-semibold mb-2">Projet #{sub.project}</h3>
                <div className="text-sm flex gap-2">
                  {sub.repo_url && <span className="text-indigo-400">🔗 Lien fourni</span>}
                  {sub.code_content && <span className="text-indigo-400">📄 Code fourni</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Espace de correction détaillé */}
        <div className="md:col-span-2">
          {activeSubmission ? (
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Évaluation du Projet #{activeSubmission.project}</h2>
              
              <div className="mb-8 space-y-6">
                {activeSubmission.repo_url && (
                  <div>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Lien du dépôt</h3>
                    <a href={activeSubmission.repo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      {activeSubmission.repo_url} ↗
                    </a>
                  </div>
                )}
                
                {activeSubmission.code_content && (
                  <div>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Code principal</h3>
                    <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-gray-800">
                      {activeSubmission.code_content}
                    </pre>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="bg-black/20 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Votre évaluation</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Score (/100)</label>
                  <input 
                    type="number" 
                    min="0" max="100" 
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    required
                    className="w-24 p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none text-xl text-center"
                  />
                  <p className="text-xs text-muted mt-2">Un score ≥ 70 valide le projet.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Commentaires constructifs (obligatoire)</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    rows={5}
                    placeholder="Qu'est-ce qui est bien fait ? Qu'est-ce qui peut être amélioré ?"
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReview || feedback.trim().length < 10}
                  className="btn btn-primary w-full"
                >
                  {submittingReview ? 'Envoi...' : 'Soumettre l\'évaluation'}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-muted flex flex-col items-center justify-center h-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p>Sélectionnez un projet dans la liste à gauche pour commencer votre évaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
