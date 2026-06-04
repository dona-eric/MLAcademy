"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { User, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function InstructorSettingsPage() {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: (user as any)?.bio || "",
    linkedin_url: (user as any)?.linkedin_url || "",
    github_url: (user as any)?.github_url || "",
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await fetchApi("/api/private/users/me/", {
        method: "PATCH",
        body: JSON.stringify(profileForm),
      });
      await checkAuth();
      setSuccess("Profil mis à jour avec succès.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-3xl mx-auto space-y-10">
      <div className="pb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez votre profil public et vos préférences.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-md text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Profil */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <User className="w-4 h-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Profil public</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Prénom</label>
              <input type="text" value={profileForm.first_name} onChange={(e) => setProfileForm(p => ({ ...p, first_name: e.target.value }))} className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nom</label>
              <input type="text" value={profileForm.last_name}
                onChange={(e) => setProfileForm(p => ({ ...p, last_name: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Biographie</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
              rows={4}
              placeholder="Décrivez votre expertise et votre parcours en quelques phrases..."
              className="w-full bg-white border border-slate-300 rounded-md py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">LinkedIn</label>
            <input
              type="url"
              value={profileForm.linkedin_url}
              onChange={(e) => setProfileForm(p => ({ ...p, linkedin_url: e.target.value }))}
              placeholder="https://linkedin.com/in/votre-profil"
              className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">GitHub</label>
            <input
              type="url"
              value={profileForm.github_url}
              onChange={(e) => setProfileForm(p => ({ ...p, github_url: e.target.value }))}
              placeholder="https://github.com/votre-compte"
              className="w-full bg-white border border-slate-300 rounded-md py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </section>

      {/* Compte */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Lock className="w-4 h-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Compte & Sécurité</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-900">Adresse email</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Authentification 2FA</p>
              <p className="text-xs text-slate-500">
                {(user as any)?.otp_enabled ? "Activée" : "Non activée"}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${(user as any)?.otp_enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {(user as any)?.otp_enabled ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
