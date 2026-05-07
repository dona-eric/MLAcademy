"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

type CategoryOption = {
  id: number;
  name: string;
};

export default function CreateCourseWizard() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Course Form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [isFree, setIsFree] = useState(false);
  const [durationHours, setDurationHours] = useState(0);

  useEffect(() => {
    // Load categories
    async function loadCategories() {
      try {
        const data = await fetchApi("/api/courses/categories/");
        const items = Array.isArray(data) ? data : (data.results ?? []);
        setCategories(items);
        if (items.length > 0) setCategoryId(String(items[0].id));
      } catch (err) {
        console.error("Impossible de charger les catégories");
      }
    }
    loadCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newCourse = await fetchApi("/api/instructor/courses/", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          short_description: shortDescription,
          description,
          category: parseInt(categoryId),
          level,
          is_free: isFree,
          duration_hours: durationHours,
        }),
      });
      // Redirect to course editor (not implemented yet, fallback to dashboard)
      router.push(`/instructor`);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div
      className="p-8 md:p-12"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <button
        onClick={() => router.back()}
        className="text-muted hover:text-white mb-6 flex items-center gap-2"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold mb-2">Créer un nouveau cours</h1>
      <p className="text-secondary mb-10">
        Remplissez les informations de base pour démarrer. Vous pourrez ajouter
        des modules et des leçons plus tard.
      </p>

      {error && <div className="alert-error mb-8">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 glass-panel p-8 rounded-2xl"
      >
        {/* Titre et Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Titre du cours *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Maîtriser le Deep Learning"
              className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none font-mono text-sm text-muted"
            />
          </div>
        </div>

        {/* Catégorie et Niveau */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Catégorie *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none appearance-none"
            >
              {safeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Niveau *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none appearance-none"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description courte *
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            maxLength={255}
            placeholder="Une phrase d'accroche résumant le cours"
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description complète *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Détaillez ce que l'étudiant va apprendre..."
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none resize-y"
          ></textarea>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
          <div>
            <label className="block text-sm font-medium mb-2">
              Durée estimée (heures)
            </label>
            <input
              type="number"
              min="0"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value))}
              className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex items-center h-full pt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-indigo-500 focus:ring-indigo-500 bg-black/40 mr-3"
              />
              <span className="font-medium">Cours Gratuit</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg py-4 mt-8"
        >
          {loading ? "Création en cours..." : "Créer le cours et continuer"}
        </button>
      </form>
    </div>
  );
}
