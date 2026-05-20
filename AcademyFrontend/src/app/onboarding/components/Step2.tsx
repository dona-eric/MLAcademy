"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react";
import { OnboardingData } from "@/types/info";

interface Step2Props {
  data: OnboardingData;
  // Typage plus précis que 'any' pour la fonction de mise à jour React
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step2({ data, setData }: Step2Props) {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">
          Vos <span className="text-indigo-400">informations</span> personnelles
        </h2>
        <p className="text-slate-400 text-sm">Pour vous contacter et personnaliser votre expérience.</p>
      </div>

      {/* Carte de Formulaire */}
      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        
        {/* Numéro de téléphone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Numéro de téléphone
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="tel" 
              value={data.phone}
              onChange={(e) => setData({...data, phone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:bg-white/10 outline-none transition-all text-white"
              placeholder="+229 00 00 00 00"
            />
          </div>
        </div>

        {/* Sélection du Genre */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Genre
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Masculin", "Féminin", "Non-binaire", "Privé"].map((g) => (
              <button 
                key={g}
                type="button" // Important : Évite de soumettre le formulaire au clic
                onClick={() => setData({...data, gender: g})}
                className={`py-3 rounded-xl border text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  data.gender === g 
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section Adresse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rue / Adresse principale */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Adresse
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                value={data.address.street}
                onChange={(e) => setData({...data, address: {...data.address, street: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:bg-white/10 outline-none transition-all text-white"
                placeholder="Rue, Quartier"
              />
            </div>
          </div>

          {/* Ville & Pays */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Ville
              </label>
              <input 
                value={data.address.city}
                onChange={(e) => setData({...data, address: {...data.address, city: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white/10 outline-none transition-all text-white"
                placeholder="Cotonou"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Pays
              </label>
              <input 
                value={data.address.country}
                onChange={(e) => setData({...data, address: {...data.address, country: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white/10 outline-none transition-all text-white"
                placeholder="Bénin"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}