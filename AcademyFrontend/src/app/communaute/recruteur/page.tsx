"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { Loader2, Briefcase, User, CheckCircle, XCircle, Clock, Eye, MessageSquare, Plus, Building2, Sparkles, Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobOffer } from "@/types/community";
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import CreateCompanyModal from "@/components/recruiter/CreateCompanyModal";
import TalentMatchingTab from "@/components/recruiter/TalentMatchingTab";

export default function RecruiterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [company, setCompany] = useState<any | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'matching' | 'challenges'>('jobs');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      // 1. Charger la société du recruteur
      try {
        const compData = await fetchApi("/api/community/companies/my-company/");
        setCompany(compData);
      } catch (err) {
        setCompany(null);
      }

      // 2. Charger ses offres d'emploi
      const jobsData = await fetchApi("/api/community/recruitment/my_company_jobs/");
      const jobList = Array.isArray(jobsData) ? jobsData : [];
      setJobs(jobList);

      if (jobList.length > 0) {
        loadApplications(jobList[0]);
      }
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
      loadApplications(selectedJob);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  async function startConversation(candidateUserId: number) {
    if (!candidateUserId) return;
    try {
      await fetchApi("/api/community/dm/start/", {
        method: "POST",
        body: JSON.stringify({ 
          recipient_id: candidateUserId,
          job_offer_id: selectedJob?.id
        })
      });
      router.push("/communaute/messages");
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  }

  function handleOpenCompanyModal() {
    if (!user) {
      router.push("/register?redirect=/communaute/recruteur");
      return;
    }
    setIsCompanyModalOpen(true);
  }

  function handleOpenJobModal() {
    if (!user) {
      router.push("/register?redirect=/communaute/recruteur");
      return;
    }
    if (!company) {
      setIsCompanyModalOpen(true);
      return;
    }
    setIsJobModalOpen(true);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] font-sans pb-16">
      {/* Header Bar */}
      <header className="bg-white border-b border-[var(--border-subtle)] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/communaute" className="p-2 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] hover:bg-[var(--brand-100)] transition-colors">
              <Briefcase className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
                Espace Recruteur B2B {company ? `— ${company.name}` : ""}
              </h1>
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Recrutement & Talent Pipeline MLAcademy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/communaute/messages" className="btn-secondary py-2 px-4 text-sm gap-2">
              <MessageSquare className="w-4 h-4" /> Messagerie
            </Link>

            {company ? (
              <button 
                onClick={handleOpenJobModal}
                className="btn-primary py-2 px-4 text-sm gap-2 shadow-lg shadow-[var(--brand-glow)]"
              >
                <Plus className="w-4 h-4" /> Publier une offre
              </button>
            ) : (
              <button 
                onClick={handleOpenCompanyModal}
                className="btn-primary py-2 px-4 text-sm gap-2 shadow-lg shadow-[var(--brand-glow)]"
              >
                <Building2 className="w-4 h-4" /> Enregistrer mon Entreprise
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Company Registration Banner Prompt */}
        {!company && (
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-2xl z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-extrabold border border-indigo-400/30">
                <Building2 className="w-3.5 h-3.5" /> Compte Entreprise Requis
              </span>
              <h2 className="text-2xl font-extrabold">Créez le profil de votre Entreprise pour publier des offres</h2>
              <p className="text-sm text-indigo-200 font-medium">
                Accédez à la CVthèque d'élite des certifiés MLAcademy, lancez des challenges sponsorisés et recrutez des ingénieurs Machine Learning.
              </p>
            </div>
            <button
              onClick={handleOpenCompanyModal}
              className="btn-primary py-3 px-6 text-sm font-black gap-2 bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl shrink-0 z-10"
            >
              <Building2 className="w-4 h-4 text-indigo-600" /> Enregistrer mon entreprise <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Navigation Tabs */}
        <div className="card p-2 flex gap-2 max-w-xl">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'jobs' ? 'bg-[var(--brand-500)] text-white shadow-md shadow-[var(--brand-glow)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
          >
            Mes Offres & Candidatures ({jobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('matching')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'matching' ? 'bg-[var(--brand-500)] text-white shadow-md shadow-[var(--brand-glow)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Matching Talents
          </button>
        </div>

        {/* Tab 1: Jobs & Applications */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Job List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Offres Publiées</h3>
                {company && (
                  <button 
                    onClick={handleOpenJobModal}
                    className="text-xs font-bold text-[var(--brand-500)] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nouvelle offre
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <div className="card-flat py-12 text-center text-[var(--text-tertiary)] text-sm space-y-3">
                    <Briefcase className="w-10 h-10 mx-auto opacity-30 text-[var(--brand-500)]" />
                    <p className="font-medium">Aucune offre publiée pour le moment.</p>
                    {company && (
                      <button
                        onClick={() => setIsJobModalOpen(true)}
                        className="btn-primary py-2 px-4 text-xs font-bold gap-1.5 mx-auto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Publier ma première offre
                      </button>
                    )}
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
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] font-bold">{job.contract_type}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Candidates for Selected Job */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <div className="card p-0 overflow-hidden shadow-xl border border-[var(--border-subtle)]">
                  <div className="bg-[var(--bg-primary)] p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-1">
                        Candidatures : {selectedJob.title}
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)] font-medium">
                        {applications.length} candidat(s) ont postulé
                      </p>
                    </div>
                  </div>

                  {appsLoading ? (
                    <div className="py-20 flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)]" />
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                      <User className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-sm">Aucune candidature reçue pour cette offre pour le moment.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[var(--border-subtle)]">
                      {applications.map(app => (
                        <div key={app.id} className="p-6 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                          <div className="flex flex-col sm:flex-row gap-6">
                            {/* Candidate Info */}
                            <div className="flex gap-4 min-w-[250px]">
                              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-50)] border border-[var(--brand-100)] flex items-center justify-center shrink-0 overflow-hidden">
                                <img 
                                  src={app.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.user_name || 'U')}&background=random`} 
                                  alt="Avatar" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-[var(--text-primary)] text-sm">{app.user_name || "Candidat Anonyme"}</h4>
                                <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium">{app.user_email}</p>
                                
                                <StatusBadge status={app.status} />
                              </div>
                            </div>

                            {/* Motivation & CV */}
                            <div className="flex-1 space-y-3">
                              {app.cover_letter && (
                                <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-medium line-clamp-3">
                                  "{app.cover_letter}"
                                </div>
                              )}
                              
                              {/* Actions Bar */}
                              <div className="flex flex-wrap items-center gap-2 pt-2">
                                {app.cv_url && (
                                  <a href={app.cv_url} target="_blank" rel="noreferrer" className="btn-secondary py-1.5 px-3 text-xs gap-1.5">
                                    <Eye className="w-3.5 h-3.5" /> Voir CV
                                  </a>
                                )}
                                <button 
                                  onClick={() => startConversation(app.user_id)}
                                  className="btn-primary py-1.5 px-3 text-xs gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> Contacter le talent
                                </button>

                                <div className="flex-1" />

                                <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-subtle)]">
                                  <button 
                                    onClick={() => updateApplicationStatus(app.id, 'reviewing')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg ${app.status === 'reviewing' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}
                                  >
                                    En revue
                                  </button>
                                  <button 
                                    onClick={() => updateApplicationStatus(app.id, 'interview')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg ${app.status === 'interview' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                                  >
                                    Entretien
                                  </button>
                                  <button 
                                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'}`}
                                  >
                                    Accepter
                                  </button>
                                  <button 
                                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg ${app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'text-slate-500 hover:bg-slate-100'}`}
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
                  <div className="w-16 h-16 bg-[var(--brand-50)] rounded-2xl flex items-center justify-center text-[var(--brand-500)] mb-4">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Sélectionnez une offre</h3>
                  <p className="text-[var(--text-secondary)] text-sm max-w-sm font-medium">
                    Cliquez sur l'une de vos offres à gauche pour visualiser et gérer les candidatures reçues.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: AI Matching Engine */}
        {activeTab === 'matching' && (
          <TalentMatchingTab jobs={jobs} />
        )}
      </main>

      {/* Modals */}
      <CreateCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSuccess={(newCompany) => {
          setCompany(newCompany);
          loadDashboardData();
        }}
      />

      <CreateJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={(newJob) => {
          setJobs(prev => [newJob, ...prev]);
          setSelectedJob(newJob);
          loadApplications(newJob);
        }}
      />
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
