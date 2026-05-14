"use client";

import { useState } from "react";
import { FileCheck, ShieldCheck } from "lucide-react";
import { OnboardingData } from "@/types/info";

export default function Step6({ data, setData }: { data: OnboardingData, setData: any }) {
  const [checked, setChecked] = useState({ read: false, accepted: false });

  const toggle = (field: 'read' | 'accepted') => {
    const newState = { ...checked, [field]: !checked[field] };
    setChecked(newState);
    setData({ ...data, honorDeclaration: newState.read && newState.accepted });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter">Règlements de la <span className="text-indigo-400">formation</span></h2>
        <p className="text-slate-400 text-sm">Engagement officiel pour votre parcours certifiant.</p>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
           <h4 className="font-bold flex items-center gap-2 text-sm">
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

        <div className="space-y-3">
          <button 
            onClick={() => toggle('read')}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${checked.read ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${checked.read ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
              {checked.read && <FileCheck className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs font-bold text-slate-300">J'ai lu et approuvé le règlement intérieur.</span>
          </button>

          <button 
            onClick={() => toggle('accepted')}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${checked.accepted ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${checked.accepted ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
              {checked.accepted && <FileCheck className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs font-bold text-slate-300">J'accepte les conditions de la formation certifiante.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
