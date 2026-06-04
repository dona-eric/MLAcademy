export const DOMAINS = [
  "Data",
  "Design & UX",
  "Marketing Digital",
  "Développement Web",
  "Supply Chain & Logistique",
  "Développement Personnel & Leadership",
  "Business & Management",
  "Cybersécurité",
  "Intelligence Artificielle",
  "Cloud & DevOps",
  "Gestion de Projet",
  "Finance & Comptabilité",
];

export const EXPERTISE_OPTIONS = [
  { id: "machine_learning", label: "Machine Learning" },
  { id: "deep_learning", label: "Deep Learning" },
  { id: "data_science", label: "Data Science" },
  { id: "nlp", label: "NLP / Traitement du langage" },
  { id: "computer_vision", label: "Vision par ordinateur" },
  { id: "mlops", label: "MLOps / Déploiement" },
  { id: "mathematics", label: "Mathématiques pour le ML" },
  { id: "python", label: "Python & Data Engineering" },
  { id: "other", label: "Autre" },
];

export const LANGUAGE_LEVELS = [
  "A1-A2 : Débutant",
  "B1-B2 : Intermédiaire",
  "C1 : Avancé",
  "C2 : Professionnel",
  "Langue maternelle"
];

export const SITUATIONS = ["Étudiant", "Salarié", "Indépendant", "En recherche d'emploi", "En reconversion"];
export const EXPERIENCES = ["Aucune expérience", "Junior (moins de 2 ans)", "Confirmé (2 à 5 ans)", "Senior (plus de 5 ans)"];
export const COUNTRIES = ["Bénin", "Sénégal", "Côte d'Ivoire", "France", "Canada", "Europe (Zone)"];
export const SPECIFIC_STATUSES = ["Réfugié", "Situation de handicap", "Ancien militaire", "Sportif de haut niveau", "Aucun"];

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  professional: "Professionnel",
};

export const ORDERING_OPTIONS = [
  { label: "Plus récents", value: "-created_at" },
  { label: "Mieux notés", value: "-avg_rating" },
  { label: "Plus populaires", value: "-enrolled_count" },
];

export const RECOMMENDED_COURSES = [
  { id: "ai-bootcamp", title: "AI Engineer Bootcamp", domain: "Intelligence Artificielle", duration: "6 mois", level: "Avancé" },
  { id: "data-analyst", title: "Data Analyst Pro", domain: "Data Science", duration: "4 mois", level: "Intermédiaire" },
  { id: "fullstack-next", title: "Fullstack Next.js & Django", domain: "Développement Web", duration: "5 mois", level: "Tous niveaux" },
  { id: "cyber-defense", title: "Expert en Cybersécurité", domain: "Cybersécurité", duration: "8 mois", level: "Expert" },
  { id: "ux-design", title: "UX/UI Design Avancé", domain: "Design & UX", duration: "4 mois", level: "Intermédiaire" },
  { id: "marketing-growth", title: "Growth Marketing & SEO", domain: "Marketing Digital", duration: "3 mois", level: "Débutant" },
  { id: "supply-chain", title: "Supply Chain Management", domain: "Supply Chain & Logistique", duration: "5 mois", level: "Intermédiaire" },
  { id: "leadership", title: "Leadership & Management", domain: "Développement Personnel & Leadership", duration: "3 mois", level: "Tous niveaux" },
  { id: "cloud-devops", title: "Cloud & DevOps Engineer", domain: "Cloud & DevOps", duration: "6 mois", level: "Avancé" },
  { id: "business-strat", title: "Stratégie Business & Innovation", domain: "Business & Management", duration: "4 mois", level: "Intermédiaire" },
  { id: "gestion-projet", title: "Chef de Projet Digital", domain: "Gestion de Projet", duration: "4 mois", level: "Tous niveaux" },
  { id: "finance-compta", title: "Finance & Analyse Financière", domain: "Finance & Comptabilité", duration: "5 mois", level: "Intermédiaire" },
];