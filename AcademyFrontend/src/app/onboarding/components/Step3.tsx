"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import { GraduationCap, Trash2, Languages } from "lucide-react";
=======
import { GraduationCap, Trash2, Languages, FolderGit2 } from "lucide-react";
>>>>>>> develop
import { LANGUAGE_LEVELS } from "@/types/constant";
import { OnboardingData } from "@/types/info";

interface Step3Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step3({ data, setData }: Step3Props) {
<<<<<<< HEAD
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
=======
  const [newDiplome, setNewDiplome] = useState({ title: "", year: "", school: "", mention: "" });
  const [showAddDiplome, setShowAddDiplome] = useState(false);

  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", year: "" });
  const [showAddProject, setShowAddProject] = useState(false);

  const addDiplome = () => {
    if (!newDiplome.title.trim()) return;
    if (typeof setData === "function") {
      setData({
        ...data,
        diplomes: [...(data.diplomes || []), newDiplome]
      });
    }
    setNewDiplome({ title: "", year: "", school: "", mention: "" });
    setShowAddDiplome(false);
  };

  const removeDiplome = (index: number) => {
    if (typeof setData === "function") {
      setData({
        ...data,
        diplomes: data.diplomes.filter((_, idx) => idx !== index)
      });
    }
  };

  const addProject = () => {
    if (!newProject.title.trim()) return;
    if (typeof setData === "function") {
      setData({
        ...data,
        projects: [...(data.projects || []), newProject]
      });
    }
    setNewProject({ title: "", description: "", link: "", year: "" });
    setShowAddProject(false);
  };

