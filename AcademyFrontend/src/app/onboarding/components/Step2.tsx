<<<<<<< HEAD
"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react";
import { OnboardingData } from "@/types/info";
import { COUNTRIES } from "@/types/constant";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
=======
import React, { useState, useEffect } from "react";
import { Phone, MapPin, ChevronDown } from "lucide-react";
import { OnboardingData } from "@/types/info";

const AFRICAN_COUNTRIES = [
  { code: "BJ", name: "Bénin", dialCode: "+229", flag: "🇧🇯" },
  { code: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { code: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { code: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲" },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
  { code: "CG", name: "Congo", dialCode: "+242", flag: "🇨🇬" },
  { code: "CD", name: "RDC", dialCode: "+243", flag: "🇨🇩" },
  { code: "TD", name: "Tchad", dialCode: "+235", flag: "🇹🇩" },
  { code: "CF", name: "Centrafrique", dialCode: "+236", flag: "🇨🇫" },
  { code: "GN", name: "Guinée", dialCode: "+224", flag: "🇬🇳" },
  { code: "MR", name: "Mauritanie", dialCode: "+222", flag: "🇲🇷" },
  { code: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
  { code: "MA", name: "Maroc", dialCode: "+212", flag: "🇲🇦" },
  { code: "DZ", name: "Algérie", dialCode: "+213", flag: "🇩🇿" },
  { code: "TN", name: "Tunisie", dialCode: "+216", flag: "🇹🇳" },
  { code: "EG", name: "Égypte", dialCode: "+20", flag: "🇪🇬" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
  { code: "BI", name: "Burundi", dialCode: "+257", flag: "🇧🇮" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { code: "ET", name: "Éthiopie", dialCode: "+251", flag: "🇪🇹" },
  { code: "ZA", name: "Afrique du Sud", dialCode: "+27", flag: "🇿🇦" },
];
>>>>>>> develop

interface Step2Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step2({ data, setData }: Step2Props) {
<<<<<<< HEAD
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
=======
  const [selectedCountry, setSelectedCountry] = useState(AFRICAN_COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const matched = AFRICAN_COUNTRIES.find(c => data.phone.startsWith(c.dialCode));
    if (matched) {
      setSelectedCountry(matched);
      setPhoneNumber(data.phone.substring(matched.dialCode.length).trim());
    } else {
      setPhoneNumber(data.phone);
    }
  }, []);

  const handlePhoneChange = (num: string, country = selectedCountry) => {
    const cleanNum = num.replace(/\s+/g, "");
    setPhoneNumber(num);
    const updatedPhone = `${country.dialCode} ${cleanNum}`;
    if (typeof setData === 'function') {
      setData({ ...data, phone: updatedPhone });
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const country = AFRICAN_COUNTRIES.find(c => c.code === countryCode) || selectedCountry;
    setSelectedCountry(country);
    
    const cleanNum = phoneNumber.replace(/\s+/g, "");
    const updatedPhone = `${country.dialCode} ${cleanNum}`;
    
    if (typeof setData === 'function') {
      setData({
        ...data,
        phone: updatedPhone,
        address: {
          ...data.address,
          country: country.name
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter">
          Vos <span className="text-[var(--brand-500)]">informations</span> personnelles
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">Pour vous contacter et personnaliser votre expérience.</p>
      </div>

      {/* Carte de Formulaire */}
      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        
        {/* Numéro de téléphone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
            Numéro de téléphone
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Country Selector */}
            <div className="relative shrink-0 sm:w-48">
              <select
                value={selectedCountry.code}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 pl-4 pr-10 text-sm outline-none focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] transition-all text-[var(--text-primary)] font-bold"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                    {c.flag} {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Phone Input */}
            <div className="relative flex-1 group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)] font-bold"
                placeholder="00 00 00 00"
              />
            </div>
>>>>>>> develop
          </div>
        </div>

        {/* Sélection du Genre */}
<<<<<<< HEAD
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
=======
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
>>>>>>> develop
            Genre
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Masculin", "Féminin", "Non-binaire", "Privé"].map((g) => (
              <button 
                key={g}
<<<<<<< HEAD
                type="button"
                onClick={() => setData({...data, gender: g})}
                className={`py-4 rounded-xl border text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  data.gender === g 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 text-slate-600'
=======
                type="button" // Important : Évite de soumettre le formulaire au clic
                onClick={() => setData({...data, gender: g})}
                className={`py-3 rounded-xl border text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-[var(--brand-500)] ${
                  data.gender === g 
                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-500)]' 
                    : 'border-[var(--border-default)] bg-white/5 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
>>>>>>> develop
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section Adresse */}
<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rue / Adresse principale */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
              Adresse
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
              <input 
                value={data.address.street}
                onChange={(e) => setData({...data, address: {...data.address, street: e.target.value}})}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)]"
>>>>>>> develop
                placeholder="Rue, Quartier"
              />
            </div>
          </div>

          {/* Ville & Pays */}
<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
=======
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
>>>>>>> develop
                Ville
              </label>
              <input 
                value={data.address.city}
                onChange={(e) => setData({...data, address: {...data.address, city: e.target.value}})}
<<<<<<< HEAD
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
=======
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 px-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)]"
>>>>>>> develop
                placeholder="Cotonou"
              />
            </div>
            
<<<<<<< HEAD
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
=======
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                Pays
              </label>
              <input 
                value={data.address.country}
                onChange={(e) => setData({...data, address: {...data.address, country: e.target.value}})}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 px-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)]"
                placeholder="Bénin"
              />
>>>>>>> develop
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}