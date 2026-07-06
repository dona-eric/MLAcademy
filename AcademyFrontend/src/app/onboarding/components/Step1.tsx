"use client";
import { CheckCircle2 } from "lucide-react";
import { DOMAINS } from "@/types/constant";
import { OnboardingData } from "@/types/info";

const plural = (count: number, word: string) =>
<<<<<<< HEAD
  '${count} ${word}${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}';

export default function Step1({ data, toggleDomain }: { data: OnboardingData; toggleDomain: (id: string) => void }) {
  return (
    <div className="space-y-8 text-center max-w-3xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Votre domaine de <span className="text-indigo-600">formation</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Sélectionnez le domaine qui vous intéresse le plus. Nous vous proposerons le parcours d'apprentissage adapté.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
=======
  `${count} ${word}${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`;

export default function Step1({ data, toggleDomain }: { data: OnboardingData; toggleDomain: (id: string) => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
          Votre domaine de <span className="text-indigo-400">formation</span>
        </h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          Sélectionnez le domaine qui correspond à votre objectif de carrière. Nous vous proposerons les formations adaptées.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
>>>>>>> develop
        {DOMAINS.map((domain) => {
          const isSelected = data.domains.includes(domain);
          return (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
<<<<<<< HEAD
              className={`relative py-5 px-4 rounded-2xl border transition-all text-center group flex items-center justify-center min-h-[80px] ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className={`text-sm font-bold tracking-tight ${isSelected ? "text-indigo-700" : "text-slate-600 group-hover:text-slate-900"}`}>
                {domain}
              </span>
              {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />}
=======
              className={`relative py-4 px-5 rounded-2xl border transition-all text-left group ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : "border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <span className={`text-xs font-bold tracking-tight ${isSelected ? "text-indigo-300" : "text-slate-300"}`}>
                {domain}
              </span>
              {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-400" />}
>>>>>>> develop
            </button>
          );
        })}
      </div>
<<<<<<< HEAD
=======

      {data.domains.length > 0 && (
        <p className="text-xs text-[var(--text-secondary)]">
          <span className="text-[var(--brand-500)] font-bold">{data.domains[0]}</span> sélectionné
        </p>
      )}
>>>>>>> develop
    </div>
  );
}