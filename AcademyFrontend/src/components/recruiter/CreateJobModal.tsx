"use client";

import React, { useState } from "react";
import { X, Briefcase, MapPin, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { JobOffer } from "@/types/community";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: JobOffer) => void;
}

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState<'CDI' | 'CDD' | 'STAGE' | 'FREELANCE'>("CDI");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Le titre et la description du poste sont obligatoires.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi("/api/community/jobs/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          contract_type: contractType,
          location: location.trim() || "Remote",
          salary_range: salaryRange.trim() || "À négocier",
          description: description.trim(),
          requirements: requirements.trim(),
        }),
      });

      onSuccess(data);
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setRequirements("");
      setLocation("");
      setSalaryRange("");
    } catch (err: any) {
      console.error("Failed to create job offer", err);
      setError(err?.message || "Erreur lors de la publication de l'offre.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[var(--border-subtle)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-50)] text-[var(--brand-500)] flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Publier une Offre d'Emploi</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Recrutez les meilleurs talents MLAcademy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                Intitulé du poste *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Lead Data Scientist, Machine Learning Engineer..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                Type de contrat *
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="input text-sm font-medium"
              >
                <option value="CDI">CDI (Temps plein)</option>
                <option value="CDD">CDD</option>
                <option value="STAGE">Stage de fin d'études / PFE</option>
                <option value="FREELANCE">Freelance / Mission</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                Lieu de travail
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Ex: Cotonou, Dakar ou Télétravail"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input pl-10 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                Fourchette de salaire
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Ex: 500k - 800k FCFA / mois"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="input pl-10 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Description du poste *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Présentez les missions principales, l'équipe et le contexte du projet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input text-sm font-medium p-3"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Prérequis & Compétences clés
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Maîtrise de Python, PyTorch, SQL, Docker, Expérience en déploiement d'API ML..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="input text-sm font-medium p-3"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2.5 px-5 text-sm font-bold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 text-sm font-bold gap-2 shadow-lg shadow-[var(--brand-glow)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publication...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Publier l'offre
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
