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

interface Step2Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>> | ((data: OnboardingData) => void);
}

export default function Step2({ data, setData }: Step2Props) {
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
          </div>
        </div>

        {/* Sélection du Genre */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
            Genre
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Masculin", "Féminin", "Non-binaire", "Privé"].map((g) => (
              <button 
                key={g}
                type="button" // Important : Évite de soumettre le formulaire au clic
                onClick={() => setData({...data, gender: g})}
                className={`py-3 rounded-xl border text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-[var(--brand-500)] ${
                  data.gender === g 
                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-500)]' 
                    : 'border-[var(--border-default)] bg-white/5 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
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
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
              Adresse
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-500)] transition-colors" />
              <input 
                value={data.address.street}
                onChange={(e) => setData({...data, address: {...data.address, street: e.target.value}})}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)]"
                placeholder="Rue, Quartier"
              />
            </div>
          </div>

          {/* Ville & Pays */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                Ville
              </label>
              <input 
                value={data.address.city}
                onChange={(e) => setData({...data, address: {...data.address, city: e.target.value}})}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl py-4 px-4 text-sm focus:border-[var(--brand-500)] focus:bg-[var(--bg-tertiary)] outline-none transition-all text-[var(--text-primary)]"
                placeholder="Cotonou"
              />
            </div>
            
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}