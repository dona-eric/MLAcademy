"use client";

import React from "react";
import { CheckCircle2, Rocket } from "lucide-react";
import { OnboardingData } from "@/types/info";

const FUNDING_OPTIONS = [
  { id: "free_access", label: "Je veux juste explorer pour le moment", desc: "Accédez uniquement aux cours gratuits sans engagement." },
  { id: "personal", label: "Financement Personnel", desc: "Paiement en une ou plusieurs fois." },
  { id: "scholarship", label: "Bourse MLAcademy", desc: "Sous réserve d'éligibilité et de dossier." },
  { id: "company", label: "Pris en charge par l'entreprise", desc: "Facturation directe à votre employeur." },
];

interface Step8Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step8({ data, setData }: Step8Props) {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter">
          Mode de <span className="text-indigo-400">financement</span>
        </h2>
        <p className="text-slate-400 text-sm">Comment souhaitez-vous régler votre formation ?</p>
      </div>

      {/* Options de financement */}
      <div className="space-y-4 max-w-lg mx-auto">
        {FUNDING_OPTIONS.map((option) => {
          const isSelected = data.funding === option.id;
          return (
            <button
              key={option.id}
              type="button" // Essentiel : Évite une validation prématurée du formulaire
              onClick={() => setData({ ...data, funding: option.id })}
              className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <h3 className="font-bold text-sm text-slate-200">{option.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-white animate-in fade-in zoom-in-75 duration-150" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Section CTA finale */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-center space-y-4">
         <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <Rocket className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-black tracking-tighter text-white">Prêt à décoller ?</h3>
         <p className="text-sm text-slate-300">
           En cliquant sur "Terminer l'inscription", vous allez être redirigé vers votre tableau de bord personnalisé.
         </p>
      </div>
    </div>
  );
}