  const removeProject = (index: number) => {
    if (typeof setData === "function") {
      setData({
        ...data,
        projects: data.projects.filter((_, idx) => idx !== index)
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">
          Expériences & <span className="text-[var(--brand-500)]">Projets</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">Ajoutez vos diplômes, certifications et projets marquants.</p>
      </div>

      <div className="card p-8 space-y-8">
        
        {/* Section Diplômes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[var(--brand-500)]" /> Liste de vos diplômes/certs
            </label>
            <button 
              type="button" 
              onClick={() => setShowAddDiplome(!showAddDiplome)}
              className="text-[10px] font-black uppercase text-[var(--brand-500)] hover:underline outline-none"
            >
              {showAddDiplome ? "Annuler" : "+ Ajouter un diplôme"}
            </button>
          </div>

          {showAddDiplome && (
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
>>>>>>> develop
              <input 
                placeholder="Intitulé (ex: Licence, Certif GCP...)"
                value={newDiplome.title}
                onChange={(e) => setNewDiplome({...newDiplome, title: e.target.value})}
<<<<<<< HEAD
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <div className="grid grid-cols-2 gap-4">
=======
                className="input-field py-3 px-4 text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
>>>>>>> develop
                <input 
                  placeholder="École/Organisme"
                  value={newDiplome.school}
                  onChange={(e) => setNewDiplome({...newDiplome, school: e.target.value})}
<<<<<<< HEAD
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
=======
                  className="input-field py-3 px-4 text-sm"
                />
                <input 
                  placeholder="Mention (Optionnel)"
                  value={newDiplome.mention}
                  onChange={(e) => setNewDiplome({...newDiplome, mention: e.target.value})}
                  className="input-field py-3 px-4 text-sm"
>>>>>>> develop
                />
                <input 
                  placeholder="Année"
                  value={newDiplome.year}
                  onChange={(e) => setNewDiplome({...newDiplome, year: e.target.value})}
<<<<<<< HEAD
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors text-slate-900 placeholder:text-slate-400 font-medium"
=======
                  className="input-field py-3 px-4 text-sm"
>>>>>>> develop
                />
              </div>
              <button 
                type="button"
                onClick={addDiplome}
<<<<<<< HEAD
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
              >
                Confirmer l'ajout
=======
                className="btn-primary w-full py-3 text-xs"
              >
                Confirmer l'ajout du diplôme
>>>>>>> develop
              </button>
            </div>
          )}

<<<<<<< HEAD
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
=======
          <div className="space-y-3">
            {(!data.diplomes || data.diplomes.length === 0) && !showAddDiplome && (
              <p className="text-xs text-[var(--text-tertiary)] italic text-center py-4">Aucun diplôme ajouté pour le moment.</p>
            )}
            
            {(data.diplomes || []).map((dip, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-200"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-[var(--text-primary)]">{dip.title} {dip.mention && <span className="text-[10px] bg-[var(--brand-50)] text-[var(--brand-500)] px-2 py-0.5 rounded-full ml-2">{dip.mention}</span>}</p>
                       <p className="text-xs text-[var(--text-secondary)]">{dip.school} • {dip.year}</p>
>>>>>>> develop
                    </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => removeDiplome(idx)}
<<<<<<< HEAD
                  className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100"
                  aria-label="Supprimer le diplôme"
=======
                  className="p-2 text-[var(--error)] hover:bg-[var(--error-light)] rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100"
                  aria-label="Supprimer"
>>>>>>> develop
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <hr className="border-slate-100" />

        {/* Section Langues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {["french", "english"].map((lang) => (
            <div key={lang} className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Languages className="w-4 h-4" />
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
=======
        <hr className="border-[var(--border-subtle)]" />

        {/* Section Projets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[var(--brand-500)]" /> Liste de vos projets
            </label>
            <button 
              type="button" 
              onClick={() => setShowAddProject(!showAddProject)}
              className="text-[10px] font-black uppercase text-[var(--brand-500)] hover:underline outline-none"
            >
              {showAddProject ? "Annuler" : "+ Ajouter un projet"}
            </button>
          </div>

          {showAddProject && (
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  placeholder="Titre du projet (ex: Application IA Météo)"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="input-field py-3 px-4 text-sm"
                />
                <input 
                  placeholder="Année (ex: 2023)"
                  value={newProject.year}
                  onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                  className="input-field py-3 px-4 text-sm"
                />
              </div>
              <textarea 
                placeholder="Description rapide du projet, technologies utilisées, contexte (académique, perso, pro)..."
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="input-field py-3 px-4 text-sm min-h-[80px]"
              />
              <input 
                placeholder="Lien (GitHub, Portfolio, Drive...)"
                value={newProject.link}
                onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                className="input-field py-3 px-4 text-sm"
              />
              <button 
                type="button"
                onClick={addProject}
                className="btn-primary w-full py-3 text-xs"
              >
                Confirmer l'ajout du projet
              </button>
            </div>
          )}

          <div className="space-y-3">
            {(!data.projects || data.projects.length === 0) && !showAddProject && (
              <p className="text-xs text-[var(--text-tertiary)] italic text-center py-4">Aucun projet ajouté pour le moment.</p>
            )}
            
            {(data.projects || []).map((proj, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)] flex items-start justify-between group animate-in fade-in slide-in-from-top-2 duration-200"
              >
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] flex items-center justify-center shrink-0 mt-1">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-[var(--text-primary)]">{proj.title} <span className="text-xs text-[var(--text-secondary)] font-normal ml-2">{proj.year}</span></p>
                       <p className="text-xs text-[var(--text-secondary)] mt-1">{proj.description}</p>
                       {proj.link && (
                         <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--brand-500)] hover:underline mt-2 inline-block">
                           Voir le lien &rarr;
                         </a>
                       )}
                    </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="p-2 text-[var(--error)] hover:bg-[var(--error-light)] rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 outline-none focus:opacity-100 mt-1"
                  aria-label="Supprimer"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Section Langues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["french", "english"].map((lang) => (
            <div key={lang} className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--brand-500)]">
                 <Languages className="w-4 h-4" />
                 <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
>>>>>>> develop
                   {lang === "french" ? "Français" : "Anglais"}
                 </label>
              </div>
              <select 
                value={data.languages[lang as "french" | "english"]}
<<<<<<< HEAD
                onChange={(e) => setData({
                  ...data, 
                  languages: { ...data.languages, [lang]: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-900 transition-colors cursor-pointer"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-white">
=======
                onChange={(e) => {
                  if (typeof setData === "function") {
                    setData({
                      ...data, 
                      languages: { ...data.languages, [lang]: e.target.value }
                    });
                  }
                }}
                className="input-field py-4 px-4 text-sm cursor-pointer"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level}>
>>>>>>> develop
                    {level}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
<<<<<<< HEAD
=======

>>>>>>> develop
      </div>
    </div>
  );
}