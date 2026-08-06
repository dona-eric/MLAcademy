import React, { useState } from "react";
import { JobOffer } from "@/types/community";
import { Building, MapPin, DollarSign, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";

interface JobCardProps {
  job: JobOffer;
  onApplySuccess?: () => void;
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
      className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:border-[#c0c1ff]/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          {/* Company Logo */}
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 bg-slate-950"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] font-bold shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}

          <div id="job-info-block">
            <h3 className="text-xl font-black text-white tracking-tight">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[#c7c4d7] text-sm font-medium">
              <span className="flex items-center gap-1.5 text-white">
                <Building className="w-4 h-4 text-[#5de6ff]" />
                {job.company_name}
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#c0c1ff]" />
                {job.location}
              </span>
              {job.salary_range && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="flex items-center gap-1.5 text-[#5de6ff] font-bold">
                    <DollarSign className="w-4 h-4 text-[#5de6ff]" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5de6ff]/20 border border-[#5de6ff] rounded-full text-[#5de6ff] text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Postulé !</span>
            </div>
          ) : (
            <button
              id={`apply-job-btn-${job.id}`}
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="bg-[#c0c1ff] hover:bg-[#a2eeff] text-[#07006c] font-black py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-1"
            >
              <span>{showApplyForm ? "Fermer" : "Postuler"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#c7c4d7] text-sm font-normal mt-5 leading-relaxed max-w-4xl">
        {job.description}
      </p>

      {/* Requirements List */}
      {requirementsArray.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5de6ff]">Exigences clés :</p>
          <ul className="mt-2.5 space-y-2 pl-1">
            {requirementsArray.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#c7c4d7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5de6ff] mt-2 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Tags */}
      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
        {jobTags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-bold text-[#c7c4d7] bg-white/5 border border-white/10 rounded-full uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick Application Form */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.form
            id={`apply-form-${job.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleApplySubmit}
            className="mt-6 pt-6 border-t border-white/10 space-y-5 overflow-hidden"
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Candidature simplifiée</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#c7c4d7] uppercase tracking-wider mb-2">
                  Nom Complet *
                </label>
                <input
                  id={`apply-name-${job.id}`}
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Diallo"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#908fa0] text-sm focus:border-[#5de6ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c7c4d7] uppercase tracking-wider mb-2">
                  Courriel de contact *
                </label>
                <input
                  id={`apply-email-${job.id}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amina@domaine.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#908fa0] text-sm focus:border-[#5de6ff] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Lien Profil LinkedIn ou GitHub
              </label>
              <input
                id={`apply-link-${job.id}`}
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#908fa0] text-sm focus:border-[#5de6ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Lettre de motivation courte (Optionnel)
              </label>
              <textarea
                id={`apply-comments-${job.id}`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Qu'est-ce qui vous passionne dans ce poste..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-[#908fa0] text-sm focus:border-[#5de6ff] outline-none resize-none"
              />
            </div>

            <button
              id={`apply-submit-btn-${job.id}`}
              type="submit"
              disabled={applying}
              className="w-full bg-[#5de6ff] text-[#001f25] font-black py-3.5 rounded-xl uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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
