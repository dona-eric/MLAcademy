'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
<<<<<<< HEAD
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  FileCode2,
  BookOpen,
  Send,
  Save,
  MessageSquare,
  Award,
  Loader2
} from 'lucide-react';
=======
import './project.css';
>>>>>>> develop

interface PeerReview {
  id: number;
  reviewer_name: string;
<<<<<<< HEAD
  score: number | string; // The backend might return total score or JSON
  scores?: any; // The JSON of scores
  feedback: string;
  is_approved?: boolean;
=======
  score: number;
  feedback: string;
  is_approved: boolean;
>>>>>>> develop
  created_at: string;
}

interface ProjectSubmission {
  id: number;
  repo_url: string;
  code_content: string;
<<<<<<< HEAD
  status: 'draft' | 'pending' | 'in_review' | 'graded' | 'approved' | 'rejected';
=======
  status: 'draft' | 'pending' | 'approved' | 'rejected';
>>>>>>> develop
  peer_reviews: PeerReview[];
}

interface ProjectData {
  id: number;
  title: string;
  description: string;
  instructions: string;
  starter_code: string;
  is_final: boolean;
<<<<<<< HEAD
  required_review_count: number;
  passing_score: number;
=======
  submission: ProjectSubmission | null; // Note: You'll need to adapt backend to return this or fetch separately
>>>>>>> develop
}

