<<<<<<< HEAD
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
      await fetchApi('/api/users/apply-instructor/', {
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
      setError(err.message || 'Une erreur est survenue lors de l\'envoi de votre candidature.');
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
            Retour au tableau de bord
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
=======
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Briefcase, Heart, Cpu, ArrowRight, ClipboardCheck } from "lucide-react";

export default function BecomeInstructorPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#090C14] text-white flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      <div className="max-w-4xl mx-auto px-6 z-10 relative space-y-16 my-auto">

        {/* Header Block */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Rejoignez l'élite des formateurs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Devenez <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Instructeur</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Partagez votre savoir en Intelligence Artificielle et Machine Learning. Concevez des formations immersives, animez des TP interactifs, et propulsez la carrière de milliers d'apprenants.
          </p>
        </div>

        {/* Core Perks Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Technologie de pointe</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vos cours s'intègrent à des notebooks interactifs et à des environnements sandbox en direct.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Rémunération attractive</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monétisez vos connaissances en touchant des royalties régulières sur vos cours et parcours certifiants.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Impact communautaire</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Aidez à former la relève technologique et scientifique en transmettant des savoirs concrets.
            </p>
          </div>
        </div>

        {/* Action Call / Presentation Card */}
        <div className="glass-card rounded-[40px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/60 to-black p-8 md:p-12 relative shadow-2xl text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Prêt à transmettre votre expertise ?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Notre processus de recrutement est simple, rapide et entièrement transparent. Remplissez notre formulaire de candidature en moins de 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/instructor/apply")}
              className="btn-primary py-4 px-10 rounded-2xl text-xs font-black uppercase tracking-widest bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 shadow-xl shadow-indigo-500/25 flex items-center gap-2"
            >
              Déposer ma candidature <ArrowRight className="w-4 h-4" />
            </button>
            
            <Link
              href="/instructor/application/status"
              className="py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white border border-white/5 hover:border-white/10 bg-white/5 transition-all flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" /> Suivre mon dossier
            </Link>
          </div>
        </div>
>>>>>>> develop
      </div>
    </div>
  );
}
