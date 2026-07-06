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
      className="card p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          {/* Company Logo Display */}
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--brand-50)] flex items-center justify-center text-[var(--brand-500)] font-bold shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}

          <div id="job-info-block">
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[var(--text-secondary)] text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[var(--text-tertiary)]" />
                {job.company_name}
              </span>
              <span className="text-[var(--border-default)]">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                {job.location}
              </span>
              {job.salary_range && (
                <>
                  <span className="text-[var(--border-default)]">•</span>
                  <span className="flex items-center gap-1.5 text-[var(--success)]">
                    <DollarSign className="w-4 h-4 text-[var(--success)]" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--success-light)] border border-[var(--success)] rounded-full text-[var(--success)] text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Postulé !</span>
            </div>
          ) : (
            <button
              id={`apply-job-btn-${job.id}`}
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="btn-primary py-2 px-5 text-sm uppercase tracking-wider"
            >
              <span>{showApplyForm ? "Fermer" : "Postuler"}</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[var(--text-secondary)] text-sm font-normal mt-5 leading-relaxed max-w-4xl">
        {job.description}
      </p>

      {/* Requirements List */}
      {requirementsArray.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-500)]">Exigences clés :</p>
          <ul className="mt-2.5 space-y-2 pl-1">
            {requirementsArray.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] mt-2 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Tags */}
      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[var(--border-subtle)]">
        {jobTags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md"
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
            className="mt-6 pt-6 border-t border-[var(--border-subtle)] space-y-5 overflow-hidden"
          >
            <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Candidature simplifiée</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Nom Complet *
                </label>
                <input
                  id={`apply-name-${job.id}`}
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Diallo"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Courriel de contact *
                </label>
                <input
                  id={`apply-email-${job.id}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amina@domaine.com"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Lien Profil LinkedIn ou GitHub
              </label>
              <input
                id={`apply-link-${job.id}`}
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Lettre de motivation courte (Optionnel)
              </label>
              <textarea
                id={`apply-comments-${job.id}`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Qu'est-ce qui vous passionne dans ce poste..."
                className="w-full px-4 py-3 rounded-md bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)] outline-none transition-all text-sm resize-none"
              />
            </div>

            <button
              id={`apply-submit-btn-${job.id}`}
              type="submit"
              disabled={applying}
              className="btn-primary w-full py-3"
            >
              {applying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
