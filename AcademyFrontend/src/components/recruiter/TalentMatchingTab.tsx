"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Award, Trophy, Zap, MessageSquare, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { JobOffer, TalentProfile } from "@/types/community";
import { useRouter } from "next/navigation";

interface TalentMatchingTabProps {
  jobs: JobOffer[];
}

export default function TalentMatchingTab({ jobs }: TalentMatchingTabProps) {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(jobs[0]?.id || null);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactingId, setContactingId] = useState<number | null>(null);

  useEffect(() => {
    loadMatchingTalents();
  }, [selectedJobId]);

  async function loadMatchingTalents() {
    setLoading(true);
    try {
      const url = selectedJobId 
        ? `/api/community/matching/?job_id=${selectedJobId}` 
        : `/api/community/talents/`;
      const data = await fetchApi(url);
      setTalents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load matching talents", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartDirectMessage(talent: TalentProfile) {
    setContactingId(talent.id);
    try {
      await fetchApi("/api/community/dm/start/", {
        method: "POST",
        body: JSON.stringify({
          recipient_id: talent.id,
          job_offer_id: selectedJobId || undefined,
        }),
      });
      router.push("/communaute/messages");
    } catch (err) {
      console.error("Failed to start conversation", err);
    } finally {
      setContactingId(null);
    }
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-white p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-[var(--text-primary)] text-base">Moteur de Matching IA & Algorithmique</h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Recommandation personnalisée de profils certifiés par MLAcademy</p>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Offre ciblée :</label>
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="input text-xs font-bold py-2 px-3 bg-[var(--bg-secondary)] border-[var(--border-subtle)]"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.contract_type})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Talent Cards Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[var(--text-tertiary)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-500)] mb-3" />
          <p className="text-sm font-medium">Calcul du score de pertinence des candidats en cours...</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="card py-20 text-center text-[var(--text-tertiary)]">
          <p className="text-sm font-medium">Aucun talent correspondant trouvé pour cette offre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {talents.map((talent, index) => (
            <div
              key={talent.id}
              className="bg-white rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-xl hover:border-[var(--brand-300)] transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Rank Match Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profil Match #{index + 1}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-500)] bg-[var(--brand-50)] px-3 py-1 rounded-full">
                  <Zap className="w-3.5 h-3.5" /> {talent.xpPoints || 0} XP
                </div>
              </div>

              {/* Talent Body */}
              <div className="flex gap-4 items-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--brand-50)] border border-[var(--brand-100)] overflow-hidden shrink-0">
                  <img
                    src={talent.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.fullName || talent.username)}&background=random`}
                    alt={talent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-[var(--text-primary)] text-base truncate flex items-center gap-1.5">
                    {talent.fullName || talent.username}
                    {talent.stats?.certificates > 0 && (
                      <span title="Certifié SHA-256 MLAcademy">
                        <ShieldCheck className="w-4 h-4 text-[var(--brand-500)] inline-block" />
                      </span>
                    )}
                  </h4>
                  <p className="text-xs font-medium text-[var(--text-secondary)] line-clamp-1">{talent.headline || "Apprenant ML & Data Science"}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {talent.rankName || "Bronze"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {talent.level === 'advanced' ? 'Avancé' : talent.level === 'intermediate' ? 'Intermédiaire' : 'Débutant'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Badges */}
              {talent.skills && talent.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">Compétences clés :</p>
                  <div className="flex flex-wrap gap-1">
                    {talent.skills.slice(0, 5).map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-secondary)] text-center text-xs mb-4">
                <div>
                  <span className="block font-black text-[var(--text-primary)]">{talent.stats?.coursesCompleted || 0}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase">Cours</span>
                </div>
                <div>
                  <span className="block font-black text-[var(--brand-500)]">{talent.stats?.certificates || 0}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase">Diplômes</span>
                </div>
                <div>
                  <span className="block font-black text-amber-600">{talent.stats?.challengesWon || 0}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase">Gagnés</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
                {talent.github_url ? (
                  <a
                    href={talent.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--brand-500)] flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <div />}

                <button
                  onClick={() => handleStartDirectMessage(talent)}
                  disabled={contactingId === talent.id}
                  className="btn-primary py-2 px-4 text-xs font-extrabold gap-1.5 shadow-md shadow-[var(--brand-glow)]"
                >
                  {contactingId === talent.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5" />
                  )}
                  Contacter en 1-Clic
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
