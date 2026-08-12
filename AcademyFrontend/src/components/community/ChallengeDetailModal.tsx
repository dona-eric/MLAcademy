"use client"; 
import React, { useState, useEffect } from "react";
import { SponsoredChallenge, ChallengeSubmission } from "@/types/community";
import {X, Trophy, Calendar, Users, ExternalLink, ShieldCheck, Database, FileCode, Award, CheckCircle2, Loader2, Send, Sparkles, AlertCircle} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";

interface ChallengeDetailModalProps {
  challenge: SponsoredChallenge;
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess?: () => void;
}

export function ChallengeDetailModal({challenge, isOpen, onClose, onSubmissionSuccess,}: ChallengeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dataset' | 'leaderboard' | 'submit'>('overview');
  const [leaderboard, setLeaderboard] = useState<ChallengeSubmission[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Form submission state
  const [repoUrl, setRepoUrl] = useState("");
  const [notebookUrl, setNotebookUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [pdfReportUrl, setPdfReportUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [isOpen, activeTab]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const data = await fetchApi(`/api/community/challenges/${challenge.id}/leaderboard/`);
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load challenge leaderboard", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl && !notebookUrl && !description) {
      setErrorMessage("Veuillez fournir au moins un lien GitHub, un Notebook ou une description.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    try {
      await fetchApi(`/api/community/challenges/${challenge.id}/submit-solution/`, {
        method: "POST",
        body: JSON.stringify({
          repo_url: repoUrl,
          notebook_url: notebookUrl,
          demo_url: demoUrl,
          pdf_report_url: pdfReportUrl,
          description: description,
        }),
      });

      setSubmitSuccess(true);
      if (onSubmissionSuccess) onSubmissionSuccess();

      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('leaderboard');
        fetchLeaderboard();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Une erreur s'est produite lors de l'envoi de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const difficultyColors = {
    beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    expert: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl bg-[#122131] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Decorative Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#c0c1ff] via-[#5de6ff] to-[#c0c1ff]" />

          {/* Modal Header */}
          <div className="p-6 md:p-8 border-b border-white/10 bg-slate-950/40">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                {challenge.company_logo ? (
                  <img
                    src={challenge.company_logo}
                    alt={challenge.company_name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#c0c1ff]/10 border border-white/10 flex items-center justify-center text-[#c0c1ff] font-bold shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${difficultyColors[challenge.difficulty || 'intermediate']}`}>
                      {challenge.difficulty_display || challenge.difficulty}
                    </span>
                    {challenge.category_display && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-[#c7c4d7] border border-white/10">
                        {challenge.category_display}
                      </span>
                    )}
                    {challenge.ranking_tier && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {challenge.ranking_tier}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{challenge.title}</h2>
                  <p className="text-xs text-[#908fa0] mt-1 font-medium">Organisé par <span className="text-white font-bold">{challenge.company_name}</span></p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-[#908fa0] hover:text-white transition-colors p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5de6ff]/10 text-[#5de6ff] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#908fa0]">Prix Total</p>
                  <p className="text-sm font-black text-white">{challenge.prize_pool ? `${challenge.prize_pool} FCFA` : challenge.reward || "Récompenses"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#908fa0]">Date Limite</p>
                  <p className="text-sm font-black text-white">{challenge.deadline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#908fa0]">Soumissions</p>
                  <p className="text-sm font-black text-white">{challenge.submissions_count} participations</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#908fa0]">Mode Équipe</p>
                  <p className="text-sm font-black text-white">{challenge.allow_teams ? `Max ${challenge.max_team_size} p.` : "Individuel"}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 mt-6 gap-6 overflow-x-auto custom-scrollbar">
              {[
                { id: 'overview', label: 'Aperçu & Ratios' },
                { id: 'dataset', label: 'Dataset & Stack' },
                { id: 'leaderboard', label: 'Leaderboard 🏆' },
                { id: 'submit', label: 'Soumettre une Solution 🚀' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#5de6ff] text-[#5de6ff]"
                      : "border-transparent text-[#908fa0] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {challenge.short_description && (
                  <div className="bg-[#5de6ff]/5 border border-[#5de6ff]/20 p-4 rounded-xl text-sm text-[#5de6ff] font-medium leading-relaxed">
                    {challenge.short_description}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#c0c1ff] mb-2">Description du Challenge</h4>
                  <p className="text-sm text-[#c7c4d7] leading-relaxed whitespace-pre-line">{challenge.description}</p>
                </div>

                {challenge.objective && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#5de6ff] mb-2">Objectif Principal</h4>
                    <p className="text-sm text-[#c7c4d7] leading-relaxed whitespace-pre-line">{challenge.objective}</p>
                  </div>
                )}

                {/* Structured Prizes */}
                {(challenge.first_prize || challenge.second_prize || challenge.third_prize) && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Récompenses & Prix Détaillés
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {challenge.first_prize && (
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/30">
                          <span className="text-xl">🥇</span>
                          <p className="text-[10px] font-bold uppercase text-amber-400 mt-1">Premier Prix</p>
                          <p className="text-xs font-bold text-white mt-0.5">{challenge.first_prize}</p>
                        </div>
                      )}
                      {challenge.second_prize && (
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-400/30">
                          <span className="text-xl">🥈</span>
                          <p className="text-[10px] font-bold uppercase text-slate-300 mt-1">Deuxième Prix</p>
                          <p className="text-xs font-bold text-white mt-0.5">{challenge.second_prize}</p>
                        </div>
                      )}
                      {challenge.third_prize && (
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-700/30">
                          <span className="text-xl">🥉</span>
                          <p className="text-[10px] font-bold uppercase text-amber-600 mt-1">Troisième Prix</p>
                          <p className="text-xs font-bold text-white mt-0.5">{challenge.third_prize}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {challenge.rules && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#908fa0] mb-2">Règles & Conditions</h4>
                    <div className="bg-slate-950/60 border border-white/10 p-4 rounded-xl text-xs text-[#c7c4d7] leading-relaxed whitespace-pre-line font-mono">
                      {challenge.rules}
                    </div>
                  </div>
                )}

                {challenge.evaluation_criteria && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#908fa0] mb-2">Critères d'Évaluation</h4>
                    <p className="text-xs text-[#c7c4d7] leading-relaxed whitespace-pre-line">{challenge.evaluation_criteria}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DATASET & TECH STACK */}
            {activeTab === 'dataset' && (
              <div className="space-y-6">
                <div className="bg-slate-950/60 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-6 h-6 text-[#5de6ff]" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Données du Challenge</h4>
                        <p className="text-xs text-[#908fa0]">
                          {challenge.dataset_size ? `Taille: ${challenge.dataset_size}` : "Dataset disponible"}
                          {challenge.dataset_license && ` • Licence: ${challenge.dataset_license}`}
                        </p>
                      </div>
                    </div>

                    {challenge.dataset_url && (
                      <a
                        href={challenge.dataset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#5de6ff] hover:bg-[#a2eeff] text-[#001f25] font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                      >
                        <span>Télécharger</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Recommended Tech Stack */}
                {challenge.recommended_tech && challenge.recommended_tech.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#c0c1ff] mb-3 flex items-center gap-2">
                      <FileCode className="w-4 h-4" /> Technologies & Outils Recommandés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.recommended_tech.map((tech, i) => (
                        <span key={i} className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {challenge.deliverables && challenge.deliverables.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#908fa0] mb-3">Livrables Attendus</h4>
                    <ul className="space-y-2">
                      {challenge.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#c7c4d7]">
                          <CheckCircle2 className="w-4 h-4 text-[#5de6ff] shrink-0" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" /> Classement Public en Direct
                  </h4>
                  <span className="text-xs text-[#908fa0] font-mono">{leaderboard.length} Soumission(s) classée(s)</span>
                </div>

                {loadingLeaderboard ? (
                  <div className="py-16 text-center text-xs text-[#908fa0] flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#5de6ff]" />
                    <span>Chargement du classement...</span>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="bg-slate-950/60 border border-white/10 rounded-2xl py-16 text-center space-y-2">
                    <p className="text-sm text-white font-bold">Aucun score disponible pour le moment.</p>
                    <p className="text-xs text-[#908fa0]">Soyez le premier à soumettre votre solution pour inaugurer le classement !</p>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-wider text-[#908fa0] font-bold">
                          <th className="py-3.5 px-4">Rang</th>
                          <th className="py-3.5 px-4">Participant</th>
                          <th className="py-3.5 px-4">Score</th>
                          <th className="py-3.5 px-4 text-right">Lien Solution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {leaderboard.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold">
                              {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                                  {sub.user_avatar ? (
                                    <img src={sub.user_avatar} alt={sub.user_name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#5de6ff] font-bold text-[10px]">
                                      {sub.user_name?.[0] || "T"}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{sub.user_name || sub.username}</p>
                                  <p className="text-[10px] text-[#908fa0]">Soumis le {new Date(sub.submitted_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-[#5de6ff]">
                              {sub.score !== null ? sub.score : "En évaluation"}
                            </td>
                            <td className="py-4 px-4 text-right">
                              {sub.repo_url || sub.notebook_url ? (
                                <a
                                  href={sub.repo_url || sub.notebook_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#c0c1ff] hover:text-white font-bold"
                                >
                                  <span>Code</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[#908fa0]">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SUBMIT SOLUTION */}
            {activeTab === 'submit' && (
              <div className="space-y-6">
                {submitSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 bg-[#5de6ff]/20 rounded-full flex items-center justify-center text-[#5de6ff]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Soumission enregistrée !</h3>
                    <p className="text-xs text-[#c7c4d7]">Votre solution a été soumise avec succès et est en cours d'évaluation par le jury.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSolution} className="space-y-5">
                    {errorMessage && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Lien Dépôt GitHub / Code Source</label>
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/votre-compte/mon-modele"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-[#5de6ff] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Lien Notebook (Kaggle / Colab)</label>
                        <input
                          type="url"
                          value={notebookUrl}
                          onChange={(e) => setNotebookUrl(e.target.value)}
                          placeholder="https://kaggle.com/code/..."
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-[#5de6ff] outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Lien Démo Live / API (Optionnel)</label>
                        <input
                          type="url"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          placeholder="https://huggingface.co/spaces/..."
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-[#5de6ff] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Lien Rapport PDF / Présentation (Optionnel)</label>
                      <input
                        type="url"
                        value={pdfReportUrl}
                        onChange={(e) => setPdfReportUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-[#5de6ff] outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Note Explicative / Méthodologie</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Décrivez brièvement l'architecture de votre modèle, le pré-traitement des données et les métriques obtenues en validation..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#5de6ff] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-[#5de6ff] text-[#001f25] font-black text-sm uppercase tracking-wider hover:bg-[#a2eeff] transition-all shadow-[0_0_25px_rgba(93,230,255,0.3)] flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Envoyer ma Soumission Officielle</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
