"use client";

import { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Upload,CheckCircle2,Loader2,ArrowRight,AlertCircle,TrendingUp,MonitorPlay, Users} from 'lucide-react';
import { EXPERTISE_OPTIONS } from '@/types/constant';


export default function InstructorApplyPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cv_url: '',
    linkedin_url: '',
    portfolio_url: '',
    website_url: '',
    expertise: 'machine_learning',
    expertise_detail: '',
    motivation: '',
    teaching_experience: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (cvFile) {
      data.append('cv_file', cvFile);
    }

    try {
      await fetchApi("/api/public/users/apply-instructor/", {
        method: "POST",
        body: data,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.data && typeof err.data === 'object') {
        const firstError = Object.values(err.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        const msg = err.message ;
        if (msg.toLowerCase().includes("déjà") || msg.toLowerCase().includes("en cours d'examen")) {
          setError(
            <div className="space-y-3 w-full text-sm">
              <p>{msg}</p>
              <Link href="/instructor/application/status" className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Consulter mon statut
              </Link>
            </div>
          );
        } else if (msg.trim().startsWith("<!DOCTYPE") || msg.trim().startsWith("<html")) {
          setError("Une erreur interne est survenue sur le serveur. Notre équipe a été prévenue.");
        } else {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // VUE SUCCÈS (Minimaliste)
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Candidature reçue</h2>
          <p className="text-slate-600 text-sm mb-8">
            Merci {formData.first_name}. Notre équipe pédagogique va examiner votre profil. Vous recevrez une réponse sous 3 à 5 jours ouvrés.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Retour à l'accueil
            </Link>
            <Link href="/instructor/application/status" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Suivre ma candidature
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // VUE FORMULAIRE (Split Screen)
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* LEFT COLUMN: FORM (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col p-6 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          
          <div className="mb-10">
            <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight mb-8 block">
              MLAcademy.
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Rejoindre le Studio
            </h1>
            <p className="text-slate-600 text-base">
              Partagez votre expertise technique avec la prochaine génération d'ingénieurs IA.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ALERTE ERREUR */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 font-medium">{error}</div>
              </div>
            )}

            {/* IDENTITÉ */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informations personnelles</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="first_name">Prénom</label>
                  <input id="first_name" type="text" required value={formData.first_name} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="last_name">Nom</label>
                  <input id="last_name" type="text" required value={formData.last_name} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Adresse e-mail</label>
                <input id="email" type="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
              </div>
            </div>

            {/* EXPERTISE */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Expertise professionnelle</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="expertise">Domaine principal</label>
                <select id="expertise" value={formData.expertise} onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors">
                  {EXPERTISE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="expertise_detail">Détails de votre expertise</label>
                <textarea id="expertise_detail" required value={formData.expertise_detail} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" 
                  placeholder="Décrivez votre parcours, vos projets majeurs..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Curriculum Vitae</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-slate-400 transition-colors bg-slate-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="cv_file" className="relative cursor-pointer bg-transparent rounded-md font-medium text-slate-900 hover:text-slate-700 focus-within:outline-none focus-within:underline">
                        <span>{cvFile ? cvFile.name : "Sélectionner un fichier"}</span>
                        <input id="cv_file" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PDF ou Word jusqu'à 5MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="linkedin_url">Profil LinkedIn (Optionnel)</label>
                  <input id="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="portfolio_url">GitHub / Portfolio (Optionnel)</label>
                  <input id="portfolio_url" type="url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
                </div>
              </div>
            </div>

            {/* MOTIVATION */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Motivation</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="teaching_experience">Expérience en enseignement (Optionnel)</label>
                <textarea id="teaching_experience" value={formData.teaching_experience} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" 
                  placeholder="Avez-vous déjà donné des cours, mentoré, ou rédigé des articles ?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="motivation">Pourquoi MLAcademy ?</label>
                <textarea id="motivation" required value={formData.motivation} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Soumettre ma candidature <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: VALUE PROP (40%) - Fixe à l'écran sur Desktop */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-50 sticky top-0 h-screen flex-col justify-center p-12 xl:p-20">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Pourquoi devenir instructeur ?
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white border flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 ">Rémunération attractive</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Générez des revenus passifs sur chaque vente de vos cours. Notre modèle de partage de revenus est conçu pour récompenser l'expertise.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white border-t flex items-center justify-center shrink-0 shadow-sm">
                <MonitorPlay className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Le Studio MLAcademy</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Profitez d'outils de création de pointe, d'un hébergement vidéo fluide et d'un support pédagogique dédié pour structurer vos contenus.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Audience qualifiée</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Touchez directement des milliers de professionnels et d'étudiants motivés, sans avoir à gérer le marketing vous-même.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-slate-500 font-medium">
              Déjà plus de 50 experts ont rejoint le programme d'instructeurs en 2026.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}