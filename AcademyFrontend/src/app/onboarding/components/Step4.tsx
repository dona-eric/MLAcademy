"use client";

import React, { useState } from "react";
import { Briefcase, Globe, Info, Plus, Trash2 } from "lucide-react";
import { SITUATIONS, COUNTRIES, SPECIFIC_STATUSES } from "@/types/constant";
import { OnboardingData } from "@/types/info";

interface Step4Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

const emptyExp = { company: "", role: "", missions: "", duration: "" };

export default function Step4({ data, setData }: Step4Props) {
  const [newExp, setNewExp] = useState(emptyExp);
  const [showAdd, setShowAdd] = useState(false);
  const { professional } = data;

  const updateProfessional = (fields: object) => {
    setData({ ...data, professional: { ...professional, ...fields } });
  };

  const toggleSelection = (field: 'workPermit' | 'specificStatus', val: string) => {
    const list = professional[field];
    const newList = list.includes(val) ? list.filter(i => i !== val) : [...list, val];
    updateProfessional({ [field]: newList });
  };

  const addExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    updateProfessional({ experience: [...professional.experience, newExp] });
    setNewExp(emptyExp);
    setShowAdd(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">Parcours <span className="text-indigo-400">Professionnel</span></h2>
        <p className="text-slate-400 text-sm">Détaillez vos expériences pour un profil complet.</p>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
        {/* Situation Actuelle */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Situation actuelle</label>
          <select 
            value={professional.situation}
            onChange={(e) => updateProfessional({ situation: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white/10 text-white outline-none"
          >
            <option value="" disabled className="bg-[#0A0F1C]">Sélectionnez...</option>
            {SITUATIONS.map(s => <option key={s} value={s} className="bg-[#0A0F1C]">{s}</option>)}
          </select>
        </div>

        {/* Expériences Détaillées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-indigo-400">
                <Briefcase className="w-4 h-4" />
                <label className="text-[10px] font-black uppercase tracking-widest">Expériences professionnelles</label>
             </div>
             <button type="button" onClick={() => setShowAdd(!showAdd)} className="text-[10px] font-black uppercase text-indigo-400 hover:underline">
              {showAdd ? "Annuler" : "+ Ajouter une expérience"}
            </button>
          </div>

          {showAdd && (
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["company", "role"].map(f => (
                    <input key={f} placeholder={f === "company" ? "Compagnie / Entreprise" : "Rôle / Poste"} value={newExp[f as 'company' | 'role']} onChange={(e) => setNewExp({...newExp, [f]: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-500" />
                  ))}
               </div>
               <input placeholder="Durée (ex: 2 ans, Jan 2022 - Présent)" value={newExp.duration} onChange={(e) => setNewExp({...newExp, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-500" />
               <textarea placeholder="Missions principales et réalisations..." value={newExp.missions} onChange={(e) => setNewExp({...newExp, missions: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-500 min-h-[80px]" />
               <button type="button" onClick={addExperience} className="w-full py-3 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500/50">
                <Plus className="w-4 h-4" /> Enregistrer l'expérience
              </button>
            </div>
          )}

          <div className="space-y-3">
             {professional.experience.length === 0 && !showAdd && <p className="text-xs text-slate-500 italic text-center py-4">Aucune expérience ajoutée.</p>}
             {professional.experience.map((exp, idx) => (
               <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/5 group relative overflow-hidden transition-all hover:border-white/10">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-black text-sm text-indigo-400 uppercase tracking-tight">{exp.role}</h4>
                        <p className="text-xs font-bold text-slate-200 mt-1">{exp.company} <span className="text-slate-500 font-normal ml-2">• {exp.duration}</span></p>
                        {exp.missions && <p className="text-[11px] text-slate-400 mt-3 leading-relaxed border-l-2 border-white/10 pl-4">{exp.missions}</p>}
                     </div>
                     <button type="button" onClick={() => updateProfessional({ experience: professional.experience.filter((_, i) => i !== idx) })} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Permis de Travail (Boutons Pilules) */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-indigo-400"><Globe className="w-4 h-4" /><label className="text-[10px] font-black uppercase tracking-widest">Permis de travail</label></div>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => {
              const active = professional.workPermit.includes(c);
              return (
                <button key={c} type="button" onClick={() => toggleSelection('workPermit', c)} className={`px-4 py-2 rounded-full border text-[10px] font-bold transition-all outline-none ${active ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'}`}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statuts Spécifiques (Grille Checkboxes) */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-indigo-400"><Info className="w-4 h-4" /><label className="text-[10px] font-black uppercase tracking-widest">Statuts spécifiques</label></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {SPECIFIC_STATUSES.map(s => {
                const active = professional.specificStatus.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSelection('specificStatus', s)} className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all outline-none ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}>
                    <div className={`w-4 h-4 rounded-sm border transition-colors ${active ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`} />
                    <span className="text-xs font-medium text-slate-300">{s}</span>
                  </button>
                );
             })}
          </div>
        </div>
      </div>
    </div>
  );
}