export default function ProjectPage({ params }: { params: Promise<{ courseSlug: string, projectId: string }> }) {
  const resolvedParams = use(params);
  const { courseSlug, projectId } = resolvedParams;
<<<<<<< HEAD
  const { user, loading: authLoading } = useAuth();
=======
  const { user } = useAuth();
>>>>>>> develop
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
<<<<<<< HEAD

=======
  
>>>>>>> develop
  // Form state
  const [repoUrl, setRepoUrl] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    if (authLoading) return;
=======
>>>>>>> develop
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadProjectData() {
      try {
<<<<<<< HEAD
        // Fetch course to extract project info
=======
        // Fetch project details (assuming an endpoint exists, if not we will fetch via module or course)
        // A generic view for a specific project might be needed. For now, let's assume we have it at /api/learning/projects/{id}/
        // As a workaround, we fetch the course and find the project.
>>>>>>> develop
        const courseData = await fetchApi(`/api/public/courses/${courseSlug}/`);
        let foundProject = null;
        for (const mod of courseData.modules) {
          if (mod.project && mod.project.id.toString() === projectId) {
            foundProject = mod.project;
            break;
          }
        }
<<<<<<< HEAD

        if (!foundProject) {
          throw new Error("Projet introuvable dans ce cours.");
=======
        
        if (!foundProject) {
          throw new Error("Projet introuvable.");
>>>>>>> develop
        }
        setProject(foundProject);

        // Fetch submission for this project
        try {
<<<<<<< HEAD
          const submissions = await fetchApi("/api/private/learning/submissions/");
          const mySubmission = submissions.find((s: any) => s.project && s.project.id.toString() === projectId || s.project === parseInt(projectId));
=======
          // The backend expects an endpoint to list submissions, we filter by project
          const submissions = await fetchApi(`/api/private/learning/submissions/`);
          const mySubmission = submissions.find((s: any) => s.project.toString() === projectId);
>>>>>>> develop
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
<<<<<<< HEAD
  }, [courseSlug, projectId, user, authLoading, router]);
=======
  }, [courseSlug, projectId, user, router]);
>>>>>>> develop

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
<<<<<<< HEAD

=======
      
      // Save draft first
>>>>>>> develop
      if (currentSubmission) {
        currentSubmission = await fetchApi(`/api/private/learning/submissions/${currentSubmission.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
<<<<<<< HEAD
        currentSubmission = await fetchApi("/api/private/learning/submissions/", {
=======
        currentSubmission = await fetchApi(`/api/private/learning/submissions/`, {
>>>>>>> develop
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setSubmission(currentSubmission);

<<<<<<< HEAD
=======
      // If they want to submit for review, hit the submit endpoint
>>>>>>> develop
      if (targetStatus === 'pending' && currentSubmission) {
        await fetchApi(`/api/private/learning/submissions/${currentSubmission.id}/submit/`, {
          method: 'POST'
        });
<<<<<<< HEAD
        setSubmission({ ...currentSubmission, status: 'pending' });
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la soumission: " + err.message);
=======
        // Update local status
        setSubmission({ ...currentSubmission, status: 'pending' });
        alert("Projet soumis avec succès pour correction !");
      } else {
        alert("Brouillon sauvegardé !");
      }
    } catch (err: any) {
      alert("Erreur: " + err.message);
>>>>>>> develop
    } finally {
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Chargement du projet...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-slate-600 font-medium text-lg">{error || "Projet introuvable"}</p>
        <Link href={`/parcours/${courseSlug}`} className="text-indigo-600 font-semibold hover:underline">
          Retourner au cours
        </Link>
      </div>
    );
  }

  const isEditable = !submission || submission.status === 'draft';
  const isPending = submission?.status === 'pending' || submission?.status === 'in_review';
  const isEvaluated = submission?.status === 'approved' || submission?.status === 'rejected' || submission?.status === 'graded';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href={`/parcours/${courseSlug}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Retour au cours
          </Link>

          {project.is_final && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <Award className="w-4 h-4" /> Projet Certifiant
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Project Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{project.description}</p>
        </div>

        {/* Instructions Panel */}
        <section className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] pointer-events-none -z-10" />
          <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Instructions
          </h2>
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600">
            <div dangerouslySetInnerHTML={{ __html: project.instructions || "<p>Aucune instruction détaillée.</p>" }} />
          </div>

          {project.starter_code && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Code de démarrage fourni :</h3>
              <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800">
                <pre className="text-sm font-mono text-emerald-400">
                  {project.starter_code}
                </pre>
              </div>
=======
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
>>>>>>> develop
            </div>
          )}
        </section>

<<<<<<< HEAD
        {/* Status Banners */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 lg:p-8 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <Clock className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-amber-800">Projet en attente de correction</h3>
              <p className="text-amber-700 font-medium">
                Votre travail a été soumis avec succès. Il a été distribué à vos pairs pour évaluation.
                Revenez ici plus tard pour découvrir vos notes (nécessite {project.required_review_count || 2} évaluations).
              </p>
            </div>
          </div>
        )}

        {isEvaluated && (
          <div className={`rounded-[32px] p-8 lg:p-10 border shadow-sm animate-in fade-in slide-in-from-bottom-4 ${
            submission.status === 'approved'
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-red-50 border-red-200'
        }`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {submission.status === 'approved' ? (
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shrink-0 border border-red-200">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
          <div className="space-y-3 flex-1">
            <h2 className={`text-3xl font-black ${submission.status === 'approved' ? 'text-emerald-800' : 'text-red-800'}`}>
              {submission.status === 'approved' ? 'Projet Validé ! 🎉' : 'Projet Refusé'}
            </h2>
            <p className={`text-lg font-medium ${submission.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
              {submission.status === 'approved'
                ? "Félicitations, votre projet a satisfait aux critères de la communauté."
                : "Votre projet n'a pas atteint le score minimum requis. Lisez attentivement les retours ci-dessous et soumettez une nouvelle version améliorée."}
            </p>
            {project.is_final && submission.status === 'approved' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-bold shadow-sm">
                <Award className="w-4 h-4" /> Vous êtes éligible au certificat
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

{/* Dashboard of Peer Reviews (Only shown if Evaluated) */ }
{
  isEvaluated && submission?.peer_reviews && submission.peer_reviews.length > 0 && (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-indigo-600" /> Retours de vos pairs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {submission.peer_reviews.map((review, idx) => {
          // The backend can return a total score or JSON. We handle both.
          let totalScore = review.score;
          if (!totalScore && review.scores) {
            totalScore = Object.values(review.scores).reduce((a: any, b: any) => Number(a) + Number(b), 0) as number;
          }

          return (
            <div key={review.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Évaluateur #{idx + 1}</p>
                  <p className="font-semibold text-slate-700">{review.reviewer_name || "Pair Anonyme"}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600">{totalScore}</span>
                  <span className="text-slate-400 font-bold ml-1">pts</span>
                </div>
              </div>

              {/* Breakdown of scores if JSON exists */}
              {review.scores && Object.keys(review.scores).length > 0 && (
                <div className="mb-6 space-y-2">
                  {Object.entries(review.scores).map(([crit, val]) => (
                    <div key={crit} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600 capitalize">{crit.replace('_', ' ')}</span>
                      <span className="font-bold text-slate-900">{String(val)} / 5</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Feedback constructif</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {review.feedback || "Aucun commentaire supplémentaire laissé par ce pair."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}

{/* Submission Form (Shown if Draft or Rejected) */ }
{
  (isEditable || submission?.status === 'rejected') && (
    <section className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-200 shadow-sm relative">
      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
        <UploadCloud className="w-6 h-6 text-indigo-600" /> Soumettre votre travail
      </h2>

      <form className="space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">URL du Dépôt (GitHub, GitLab, Colab...)</label>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/mon-compte/mon-projet"
            className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-xs font-black uppercase tracking-widest text-slate-400">OU / ET</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileCode2 className="w-4 h-4" /> Code Source Principal
          </label>
          <p className="text-sm text-slate-500 mb-2">Vous pouvez coller l'essentiel de votre script directement ici pour faciliter la correction.</p>
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            rows={8}
            placeholder="# import pandas as pd..."
            className="w-full px-5 py-4 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-sm placeholder:text-slate-600 custom-scrollbar"
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={submitting}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Save className="w-5 h-5" /> Sauvegarder (Brouillon)
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'pending')}
            disabled={submitting || (!repoUrl && !codeContent)}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Soumettre pour correction finale
          </button>
        </div>
      </form>
    </section>
  )
}
      </main >
    </div >
=======
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
>>>>>>> develop
  );
}
