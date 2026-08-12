"use client";

import React, { useState } from "react";
import { X, Building2, Globe, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (company: any) => void;
}

export default function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom de l'entreprise est obligatoire.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi("/api/community/companies/", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          website: website.trim(),
          location: location.trim() || "Afrique / Remote",
        }),
      });

      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error("Failed to create company", err);
      setError(err?.message || "Une erreur est survenue lors de l'enregistrement de l'entreprise.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[var(--border-subtle)] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-50)] text-[var(--brand-500)] flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Créer votre Entreprise</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Rejoignez l'écosystème B2B MLAcademy</p>
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
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Nom de l'entreprise *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                required
                placeholder="Ex: AfriTech AI, DataCorp..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-10 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Siège Social / Localisation
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Ex: Cotonou, Bénin ou Full Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input pl-10 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Site Web
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
              <input type="url" placeholder="https://votre-entreprise.com" value={website} onChange={(e) => setWebsite(e.target.value)} className="input pl-10 text-sm font-medium"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
              Présentation de l'entreprise
            </label>
            <textarea rows={3} placeholder="Décrivez brièvement les activités, la vision et les opportunités tech..." value={description} onChange={(e) => setDescription(e.target.value)} className="input text-sm font-medium p-3"/>
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Créer & Valider
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
