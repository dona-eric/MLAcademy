"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/lib/api';
import { 
  Search, Clock, Eye, CheckCircle2, XCircle, 
  ArrowLeft, Sparkles, Loader2, Zap, AlertCircle,
  Calendar, FileText, ChevronRight
} from 'lucide-react';

const STATUS_MAP = {
  'pending': { 
    label: 'En attente', 
    icon: <Clock className="w-6 h-6 text-amber-400" />, 
    color: 'amber',
    desc: 'Votre dossier a été bien reçu et attend d\'être ouvert par un membre de notre équipe.'
  },
  'reviewing': { 
    label: 'En cours d\'examen', 
    icon: <Eye className="w-6 h-6 text-indigo-400" />, 
    color: 'indigo',
    desc: 'Un administrateur est actuellement en train d\'analyser votre parcours et vos motivations.'
  },
  'approved': { 
    label: 'Approuvée', 
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />, 
    color: 'emerald',
    desc: 'Félicitations ! Votre candidature a été acceptée. Vérifiez vos e-mails pour activer votre compte.'
  },
  'rejected': { 
    label: 'Refusée', 
    icon: <XCircle className="w-6 h-6 text-rose-400" />, 
    color: 'rose',
    desc: 'Malheureusement, votre candidature n\'a pas été retenue pour le moment.'
  }
};

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState('');
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setStatusData(null);

    try {
      const data = await fetchApi(`/api/public/users/instructor-status/?email=${encodeURIComponent(email)}`);
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || "Candidature introuvable pour cet e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090C14] flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-12 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 hover:text-indigo-400 transition-colors">
            <Sparkles className="w-6 h-6 text-indigo-400" /> MLAcademy
          </Link>
          <Link href="/instructor/apply" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            Nouvelle candidature <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight">Suivi de candidature</h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Entrez l'adresse e-mail utilisée lors de votre inscription pour consulter l'état d'avancement de votre dossier.
          </p>
        </div>

        <div className="glass-card rounded-[32px] p-8 border border-white/5 shadow-2xl mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                placeholder="votre-email@exemple.com"
              />
            </div>
            <button 
              type="submit" disabled={loading}
              className="btn-primary px-8 py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        {statusData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-card rounded-[32px] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Background gradient based on status */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].color}-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-${STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].color}-500/10 border border-${STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].color}-500/20 flex items-center justify-center`}>
                    {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut actuel</p>
                    <h2 className="text-2xl font-black text-white">{STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].label}</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernière mise à jour</p>
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {new Date(statusData.reviewed_at || statusData.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].desc}
                  </p>
                </div>

                {statusData.status === 'rejected' && statusData.rejection_reason && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Motif du refus
                    </h3>
                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-slate-400 text-sm leading-relaxed">
                      {statusData.rejection_reason}
                    </div>
                  </div>
                )}

                {statusData.status === 'approved' && (
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4 text-center">
                    <p className="text-emerald-400 font-bold">Votre compte est activé !</p>
                    <p className="text-slate-400 text-sm">Cliquez sur le lien reçu par e-mail pour définir votre mot de passe et accéder au Studio.</p>
                  </div>
                )}

                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" /> ID Dossier: #{statusData.id.toString().padStart(6, '0')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Soumis le {new Date(statusData.submitted_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-12 text-center relative z-10">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
