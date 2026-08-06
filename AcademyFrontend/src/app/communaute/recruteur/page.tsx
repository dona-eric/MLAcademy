"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Loader2, Briefcase, ChevronRight, User, CheckCircle, XCircle, Clock, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobOffer } from "@/types/community";

export default function RecruiterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'challenges'>('jobs');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && !user.is_recruiter && !user.is_staff) {
      // Pourrait rediriger si on veut être strict
      // router.push("/communaute");
    }
    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  async function loadDashboardData() {
    try {
      const jobsData = await fetchApi("/api/community/recruitment/my_company_jobs/");
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error("Failed to load recruiter data", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications(job: JobOffer) {
    setSelectedJob(job);
    setAppsLoading(true);
    try {
      const data = await fetchApi(`/api/community/recruitment/${job.id}/applications/`);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setAppsLoading(false);
    }
  }

  async function updateApplicationStatus(appId: number, status: string) {
    if (!selectedJob) return;
    try {
      await fetchApi(`/api/community/recruitment/${appId}/update-application-status/`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
      // Refresh applications
      loadApplications(selectedJob);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  async function startConversation(talentId: number) {
    if (!selectedJob) return;
    try {
      await fetchApi("/api/community/dm/start/", {
        method: "POST",
        body: JSON.stringify({ 
          recipient_id: talentId,
          job_offer_id: selectedJob.id
        })
      });
      router.push("/communaute/messages");
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border-subtle)] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/communaute" className="p-2 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] hover:bg-[var(--brand-100)] transition-colors">
              <Briefcase className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Espace Recruteur</h1>
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Gestion des Talents & Offres</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/communaute/messages" className="btn-secondary py-2 px-4 text-sm gap-2">
              <MessageSquare className="w-4 h-4" /> Messagerie
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche: Liste des Offres */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-4 flex gap-2">
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-[var(--brand-500)] text-white shadow-md shadow-[var(--brand-glow)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
            >
              Mes Offres
            </button>
            <button 
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'challenges' ? 'bg-[var(--brand-500)] text-white shadow-md shadow-[var(--brand-glow)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
            >
              Challenges
            </button>
          </div>

          <div className="space-y-3">
            {jobs.length === 0 ? (
              <div className="card-flat py-12 text-center text-[var(--text-tertiary)] text-sm">
                Aucune offre publiée.
              </div>
            ) : (
              jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => loadApplications(job)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedJob?.id === job.id 
                      ? 'bg-white border-[var(--brand-500)] shadow-lg shadow-[var(--brand-glow)] ring-1 ring-[var(--brand-500)]' 
                      : 'bg-white border-[var(--border-subtle)] hover:border-[var(--brand-300)] shadow-sm'
                  }`}
                >
                  <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] font-medium">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)]">{job.contract_type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Colonne Droite: Candidatures */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="card p-0 overflow-hidden shadow-xl border border-[var(--border-subtle)]">
              <div className="bg-[var(--bg-primary)] p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-1">Candidatures : {selectedJob.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">{applications.length} candidat(s) au total</p>
                </div>
              </div>

              {appsLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" />
                </div>
              ) : applications.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                  <User className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium text-sm">Aucune candidature pour cette offre.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {applications.map(app => (
                    <div key={app.id} className="p-6 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Avatar & Infos basiques */}
                        <div className="flex gap-4 min-w-[250px]">
                          <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] border border-[var(--brand-100)] flex items-center justify-center shrink-0 overflow-hidden">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${app.user_name || 'U'}&background=random`} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)]">{app.user_name || "Candidat Anonyme"}</h4>
                            <p className="text-xs text-[var(--text-secondary)] mb-2">{app.user_email}</p>
                            
                            <StatusBadge status={app.status} />
                          </div>
                        </div>

                        {/* Contenu (Lettre / CV) */}
                        <div className="flex-1 space-y-3">
                          {app.cover_letter && (
                            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] line-clamp-3">
                              {app.cover_letter}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            {app.cv_url && (
                              <a href={app.cv_url} target="_blank" rel="noreferrer" className="btn-secondary py-1.5 px-3 text-xs gap-1.5">
                                <Eye className="w-3.5 h-3.5" /> Voir CV
                              </a>
                            )}
                            <button 
                              onClick={() => startConversation(app.user)}
                              className="btn-primary py-1.5 px-3 text-xs gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> Contacter
                            </button>

                            <div className="flex-1" />

                            <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-subtle)]">
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'reviewing')}
                                className={`px-3 py-1 text-xs font-bold rounded-md ${app.status === 'reviewing' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                En revue
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'interview')}
                                className={`px-3 py-1 text-xs font-bold rounded-md ${app.status === 'interview' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                Entretien
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                className={`px-3 py-1 text-xs font-bold rounded-md ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                Accepter
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                className={`px-3 py-1 text-xs font-bold rounded-md ${app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                Refuser
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[var(--brand-50)] rounded-full flex items-center justify-center text-[var(--brand-500)] mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Sélectionnez une offre</h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                Cliquez sur l'une de vos offres à gauche pour visualiser et gérer les candidatures reçues.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending': return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-600"><Clock className="w-3 h-3" /> En attente</span>;
    case 'reviewing': return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> En revue</span>;
    case 'interview': return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-100 text-indigo-700"><MessageSquare className="w-3 h-3" /> Entretien</span>;
    case 'accepted': return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3" /> Accepté</span>;
    case 'rejected': return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-rose-100 text-rose-700"><XCircle className="w-3 h-3" /> Refusé</span>;
    default: return null;
  }
}
