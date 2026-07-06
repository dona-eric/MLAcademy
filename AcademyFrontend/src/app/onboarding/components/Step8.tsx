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
<<<<<<< HEAD
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Mode de <span className="text-indigo-600">financement</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">Comment souhaitez-vous régler votre formation ?</p>
      </div>

      {/* Options de financement */}
      <div className="space-y-4">
=======
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
>>>>>>> develop
        {FUNDING_OPTIONS.map((option) => {
          const isSelected = data.funding === option.id;
          return (
            <button
              key={option.id}
<<<<<<< HEAD
              type="button"
              onClick={() => setData({ ...data, funding: option.id })}
              className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300'
              }`}
            >
              <div>
                <h3 className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{option.label}</h3>
                <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{option.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-300'
=======
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
>>>>>>> develop
              }`}>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-white animate-in fade-in zoom-in-75 duration-150" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Section CTA finale */}
<<<<<<< HEAD
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 text-center space-y-5 shadow-sm mt-8">
         <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <Rocket className="w-8 h-8" />
         </div>
         <h3 className="text-2xl font-black tracking-tight text-slate-900">Prêt à décoller ?</h3>
         <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
           En cliquant sur "Terminer l'inscription" ci-dessous, vous allez être redirigé vers votre tout nouveau tableau de bord.
=======
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-center space-y-4">
         <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <Rocket className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-black tracking-tighter text-white">Prêt à décoller ?</h3>
         <p className="text-sm text-slate-300">
           En cliquant sur "Terminer l'inscription", vous allez être redirigé vers votre tableau de bord personnalisé.
>>>>>>> develop
         </p>
      </div>
    </div>
  );
}