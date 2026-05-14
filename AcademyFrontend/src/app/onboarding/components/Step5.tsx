"use client";

import { Clock, Calendar } from "lucide-react";
import { OnboardingData } from "@/types/info";

export default function Step5({ data, setData }: { data: OnboardingData, setData: any }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter">Votre <span className="text-indigo-400">disponibilité</span></h2>
        <p className="text-slate-400 text-sm">Le succès demande du temps. Combien pouvez-vous en consacrer ?</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heures par semaine</label>
                <span className="text-2xl font-black text-indigo-400">{data.availability.hoursPerWeek}h</span>
              </div>
              <input 
                type="range" min="5" max="40" step="5"
                value={data.availability.hoursPerWeek}
                onChange={(e) => setData({...data, availability: {...data.availability, hoursPerWeek: e.target.value}})}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Temps partiel</span>
                <span>Temps plein</span>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date de début souhaitée</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="date"
                  value={data.availability.startDate}
                  onChange={(e) => setData({...data, availability: {...data.availability, startDate: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
           </div>
        </div>

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
