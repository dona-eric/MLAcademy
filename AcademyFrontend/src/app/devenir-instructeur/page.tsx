'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';

export default function BecomeInstructorPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cvUrl, setCvUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [motivation, setMotivation] = useState('');
  const [expertise, setExpertise] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/devenir-instructeur');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await fetchApi("/api/private/users/apply-instructor/", {
        method: 'POST',
        body: JSON.stringify({
          cv_url: cvUrl,
          portfolio_url: portfolioUrl,
          motivation,
          expertise_areas: expertise
        })
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-16 text-center" style={{ maxWidth: '600px' }}>
        <div className="glass-panel p-12" style={{ border: '2px solid #10b981' }}>
          <h1 className="text-3xl font-bold text-green-400 mb-4">Candidature envoyée ! 🎉</h1>
          <p className="text-lg mb-6">
            Merci de votre intérêt pour MLAcademy. Notre équipe va étudier votre profil et vos motivations.
            Nous vous contacterons très prochainement.
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn btn-secondary">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Devenez Instructeur sur MLAcademy</h1>
        <p className="text-xl text-secondary">
          Partagez votre expertise en Machine Learning, Data Science et Intelligence Artificielle. 
          Rejoignez une équipe d'élite et aidez la nouvelle génération à se former.
        </p>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-semibold mb-6">Soumettre votre candidature</h2>
        
        {error && <div className="alert-error mb-6">{error}</div>}
        
        {!user && (
          <div className="mb-8 p-4 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--accent-primary)' }}>
            <p>Vous devez être connecté pour soumettre une candidature.</p>
            <button onClick={() => router.push('/login?redirect=/devenir-instructeur')} className="btn btn-primary mt-3">
              Se connecter
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" style={{ opacity: user ? 1 : 0.5, pointerEvents: user ? 'auto' : 'none' }}>
          
          <div>
            <label className="block text-sm font-medium mb-2">Domaines d'expertise *</label>
            <input 
              type="text" 
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="ex: Deep Learning, NLP, MLOps, Python..."
              required
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lien vers votre CV *</label>
              <input 
                type="url" 
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="LinkedIn, Google Drive, etc."
                required
                className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lien Portfolio / GitHub</label>
              <input 
                type="url" 
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/votre-profil"
                className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vos motivations *</label>
            <textarea 
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Pourquoi souhaitez-vous enseigner sur MLAcademy ? Quelle est votre vision pédagogique ?"
              required
              rows={5}
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-indigo-500 outline-none resize-y"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading || !user}
            className="btn btn-primary w-full text-lg py-3 mt-4"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </form>
      </div>
    </div>
  );
}
