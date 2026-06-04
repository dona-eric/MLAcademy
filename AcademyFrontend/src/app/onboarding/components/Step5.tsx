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
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Votre <span className="text-indigo-600">disponibilité</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">Le succès demande du temps. Combien pouvez-vous en consacrer ?</p>
      </div>

      <div className="space-y-8">
        {/* Carte des disponibilités */}
        <div className="bg-white p-8 lg:p-10 rounded-[2rem] space-y-10 border border-slate-200 shadow-sm">
           
           {/* Slider Heures */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heures par semaine</label>
                <span className="text-3xl font-black text-indigo-600">{availability.hoursPerWeek}h</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="5"
                value={availability.hoursPerWeek}
                onChange={(e) => updateAvailability({ hoursPerWeek: e.target.value })}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Temps partiel</span>
                <span>Temps plein</span>
              </div>
           </div>

           <hr className="border-slate-100" />

           {/* Date de début */}
           <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Date de début souhaitée
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="date"
                  value={availability.startDate}
                  onChange={(e) => updateAvailability({ startDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                />
              </div>
           </div>
        </div>

        {/* Note informative */}
        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4 items-start shadow-sm">
          <Clock className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            <span className="text-indigo-700 font-bold">Note pédagogique :</span> Les formations intensives recommandent au moins 25h/semaine pour une progression optimale et une bonne intégration des concepts.
          </p>
        </div>
      </div>
    </div>
  );
}