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
<<<<<<< HEAD
    const list = professional[field];
=======
    let list = professional[field];
    
    if (field === 'specificStatus') {
      if (val === "Aucun") {
        list = list.includes("Aucun") ? [] : ["Aucun"];
      } else {
        list = list.includes(val) ? list.filter(i => i !== val) : [...list.filter(i => i !== "Aucun"), val];
      }
      updateProfessional({ [field]: list });
      return;
    }

>>>>>>> develop
    const newList = list.includes(val) ? list.filter(i => i !== val) : [...list, val];
    updateProfessional({ [field]: newList });
  };

<<<<<<< HEAD
=======
  const isStudent = professional.situation === "Étudiant";

>>>>>>> develop
  const addExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    updateProfessional({ experience: [...professional.experience, newExp] });
    setNewExp(emptyExp);
    setShowAdd(false);
  };

  return (
<<<<<<< HEAD
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Parcours <span className="text-indigo-600">Professionnel</span>
        </h2>
        <p className="text-slate-500 font-medium text-lg">Détaillez vos expériences pour un profil complet.</p>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-[2rem] space-y-8 border border-slate-200 shadow-sm">
        {/* Situation Actuelle */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Situation actuelle</label>
          <select
            value={professional.situation}
            onChange={(e) => updateProfessional({ situation: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 text-slate-900 outline-none transition-all cursor-pointer"
          >
            <option value="" disabled className="bg-white text-slate-400">Sélectionnez...</option>
            {SITUATIONS.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
=======
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">Parcours <span className="text-[var(--brand-500)]">Professionnel</span></h2>
        <p className="text-[var(--text-secondary)] text-sm">Détaillez vos expériences pour un profil complet.</p>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
        {/* Situation Actuelle */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Situation actuelle</label>
          <select 
            value={professional.situation}
            onChange={(e) => updateProfessional({ situation: e.target.value })}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 px-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] text-[var(--text-primary)] outline-none"
          >
            <option value="" disabled className="bg-[var(--bg-primary)]">Sélectionnez...</option>
            {SITUATIONS.map(s => <option key={s} value={s} className="bg-[var(--bg-primary)]">{s}</option>)}
>>>>>>> develop
          </select>
        </div>

        {/* Expériences Détaillées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
<<<<<<< HEAD
            <div className="flex items-center gap-2 text-indigo-600">
              <Briefcase className="w-4 h-4" />
              <label className="text-[10px] font-bold uppercase tracking-widest">Expériences professionnelles</label>
            </div>
            <button type="button" onClick={() => setShowAdd(!showAdd)} className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors outline-none">
=======
             <div className="flex items-center gap-2 text-[var(--brand-500)]">
                <Briefcase className="w-4 h-4" />
                <label className="text-[10px] font-black uppercase tracking-widest">Expériences professionnelles</label>
             </div>
             <button type="button" onClick={() => setShowAdd(!showAdd)} className="text-[10px] font-black uppercase text-[var(--brand-500)] hover:underline">
>>>>>>> develop
              {showAdd ? "Annuler" : "+ Ajouter une expérience"}
            </button>
          </div>

          {showAdd && (
<<<<<<< HEAD
            <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50 space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["company", "role"].map(f => (
                  <input
                    key={f}
                    placeholder={f === "company" ? "Compagnie / Entreprise" : "Rôle / Poste"}
                    value={newExp[f as 'company' | 'role']}
                    onChange={(e) => setNewExp({ ...newExp, [f]: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  />
                ))}
              </div>
              <input
                placeholder="Durée (ex: 2 ans, Jan 2022 - Présent)"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
              />
              <textarea
                placeholder="Missions principales et réalisations..."
                value={newExp.missions}
                onChange={(e) => setNewExp({ ...newExp, missions: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors min-h-[80px]"
              />
              <button
                type="button"
                onClick={addExperience}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
              >
=======
            <div className="p-6 rounded-2xl border border-[var(--brand-500)]/30 bg-[var(--brand-50)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["company", "role"].map(f => (
                    <input key={f} placeholder={f === "company" ? (isStudent ? "École / Projet" : "Compagnie / Entreprise") : (isStudent ? "Stage / Formation" : "Rôle / Poste")} value={newExp[f as 'company' | 'role']} onChange={(e) => setNewExp({...newExp, [f]: e.target.value})} className="input-field py-3 px-4 text-sm" />
                  ))}
               </div>
               <input placeholder="Durée (ex: 2 ans, Jan 2022 - Présent)" value={newExp.duration} onChange={(e) => setNewExp({...newExp, duration: e.target.value})} className="input-field py-3 px-4 text-sm" />
               <textarea placeholder={isStudent ? "Ce que vous avez appris, vos réalisations..." : "Missions principales et réalisations..."} value={newExp.missions} onChange={(e) => setNewExp({...newExp, missions: e.target.value})} className="input-field py-3 px-4 text-sm min-h-[80px]" />
               <button type="button" onClick={addExperience} className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2">
>>>>>>> develop
                <Plus className="w-4 h-4" /> Enregistrer l'expérience
              </button>
            </div>
          )}

          <div className="space-y-3">
<<<<<<< HEAD
            {professional.experience.length === 0 && !showAdd && <div className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl text-center py-6">Aucune expérience ajoutée.</div>}
            {professional.experience.map((exp, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 group relative overflow-hidden transition-all hover:border-slate-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-indigo-700 tracking-tight">{exp.role}</h4>
                    <p className="text-xs font-bold text-slate-900 mt-1">{exp.company} <span className="text-slate-500 font-medium ml-2">• {exp.duration}</span></p>
                    {exp.missions && <p className="text-xs text-slate-600 mt-3 leading-relaxed border-l-2 border-slate-200 pl-4">{exp.missions}</p>}
                  </div>
                  <button type="button" onClick={() => updateProfessional({ experience: professional.experience.filter((_, i) => i !== idx) })} className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Permis de Travail (Boutons Pilules) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-indigo-600"><Globe className="w-4 h-4" /><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Permis de travail</label></div>
=======
             {professional.experience.length === 0 && !showAdd && <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">Aucune expérience ajoutée.</p>}
             {professional.experience.map((exp, idx) => (
               <div key={idx} className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] group relative overflow-hidden transition-all hover:border-white/10">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-black text-sm text-[var(--brand-500)] uppercase tracking-tight">{exp.role}</h4>
                        <p className="text-xs font-bold text-[var(--text-primary)] mt-1">{exp.company} <span className="text-[var(--text-secondary)] font-normal ml-2">• {exp.duration}</span></p>
                        {exp.missions && <p className="text-[11px] text-[var(--text-secondary)] mt-3 leading-relaxed border-l-2 border-white/10 pl-4">{exp.missions}</p>}
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
        <div className="space-y-4 pt-4 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-2 text-[var(--brand-500)]"><Globe className="w-4 h-4" /><label className="text-[10px] font-black uppercase tracking-widest">Permis de travail</label></div>
>>>>>>> develop
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => {
              const active = professional.workPermit.includes(c);
              return (
<<<<<<< HEAD
                <button key={c} type="button" onClick={() => toggleSelection('workPermit', c)} className={"px-4 py-2.5 rounded-full border text-xs font-bold transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${active ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-indigo-300'}"}>
=======
                <button key={c} type="button" onClick={() => toggleSelection('workPermit', c)} className={`px-4 py-2 rounded-full border text-[10px] font-bold transition-all outline-none ${active ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-500)]' : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-white/10'}`}>
>>>>>>> develop
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statuts Spécifiques (Grille Checkboxes) */}
<<<<<<< HEAD
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600"><Info className="w-4 h-4" /><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Statuts spécifiques</label></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPECIFIC_STATUSES.map(s => {
              const active = professional.specificStatus.includes(s);
              return (
                <button key={s} type="button" onClick={() => toggleSelection('specificStatus', s)} className={"flex items-center gap-3 p-4 rounded-xl border text-left transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${active ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300'}"}>
                  <div className={"w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${active ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}"} />
                  <span className={"text-sm font-bold ${active ? 'text-indigo-800' : 'text-slate-600'}"}>{s}</span>
                </button>
              );
            })}
=======
        <div className="space-y-4 pt-4 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-2 text-[var(--brand-500)]"><Info className="w-4 h-4" /><label className="text-[10px] font-black uppercase tracking-widest">Statuts spécifiques</label></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {SPECIFIC_STATUSES.map(s => {
                const active = professional.specificStatus.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSelection('specificStatus', s)} className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all outline-none ${active ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-[var(--border-default)] bg-[var(--bg-secondary)]'}`}>
                    <div className={`w-4 h-4 rounded-sm border transition-colors ${active ? 'bg-[var(--brand-500)] border-[var(--brand-500)]' : 'border-white/20'}`} />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">{s}</span>
                  </button>
                );
             })}
>>>>>>> develop
          </div>
        </div>
      </div>
    </div>
  );
}