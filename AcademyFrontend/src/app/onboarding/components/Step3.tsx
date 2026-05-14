"use client";

import { useState } from "react";
import { GraduationCap, Trash2, Languages } from "lucide-react";
import { LANGUAGE_LEVELS } from "@/types/constant";
import { OnboardingData } from "@/types/info";

export default function Step3({ data, setData }: { data: OnboardingData, setData: any }) {
  const [newDiplome, setNewDiplome] = useState({ title: "", year: "", school: "" });
  const [showAdd, setShowAdd] = useState(false);

  const addDiplome = () => {
    if (!newDiplome.title) return;
    setData({...data, diplomes: [...data.diplomes, newDiplome]});
    setNewDiplome({ title: "", year: "", school: "" });
    setShowAdd(false);
  };

  const removeDiplome = (index: number) => {
    const newList = [...data.diplomes];
    newList.splice(index, 1);
    setData({...data, diplomes: newList});
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">Diplômes & <span className="text-indigo-400">Certifications</span></h2>
        <p className="text-slate-400 text-sm">Ajoutez vos diplômes ou certifications professionnelles.</p>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Liste de vos diplômes/certs</label>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] font-black uppercase text-indigo-400 hover:underline"
            >
              {showAdd ? "Annuler" : "+ Ajouter un diplôme"}
            </button>
          </div>

          {showAdd && (
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4">
              <input 
                placeholder="Intitulé (ex: Licence, Certif GCP...)"
                value={newDiplome.title}
                onChange={(e) => setNewDiplome({...newDiplome, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="École/Organisme"
                  value={newDiplome.school}
                  onChange={(e) => setNewDiplome({...newDiplome, school: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500"
                />
                <input 
                  placeholder="Année"
                  value={newDiplome.year}
                  onChange={(e) => setNewDiplome({...newDiplome, year: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={addDiplome}
                className="w-full py-3 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all"
              >
                Confirmer l'ajout
              </button>
            </div>
          )}

          <div className="space-y-3">
            {data.diplomes.length === 0 && !showAdd && (
              <p className="text-xs text-slate-500 italic text-center py-4">Aucun diplôme ajouté pour le moment.</p>
            )}
            {data.diplomes.map((dip, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold">{dip.title}</p>
                       <p className="text-xs text-slate-500">{dip.school} • {dip.year}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => removeDiplome(idx)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
               <Languages className="w-4 h-4" />
               <label className="text-[10px] font-black uppercase tracking-widest">Français</label>
            </div>
            <select 
              value={data.languages.french}
              onChange={(e) => setData({...data, languages: {...data.languages, french: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 outline-none"
            >
              {LANGUAGE_LEVELS.map(l => <option key={l} value={l} className="bg-[#0A0F1C]">{l}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
               <Languages className="w-4 h-4" />
               <label className="text-[10px] font-black uppercase tracking-widest">Anglais</label>
            </div>
            <select 
              value={data.languages.english}
              onChange={(e) => setData({...data, languages: {...data.languages, english: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 outline-none"
            >
              {LANGUAGE_LEVELS.map(l => <option key={l} value={l} className="bg-[#0A0F1C]">{l}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
