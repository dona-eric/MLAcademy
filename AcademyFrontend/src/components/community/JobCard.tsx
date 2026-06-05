import React, { useState } from "react";
import { JobOffer } from "@/types/community";
import { Building, MapPin, DollarSign, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";

interface JobCardProps {
  job: JobOffer;
  onApplySuccess?: () => void;
  key?: string | number;
}

export function JobCard({ job, onApplySuccess }: JobCardProps) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [comments, setComments] = useState("");

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    setApplying(true);
    try {
      await fetchApi(`/api/community/jobs/${job.id}/apply/`, {
        method: "POST",
        body: JSON.stringify({
          cover_letter: comments || `Candidature de ${fullName} pour le poste.`,
          cv_url: linkedin || "https://github.com",
        }),
      });
      setApplied(true);
      setShowApplyForm(false);
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const requirementsArray = job.requirements
    ? job.requirements.split(/[,\n]/).map(r => r.trim()).filter(Boolean)
    : [];

  const jobTags = [job.contract_type, job.location].filter(Boolean);

  return (
    <motion.div
      id={`job-card-${job.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden backdrop-blur-xl"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          {/* Company Logo Display */}
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 bg-slate-900"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-gradient-to-tr from-indigo-500/10 to-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}

          <div id="job-info-block">
            <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-slate-400 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                {job.company_name}
              </span>
              <span className="text-white/10">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {job.location}
              </span>
              {job.salary_range && (
                <>
                  <span className="text-white/10">•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {job.salary_range}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="self-start md:self-center shrink-0">
          {applied ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Postulé !</span>
            </div>
          ) : (
            <button
              id={`apply-job-btn-${job.id}`}
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/30 text-white font-bold rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-widest"
            >
              <span>{showApplyForm ? "Fermer" : "Postuler"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs font-normal mt-4 leading-relaxed max-w-4xl">
        {job.description}
      </p>

      {/* Requirements List */}
      {requirementsArray.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-400">Exigences clés :</p>
          <ul className="mt-2 space-y-1.5 pl-1">
            {requirementsArray.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Tags */}
      <div className="flex flex-wrap gap-2 mt-5">
        {jobTags.map((tag, i) => (
          <span
            key={i}
            className="px-2.5 py-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick Application Form Overlay/Drawer inside the card for super interactivity */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.form
            id={`apply-form-${job.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleApplySubmit}
            className="mt-6 pt-6 border-t border-white/5 space-y-4 overflow-hidden"
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Candidature simplifiée</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nom Complet *
                </label>
                <input
                  id={`apply-name-${job.id}`}
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Diallo"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Courriel de contact *
                </label>
                <input
                  id={`apply-email-${job.id}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amina.diallo@mlmail.sn"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Lien Profil LinkedIn ou GitHub
              </label>
              <input
                id={`apply-link-${job.id}`}
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Lettre de motivation courte (Optionnel)
              </label>
              <textarea
                id={`apply-comments-${job.id}`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Qu'est-ce qui vous passionne dans ce poste..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-xs resize-none"
              />
            </div>

            <button
              id={`apply-submit-btn-${job.id}`}
              type="submit"
              disabled={applying}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 disabled:bg-indigo-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {applying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Confirmer ma candidature</span>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
