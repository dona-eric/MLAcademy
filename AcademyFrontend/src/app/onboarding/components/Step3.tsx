"use client";

import React, { useState } from "react";
import { GraduationCap, Trash2, Languages } from "lucide-react";
import { LANGUAGE_LEVELS } from "@/types/constant";
import { OnboardingData } from "@/types/info";

interface Step3Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step3({ data, setData }: Step3Props) {
  const [newDiplome, setNewDiplome] = useState({ title: "", year: "", school: "" });
  const [showAdd, setShowAdd] = useState(false);

  const addDiplome = () => {
    if (!newDiplome.title.trim()) return;
    setData({
      ...data, 
      diplomes: [...data.diplomes, newDiplome]
    });
    setNewDiplome({ title: "", year: "", school: "" });
    setShowAdd(false);
  };

  const removeDiplome = (index: number) => {
    setData({
      ...data,
      diplomes: data.diplomes.filter((_, idx) => idx !== index)
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Diplômes & <span className="text-indigo-600">Certifications</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">Ajoutez vos diplômes ou certifications professionnelles.</p>
      </div>

      {/* Carte principale */}
      <div className="bg-white p-8 lg:p-10 rounded-[2rem] space-y-8 border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Liste de vos diplômes/certs
            </label>
            <button 
              type="button"
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors outline-none"
            >
              {showAdd ? "Annuler" : "+ Ajouter un diplôme"}
            </button>
          </div>

          {/* Formulaire d'ajout éphémère */}
          {showAdd && (
            <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50 space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
              <input 
                placeholder="Intitulé (ex: Licence, Certif GCP...)"
                value={newDiplome.title}
                onChange={(e) => setNewDiplome({...newDiplome, title: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="École/Organisme"
                  value={newDiplome.school}
                  onChange={(e) => setNewDiplome({...newDiplome, school: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <input 
                  placeholder="Année"
                  value={newDiplome.year}
                  onChange={(e) => setNewDiplome({...newDiplome, year: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button 
                type="button"
                onClick={addDiplome}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
              >
                Confirmer l'ajout
              </button>
            </div>
          )}

          {/* Liste des diplômes */}
          <div className="space-y-3">
            {data.diplomes.length === 0 && !showAdd && (
              <div className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl text-center py-6">
                Aucun diplôme ajouté pour le moment.
              </div>
            )}
            
            {data.diplomes.map((dip, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-200"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">{dip.title}</p>
                       <p className="text-xs font-medium text-slate-500">{dip.school} • {dip.year}</p>
                    </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => removeDiplome(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100"
                  aria-label="Supprimer le diplôme"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section Langues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {["french", "english"].map((lang) => (
            <div key={lang} className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Languages className="w-4 h-4" />
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                   {lang === "french" ? "Français" : "Anglais"}
                 </label>
              </div>
              <select 
                value={data.languages[lang as "french" | "english"]}
                onChange={(e) => setData({
                  ...data, 
                  languages: { ...data.languages, [lang]: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-900 transition-colors cursor-pointer"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-white">
                    {level}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}