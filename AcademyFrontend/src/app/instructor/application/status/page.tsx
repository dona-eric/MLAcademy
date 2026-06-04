"use client";

import { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  Search, Clock, Eye, CheckCircle2, XCircle,
  ArrowLeft, Loader2, Zap, AlertCircle,
  Calendar, FileText, ChevronRight
} from 'lucide-react';

const STATUS_MAP = {
  'pending': {
    label: 'En attente',
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    color: 'amber',
    desc: 'Votre dossier a été bien reçu et attend d\'être ouvert par un membre de notre équipe.'
  },
  'reviewing': {
    label: 'En cours d\'examen',
    icon: <Eye className="w-6 h-6 text-indigo-500" />,
    color: 'indigo',
    desc: 'Un administrateur est actuellement en train d\'analyser votre parcours et vos motivations.'
  },
  'approved': {
    label: 'Approuvée',
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    color: 'emerald',
    desc: 'Félicitations ! Votre candidature a été acceptée. Vérifiez vos e-mails pour activer votre compte.'
  },
  'rejected': {
    label: 'Refusée',
    icon: <XCircle className="w-6 h-6 text-red-500" />,
    color: 'red',
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12">

      <div className="w-full max-w-2xl relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">

        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 hover:text-indigo-600 transition-colors">
            MLAcademy
          </Link>
          <Link href="/instructor/apply" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            Nouvelle candidature <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Suivi de candidature</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Entrez l'adresse email utilisée lors de votre inscription pour consulter l'état d'avancement de votre dossier.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="votre-email@exemple.com"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm sm:w-auto w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vérifier le statut'}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> <p>{error}</p>
            </div>
          )}
        </div>

        {/* Result Card */}
        {statusData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border
                    ${statusData.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : ''}
                    ${statusData.status === 'reviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : ''}
                    ${statusData.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : ''}
                    ${statusData.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-600' : ''}
                  `}>
                  {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut actuel</p>
                  <h2 className="text-xl font-semibold text-slate-900 mt-1">{STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].label}</h2>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Dernière mise à jour</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(statusData.reviewed_at || statusData.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {STATUS_MAP[statusData.status as keyof typeof STATUS_MAP].desc}
                </p>
              </div>

              {statusData.status === 'rejected' && statusData.rejection_reason && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Motif du refus
                  </h3>
                  <div className="p-5 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm leading-relaxed">
                    {statusData.rejection_reason}
                  </div>
                </div>
              )}

              {statusData.status === 'approved' && (
                <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-100 space-y-2 text-center">
                  <p className="text-emerald-800 font-semibold text-sm">Votre compte est activé !</p>
                  <p className="text-emerald-700/80 text-sm">
                    Cliquez sur le lien reçu par e-mail pour définir votre mot de passe et accéder au Studio.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> ID Dossier: #{statusData.id.toString().padStart(6, '0')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Soumis le {new Date(statusData.submitted_at).toLocaleDateString('fr-FR')}
              </div>
            </div>

          </div>
          </div>
        )}

      <div className="mt-auto pt-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    </div>
    </div >
  );
}
