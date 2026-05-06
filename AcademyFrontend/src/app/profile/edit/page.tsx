"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, fetchApi } from "@/lib/api";
import "./../../dashboard/dashboard.css";

type ProfileEditFormState = {
  first_name: string;
  last_name: string;
  bio: string;
  level: "beginner" | "intermediate" | "advanced";
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  personal_goals: string;
  is_public_profile: boolean;
};

const initialFormState: ProfileEditFormState = {
  first_name: "",
  last_name: "",
  bio: "",
  level: "beginner",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  personal_goals: "",
  is_public_profile: true,
};

function getErrorMessages(error: unknown): string[] {
  if (!error) return ["Une erreur inconnue est survenue."];

  if (error instanceof ApiError) {
    const data = error.data as unknown;

    if (Array.isArray(data)) {
      return data.map((item) => String(item));
    }

    if (typeof data === "string") {
      return [data];
    }

    if (data && typeof data === "object") {
      const payload = data as Record<string, unknown>;
      const messages: string[] = [];

      for (const [key, value] of Object.entries(payload)) {
        if (value === null || value === undefined) continue;

        const label =
          key === "first_name"
            ? "Prénom"
            : key === "last_name"
              ? "Nom"
              : key === "bio"
                ? "Biographie"
                : key === "linkedin_url"
                  ? "LinkedIn"
                  : key === "github_url"
                    ? "GitHub"
                    : key === "portfolio_url"
                      ? "Portfolio"
                      : key === "personal_goals"
                        ? "Objectif personnel"
                        : key === "is_public_profile"
                          ? "Visibilité du profil"
                          : key === "level"
                            ? "Niveau"
                            : key;

        if (typeof value === "string") {
          messages.push(`${label} : ${value}`);
          continue;
        }

        if (Array.isArray(value)) {
          messages.push(
            `${label} : ${value.map((item) => String(item)).join(" | ")}`
          );
          continue;
        }

        if (typeof value === "object") {
          messages.push(`${label} : ${JSON.stringify(value)}`);
        }
      }

      if (messages.length > 0) {
        return messages;
      }
    }

    return [error.message || `Erreur HTTP ${error.status}`];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ["Une erreur inattendue est survenue."];
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { user: profile, loading: authLoading, checkAuth } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] =
    useState<ProfileEditFormState>(initialFormState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!profile) {
      router.replace("/login");
      return;
    }

    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      bio: profile.bio || "",
      level: profile.level || "beginner",
      linkedin_url: profile.linkedin_url || "",
      github_url: profile.github_url || "",
      portfolio_url: profile.portfolio_url || "",
      personal_goals: profile.personal_goals || "",
      is_public_profile: Boolean(profile.is_public_profile),
    });

    setPageLoading(false);
  }, [authLoading, profile, router]);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) {
      router.replace("/login");
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setSaved(false);

    try {
      const payload = new FormData();
      payload.append("first_name", formData.first_name);
      payload.append("last_name", formData.last_name);
      payload.append("bio", formData.bio);
      payload.append("level", formData.level);
      payload.append("linkedin_url", formData.linkedin_url);
      payload.append("github_url", formData.github_url);
      payload.append("portfolio_url", formData.portfolio_url);
      payload.append("personal_goals", formData.personal_goals);
      payload.append(
        "is_public_profile",
        formData.is_public_profile ? "true" : "false"
      );

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      await fetchApi("/api/users/me/", {
        method: "PATCH",
        body: payload,
      });

      await checkAuth();
      setSaved(true);
      router.push("/dashboard");
    } catch (error: unknown) {
      setErrors(getErrorMessages(error));
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="full-screen-center">
        Chargement de votre profil...
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card glass-panel">
        <div className="onboarding-header">
          <h1 className="text-gradient">Modifier mon profil</h1>
          <p className="text-secondary">
            Mettez à jour votre profil public et vos informations personnelles.
          </p>
        </div>

        {saved && (
          <div className="alert-error" style={{ color: "#16a34a" }}>
            Vos modifications ont été enregistrées avec succès.
          </div>
        )}

        {errors.length > 0 && (
          <div className="alert-error">
            <strong>Veuillez corriger les erreurs suivantes :</strong>
            <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1.25rem" }}>
              {errors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              value={profile?.email || ""}
              disabled
              readOnly
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Prénom</label>
              <input
                id="first_name"
                name="first_name"
                className="form-input"
                value={formData.first_name}
                onChange={handleTextChange}
                placeholder="Votre prénom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Nom</label>
              <input
                id="last_name"
                name="last_name"
                className="form-input"
                value={formData.last_name}
                onChange={handleTextChange}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="form-input"
              value={formData.bio}
              onChange={handleTextChange}
              placeholder="Parlez un peu de vous..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">
              Votre niveau actuel en Data Science / IA
            </label>
            <select
              id="level"
              name="level"
              className="form-input"
              value={formData.level}
              onChange={handleTextChange}
              required
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="personal_goals">Objectif principal</label>
            <input
              id="personal_goals"
              name="personal_goals"
              className="form-input"
              value={formData.personal_goals}
              onChange={handleTextChange}
              placeholder="Ex : Trouver un poste en Machine Learning"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="github_url">Lien GitHub</label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                className="form-input"
                value={formData.github_url}
                onChange={handleTextChange}
                placeholder="https://github.com/votre-pseudo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin_url">Lien LinkedIn</label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                className="form-input"
                value={formData.linkedin_url}
                onChange={handleTextChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="portfolio_url">Portfolio</label>
            <input
              type="url"
              id="portfolio_url"
              name="portfolio_url"
              className="form-input"
              value={formData.portfolio_url}
              onChange={handleTextChange}
              placeholder="https://votre-portfolio.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Photo de profil</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input
              type="checkbox"
              id="is_public_profile"
              name="is_public_profile"
              checked={formData.is_public_profile}
              onChange={handleCheckboxChange}
              style={{ width: "18px", height: "18px" }}
            />
            <label htmlFor="is_public_profile" style={{ marginBottom: 0 }}>
              Rendre mon profil public
            </label>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>

            <Link href="/dashboard" className="btn btn-secondary btn-block">
              Retour au tableau de bord
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
