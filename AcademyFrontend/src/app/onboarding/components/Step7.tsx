"use client";

import React from "react";
import { CheckCircle2, Rocket, Search } from "lucide-react";
import { OnboardingData } from "@/types/info";

const RECOMMENDED_COURSES = [
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

interface Step7Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step7({ data, setData }: Step7Props) {
  // Filtrage efficace des cours selon les domaines sélectionnés
  const filteredCourses = RECOMMENDED_COURSES.filter(
    c => data.domains.length === 0 || data.domains.includes(c.domain)
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Choisissez votre <span className="text-indigo-600">parcours</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Basé sur vos intérêts en <span className="text-indigo-600 font-bold">{data.domains.join(", ") || "tous nos domaines"}</span>, voici les formations recommandées.
        </p>
      </div>

      {/* Grille des formations */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const isSelected = data.selectedCourse === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setData({ ...data, selectedCourse: course.id })}
                className={`p-6 rounded-[2rem] border transition-all text-left relative group outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Rocket className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 animate-in fade-in zoom-in-75 duration-150" />}
                </div>
                <h3 className="font-black text-lg tracking-tight mb-1 text-slate-900">{course.title}</h3>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-3">{course.domain}</p>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm font-medium bg-slate-50 border border-slate-200 rounded-2xl">
          Aucune formation trouvée pour vos domaines sélectionnés.
        </div>
      )}

      {/* Option d'exploration libre */}
      <button 
        type="button"
        onClick={() => setData({ ...data, selectedCourse: "explore" })}
        className={`w-full flex items-center justify-center gap-2 p-5 rounded-2xl border border-dashed transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${
          data.selectedCourse === "explore" 
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
            : 'border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-slate-400'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="font-medium text-sm">Explorer tout le catalogue (cours gratuits & payants)</span>
      </button>
    </div>
  );
}