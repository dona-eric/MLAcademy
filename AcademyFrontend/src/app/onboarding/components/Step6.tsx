"use client";

import React, { useState } from "react";
import { FileCheck, ShieldCheck } from "lucide-react";
import { OnboardingData } from "@/types/info";

interface Step6Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

type ToggleField = 'read' | 'accepted';

export default function Step6({ data, setData }: Step6Props) {
  const [checked, setChecked] = useState<Record<ToggleField, boolean>>({ read: false, accepted: false });

  const toggle = (field: ToggleField) => {
    const newState = { ...checked, [field]: !checked[field] };
    setChecked(newState);
    setData({ ...data, honorDeclaration: newState.read && newState.accepted });
  };

  const options = [
    { key: "read" as ToggleField, text: "J'ai lu et approuvé le règlement intérieur." },
    { key: "accepted" as ToggleField, text: "J'accepte les conditions de la formation certifiante." }
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* En-tête */}
<<<<<<< HEAD
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Règlements de la <span className="text-indigo-600">formation</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">Engagement officiel pour votre parcours certifiant.</p>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-[2rem] space-y-8 border border-slate-200 shadow-sm">
        {/* Charte de l'apprenant */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
           <h4 className="font-bold flex items-center gap-2 text-sm text-slate-900">
             <ShieldCheck className="w-5 h-5 text-indigo-600" />
             Charte de l'apprenant MLAcademy
           </h4>
           <div className="text-sm text-slate-600 font-medium leading-relaxed space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <p>1. Je certifie l'exactitude des informations fournies sur mon identité et mon parcours.</p>
              <p>2. Je m'engage à suivre le programme avec assiduité et à réaliser les projets dans les délais impartis.</p>
              <p>3. Je respecte le code de conduite de la communauté (bienveillance lors des peer-reviews).</p>
              <p>4. Je valide les pré-requis techniques nécessaires au suivi de cette formation.</p>
           </div>
        </div>

        {/* Boutons d'engagements */}
=======
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter">
          Règlements de la <span className="text-indigo-400">formation</span>
        </h2>
        <p className="text-slate-400 text-sm">Engagement officiel pour votre parcours certifiant.</p>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        {/* Charte de l'apprenant */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
           <h4 className="font-bold flex items-center gap-2 text-sm text-white">
             <ShieldCheck className="w-4 h-4 text-indigo-400" />
             Charte de l'apprenant MLAcademy
           </h4>
           <div className="text-[11px] text-slate-400 leading-relaxed space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              <p>1. Je certifie l'exactitude des informations fournies.</p>
              <p>2. Je m'engage à suivre le programme avec assiduité.</p>
              <p>3. Je respecte le code de conduite de la communauté.</p>
              <p>4. Je valide les pré-requis techniques de la formation.</p>
           </div>
        </div>

        {/* Boutons d'engagements (Boucle pour éviter de dupliquer le HTML) */}
>>>>>>> develop
        <div className="space-y-3">
          {options.map(({ key, text }) => {
            const isActive = checked[key];
            return (
              <button 
                key={key}
<<<<<<< HEAD
                type="button"
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  isActive ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  isActive ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                }`}>
                  {isActive && <FileCheck className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-bold ${isActive ? 'text-indigo-800' : 'text-slate-600'}`}>{text}</span>
=======
                type="button" // Empêche de soumettre par erreur le formulaire
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  isActive ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'
                }`}>
                  {isActive && <FileCheck className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-300">{text}</span>
>>>>>>> develop
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}