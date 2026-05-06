'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import './project.css';

interface PeerReview {
  id: number;
  reviewer_name: string;
  score: number;
  feedback: string;
  is_approved: boolean;
  created_at: string;
}

interface ProjectSubmission {
  id: number;
  repo_url: string;
  code_content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  peer_reviews: PeerReview[];
}

interface ProjectData {
  id: number;
  title: string;
  description: string;
  instructions: string;
  starter_code: string;
  is_final: boolean;
  submission: ProjectSubmission | null; // Note: You'll need to adapt backend to return this or fetch separately
}

export default function ProjectPage({ params }: { params: Promise<{ courseSlug: string, projectId: string }> }) {
  const resolvedParams = use(params);
  const { courseSlug, projectId } = resolvedParams;
  const { user } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [repoUrl, setRepoUrl] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadProjectData() {
      try {
        // Fetch project details (assuming an endpoint exists, if not we will fetch via module or course)
        // A generic view for a specific project might be needed. For now, let's assume we have it at /api/learning/projects/{id}/
        // As a workaround, we fetch the course and find the project.
        const courseData = await fetchApi(`/api/courses/${courseSlug}/`);
        let foundProject = null;
        for (const mod of courseData.modules) {
          if (mod.project && mod.project.id.toString() === projectId) {
            foundProject = mod.project;
            break;
          }
        }
        
        if (!foundProject) {
          throw new Error("Projet introuvable.");
        }
        setProject(foundProject);

        // Fetch submission for this project
        try {
          // The backend expects an endpoint to list submissions, we filter by project
          const submissions = await fetchApi(`/api/learning/submissions/`);
          const mySubmission = submissions.find((s: any) => s.project.toString() === projectId);
          if (mySubmission) {
            setSubmission(mySubmission);
            setRepoUrl(mySubmission.repo_url || '');
            setCodeContent(mySubmission.code_content || '');
          }
        } catch (e) {
          // No submission yet
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du projet.");
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [courseSlug, projectId, user, router]);

  const handleSubmit = async (e: React.FormEvent, targetStatus: 'draft' | 'pending') => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        project: parseInt(projectId),
        repo_url: repoUrl,
        code_content: codeContent
      };

      let currentSubmission = submission;
      
      // Save draft first
      if (currentSubmission) {
        currentSubmission = await fetchApi(`/api/learning/submissions/${currentSubmission.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        currentSubmission = await fetchApi(`/api/learning/submissions/`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setSubmission(currentSubmission);

      // If they want to submit for review, hit the submit endpoint
      if (targetStatus === 'pending' && currentSubmission) {
        await fetchApi(`/api/learning/submissions/${currentSubmission.id}/submit/`, {
          method: 'POST'
        });
        // Update local status
        setSubmission({ ...currentSubmission, status: 'pending' });
        alert("Projet soumis avec succès pour correction !");
      } else {
        alert("Brouillon sauvegardé !");
      }
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted">Chargement du projet...</div>;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;
  if (!project) return null;

  return (
    <div className="project-page">
      <div className="container py-8" style={{ maxWidth: '900px' }}>
        <Link href={`/parcours/${courseSlug}`} className="text-muted hover:text-white mb-6 inline-block">
          ← Retour au cours
        </Link>
        
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.is_final && <span className="badge badge-primary" style={{ background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem' }}>Projet Certifiant</span>}
          </div>
          <p className="text-lg text-secondary leading-relaxed">{project.description}</p>
        </header>

        <section className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📋 Instructions</h2>
          <div className="prose prose-invert max-w-none">
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{project.instructions}</pre>
          </div>
          {project.starter_code && (
            <div className="mt-6">
              <h3 className="font-medium mb-2 text-muted">Code de démarrage :</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {project.starter_code}
              </pre>
            </div>
          )}
        </section>

        {submission?.status === 'approved' ? (
          <section className="glass-panel p-8 text-center" style={{ border: '2px solid #10b981' }}>
            <h2 className="text-2xl text-green-500 mb-4">✅ Projet Validé !</h2>
            <p className="mb-6">Félicitations, votre projet a été corrigé et validé avec succès.</p>
            {project.is_final && (
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-bold text-green-400">🎉 Vous êtes éligible au certificat pour ce cours !</p>
              </div>
            )}
          </section>
        ) : (
          <section className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-6">Soumettre votre travail</h2>
            
            {submission?.status === 'pending' && (
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderLeft: '4px solid #f59e0b' }}>
                <p className="font-semibold">⏳ En attente de correction</p>
                <p className="text-sm mt-1">Votre projet a été soumis et attend d'être évalué par un pair ou un instructeur. Vous pouvez encore le modifier.</p>
              </div>
            )}

            {submission?.status === 'rejected' && (
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderLeft: '4px solid #ef4444' }}>
                <p className="font-semibold">❌ Projet rejeté</p>
                <p className="text-sm mt-1">Votre projet n'a pas atteint les critères requis. Veuillez consulter les commentaires ci-dessous et soumettre une nouvelle version.</p>
              </div>
            )}

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">URL du dépôt Git (GitHub, GitLab...)</label>
                <input 
                  type="url" 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/mon-compte/mon-projet"
                  className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted">OU / ET insérez votre code principal ici :</label>
                <textarea 
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={8}
                  placeholder="# Collez votre code python ici..."
                  className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none font-mono text-sm"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={submitting}
                  className="btn btn-secondary px-6"
                >
                  Sauvegarder le brouillon
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, 'pending')}
                  disabled={submitting || (!repoUrl && !codeContent)}
                  className="btn btn-primary px-8"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  Soumettre pour correction
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Affichage des corrections par les pairs */}
        {submission && submission.peer_reviews && submission.peer_reviews.length > 0 && (
          <section className="mt-8 glass-panel p-6">
            <h2 className="text-xl font-semibold mb-6">📝 Retours des pairs</h2>
            <div className="space-y-4">
              {submission.peer_reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-black/20 border border-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">{review.reviewer_name}</span>
                    <span className={`px-3 py-1 rounded text-sm font-bold ${review.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      Score: {review.score}/100 — {review.is_approved ? 'Validé' : 'À revoir'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{review.feedback}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
