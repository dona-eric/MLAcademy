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
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">
          Diplômes & <span className="text-indigo-400">Certifications</span>
        </h2>
        <p className="text-slate-400 text-sm">Ajoutez vos diplômes ou certifications professionnelles.</p>
      </div>

      {/* Carte principale */}
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Liste de vos diplômes/certs
            </label>
            <button 
              type="button" // Empêche la soumission involontaire du formulaire
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] font-black uppercase text-indigo-400 hover:underline outline-none"
            >
              {showAdd ? "Annuler" : "+ Ajouter un diplôme"}
            </button>
          </div>

          {/* Formulaire d'ajout éphémère */}
          {showAdd && (
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <input 
                placeholder="Intitulé (ex: Licence, Certif GCP...)"
                value={newDiplome.title}
                onChange={(e) => setNewDiplome({...newDiplome, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 transition-colors text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="École/Organisme"
                  value={newDiplome.school}
                  onChange={(e) => setNewDiplome({...newDiplome, school: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 transition-colors text-white"
                />
                <input 
                  placeholder="Année"
                  value={newDiplome.year}
                  onChange={(e) => setNewDiplome({...newDiplome, year: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500 transition-colors text-white"
                />
              </div>
              <button 
                type="button" // Sécurise le comportement du bouton
                onClick={addDiplome}
                className="w-full py-3 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                Confirmer l'ajout
              </button>
            </div>
          )}

          {/* Liste des diplômes */}
          <div className="space-y-3">
            {data.diplomes.length === 0 && !showAdd && (
              <p className="text-xs text-slate-500 italic text-center py-4">Aucun diplôme ajouté pour le moment.</p>
            )}
            
            {data.diplomes.map((dip, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-200"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">{dip.title}</p>
                       <p className="text-xs text-slate-500">{dip.school} • {dip.year}</p>
                    </div>
                 </div>
                 <button 
                  type="button" // Évite les bugs de rafraîchissement au clic
                  onClick={() => removeDiplome(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100"
                  aria-label="Supprimer le diplôme"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Langues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["french", "english"].map((lang) => (
            <div key={lang} className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                 <Languages className="w-4 h-4" />
                 <label className="text-[10px] font-black uppercase tracking-widest">
                   {lang === "french" ? "Français" : "Anglais"}
                 </label>
              </div>
              <select 
                value={data.languages[lang as "french" | "english"]}
                onChange={(e) => setData({
                  ...data, 
                  languages: { ...data.languages, [lang]: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white/10 outline-none text-white transition-colors cursor-pointer"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-[#0A0F1C]">
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