"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react";
import { OnboardingData } from "@/types/info";
import { COUNTRIES } from "@/types/constant";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface Step2Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step2({ data, setData }: Step2Props) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Vos <span className="text-indigo-600">informations</span> personnelles
        </h2>
        <p className="text-slate-500 font-medium text-lg">Pour vous contacter et personnaliser votre expérience.</p>
      </div>

      {/* Carte de Formulaire */}
      <div className="bg-white p-8 lg:p-10 rounded-[2rem] space-y-8 border border-slate-200 shadow-sm">
        {/* Numéro de téléphone */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
            Numéro de téléphone
          </label>
          <div className="relative group flex items-center w-full">
            <PhoneInput
              defaultCountry="bj"
              value={data.phone}
              onChange={(phone) => setData({...data, phone})}
              inputClassName="!w-full !bg-slate-50 !border !border-slate-200 !rounded-r-xl !py-4 !text-sm focus:!border-indigo-500 focus:!bg-white focus:!ring-4 focus:!ring-indigo-500/10 !outline-none !transition-all !text-slate-900 placeholder:!text-slate-400 !font-medium !h-auto"
              countrySelectorStyleProps={{
                buttonClassName: "!bg-slate-50 !border !border-slate-200 !border-r-0 !rounded-l-xl !px-4 !h-auto focus:!bg-white focus:!border-indigo-500"
              }}
              className="w-full flex"
            />
          </div>
        </div>

        {/* Sélection du Genre */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
            Genre
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Masculin", "Féminin", "Non-binaire", "Privé"].map((g) => (
              <button 
                key={g}
                type="button"
                onClick={() => setData({...data, gender: g})}
                className={`py-4 rounded-xl border text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  data.gender === g 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 text-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section Adresse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Rue / Adresse principale */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Adresse
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                value={data.address.street}
                onChange={(e) => setData({...data, address: {...data.address, street: e.target.value}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                placeholder="Rue, Quartier"
              />
            </div>
          </div>

          {/* Ville & Pays */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Ville
              </label>
              <input 
                value={data.address.city}
                onChange={(e) => setData({...data, address: {...data.address, city: e.target.value}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                placeholder="Cotonou"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Pays
              </label>
              <select 
                value={data.address.country}
                onChange={(e) => setData({...data, address: {...data.address, country: e.target.value}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 cursor-pointer font-medium"
              >
                <option value="" disabled className="bg-white text-slate-400">Sélectionnez un pays...</option>
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-white">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}