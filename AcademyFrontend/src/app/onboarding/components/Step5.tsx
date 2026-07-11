"use client";

import React from "react";
import { Clock, Calendar } from "lucide-react";
import { OnboardingData } from "@/types/info";

interface Step5Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step5({ data, setData }: Step5Props) {
  const { availability } = data;

  const updateAvailability = (fields: object) => {
    setData({
      ...data,
      availability: { ...availability, ...fields }
    });
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter">
          Votre <span className="text-indigo-400">disponibilité</span>
        </h2>
        <p className="text-slate-400 text-sm">Le succès demande du temps. Combien pouvez-vous en consacrer ?</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Carte des disponibilités */}
        <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
           
           {/* Slider Heures */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heures par semaine</label>
                <span className="text-2xl font-black text-indigo-400">{availability.hoursPerWeek}h</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="5"
                value={availability.hoursPerWeek}
                onChange={(e) => updateAvailability({ hoursPerWeek: e.target.value })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Temps partiel</span>
                <span>Temps plein</span>
              </div>
           </div>

           {/* Date de début */}
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Date de début souhaitée
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="date"
                  value={availability.startDate}
                  onChange={(e) => updateAvailability({ startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-indigo-500 focus:bg-white/10 outline-none transition-all"
                />
              </div>
           </div>
        </div>

        {/* Note informative */}
        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
          <Clock className="w-6 h-6 text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-indigo-400 font-bold">Note :</span> Les formations intensives recommandent au moins 25h/semaine pour une progression optimale.
          </p>
        </div>
      </div>
    </div>
  );
}