"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  CheckCircle2,
  GithubIcon,
  LinkedinIcon,
  Rocket,
  ShieldCheck,
  Target,
  User,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user: profile, loading: authLoading, checkAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bio: "",
    level: "beginner",
    github_url: "",
    linkedin_url: "",
    personal_goals: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/login");
      return;
    }
    if (profile.bio && profile.bio.length > 10) router.push("/dashboard");
    else setLoading(false);
  }, [profile, authLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await fetchApi("/api/users/me/", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      await checkAuth();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
            <Rocket className="h-4 w-4" />
            Configuration de votre espace
          </div>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Bienvenue sur <span className="text-gradient">MLAcademy</span>.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            Complète ton profil pour personnaliser ton parcours d’apprentissage
            et mieux suivre ta progression.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Parcours ciblés", "Adapte les recommandations à ton niveau."],
              [
                "Expérience fluide",
                "Une interface claire sur mobile et desktop.",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-10">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              <ShieldCheck className="h-4 w-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Biographie courte
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <textarea
                    name="bio"
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="Je suis passionné par le Deep Learning..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Niveau en IA
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Objectif principal
                  </label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      name="personal_goals"
                      type="text"
                      value={formData.personal_goals}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      placeholder="Devenir Data Scientist"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GitHub (optionnel)
                  </label>
                  <div className="relative">
                    <GithubIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      name="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      placeholder="https://github.com/votre-pseudo"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    LinkedIn (optionnel)
                  </label>
                  <div className="relative">
                    <LinkedinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      name="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      placeholder="https://linkedin.com/in/votre-profil"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full py-4 text-sm"
            >
              {submitting ? "Finalisation..." : "Accéder à mon espace"}
            </button>

            <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Vos données sont sécurisées et modifiables à tout moment.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
