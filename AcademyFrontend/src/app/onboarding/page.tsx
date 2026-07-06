"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import { OnboardingData } from "@/types/info";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight, ChevronLeft, Rocket } from "lucide-react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import Step7 from "./components/Step7";
import Step8 from "./components/Step8";

export default function OnboardingPage() {
  const router = useRouter();
  const { user: profile, loading: authLoading, checkAuth } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    domains: [],
    phone: "",
    gender: "",
<<<<<<< HEAD
    address: { street: "", zip: "", city: "", country: "" },
    diplomes: [],
=======
    address: { street: "", zip: "", city: "", country: "Bénin" },
    diplomes: [],
    projects: [],
>>>>>>> develop
    languages: { french: "B2 - Avancé", english: "B1 - Intermédiaire" },
    professional: { situation: "", experience: [], workPermit: [], specificStatus: [] },
    availability: { hoursPerWeek: "20", startDate: "" },
    honorDeclaration: false,
    selectedCourse: null,
    funding: null,
  });

  const [submitting, setSubmitting] = useState(false);
<<<<<<< HEAD
=======
  const [isLoaded, setIsLoaded] = useState(false);
>>>>>>> develop

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/login?callbackUrl=/onboarding");
    }
  }, [profile, authLoading, router]);

<<<<<<< HEAD
  const toggleDomain = (id: string) => {
    setData(prev => ({
      ...prev,
      domains: prev.domains.includes(id) 
        ? []
        : [id]
=======
  // Initialisation à partir du localStorage (au chargement côté client uniquement)
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // On fusionne avec la structure par défaut pour éviter les bugs si la structure de données a changé
        setData((prev) => ({
          ...prev,
          ...parsedData,
        }));
      } catch (e) {
        console.error("Erreur de parsing du localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("onboardingData", JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const toggleDomain = (id: string) => {
    // Remplacer directement par l'ID cliqué (un seul domaine possible)
    setData(prev => ({
      ...prev,
      domains: [id]
>>>>>>> develop
    }));
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await fetchApi("/api/private/users/me/", {
        method: "PATCH",
        body: JSON.stringify({
          student_profile: {
             phone: data.phone,
             gender: data.gender,
             address_street: data.address.street,
             address_zip: data.address.zip,
             address_city: data.address.city,
             address_country: data.address.country,
             french_level: data.languages.french,
             english_level: data.languages.english,
             current_situation: data.professional.situation,
             professional_experiences: data.professional.experience,
             work_permits: data.professional.workPermit,
             specific_statuses: data.professional.specificStatus,
             diplomas: data.diplomes,
<<<<<<< HEAD
=======
             projects: data.projects,
>>>>>>> develop
             hours_per_week: parseInt(data.availability.hoursPerWeek) || 20,
             desired_start_date: data.availability.startDate || null,
             onboarding_completed: true,
             honor_declaration_accepted: data.honorDeclaration,
             selected_training_slug: data.selectedCourse || "",
             funding_method: data.funding || ""
          }
        })
      });
      await checkAuth();
<<<<<<< HEAD
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
      alert("Une erreur s'est produite lors de la finalisation.");
=======
      localStorage.removeItem("onboardingData"); // Nettoyer après succès
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
>>>>>>> develop
    } finally {
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return data.domains.length > 0;
      case 2:
        return !!(data.phone?.length > 4 && data.gender && data.address.street && data.address.city && data.address.country);
      case 3:
        return !!(data.languages.french && data.languages.english);
      case 4:
        return !!data.professional.situation;
      case 5:
        return !!data.availability.hoursPerWeek && !!data.availability.startDate;
      case 6:
        return data.honorDeclaration;
      case 7:
        return !!data.selectedCourse;
      case 8:
        return !!data.funding;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 8));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-100">
      
      {/* Background Decorative Elements (Light Mode) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/40 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12 pt-20">
        
        {/* Progress Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Étape {currentStep} sur 8</span>
                </div>
                <div className="h-px w-8 bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {currentStep === 1 ? 'Objectifs' : currentStep === 8 ? 'Finalisation' : 'Configuration'}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Onboarding <span className="text-indigo-600">MLAcademy</span>
              </h1>
=======
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (authLoading || !isLoaded) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]"><Loader2 className="w-12 h-12 text-[var(--brand-500)] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] selection:bg-[var(--brand-100)] overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-50)] blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--info-light)] blur-[120px] rounded-full opacity-60" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 py-12 pt-20">
        {/* Progress Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-500)]">Étape {currentStep} sur 8</span>
                </div>
                <div className="h-px w-8 bg-[var(--border-default)]" />
                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                  {currentStep === 1 ? 'Objectifs' : currentStep === 8 ? 'Finalisation' : 'Configuration'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Onboarding <span className="text-[var(--brand-500)]">MLAcademy</span></h1>
>>>>>>> develop
           </div>

           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                <div 
                  key={step}
                  className={`h-2 transition-all duration-500 rounded-full ${
<<<<<<< HEAD
                    step === currentStep 
                      ? 'w-12 bg-indigo-600 shadow-sm' 
                      : step < currentStep 
                        ? 'w-4 bg-indigo-300' 
                        : 'w-4 bg-slate-200'
=======
                    step === currentStep ? 'w-12 bg-[var(--brand-500)] shadow-sm' : 
                    step < currentStep ? 'w-4 bg-[var(--brand-300)]' : 'w-4 bg-[var(--border-default)]'
>>>>>>> develop
                  }`}
                />
              ))}
           </div>
        </header>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
<<<<<<< HEAD
              transition={{ duration: 0.3, ease: "easeOut" }}
=======
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
>>>>>>> develop
            >
              {currentStep === 1 && <Step1 data={data} toggleDomain={toggleDomain} />}
              {currentStep === 2 && <Step2 data={data} setData={setData} />}
              {currentStep === 3 && <Step3 data={data} setData={setData} />}
              {currentStep === 4 && <Step4 data={data} setData={setData} />}
              {currentStep === 5 && <Step5 data={data} setData={setData} />}
              {currentStep === 6 && <Step6 data={data} setData={setData} />}
              {currentStep === 7 && <Step7 data={data} setData={setData} />}
              {currentStep === 8 && <Step8 data={data} setData={setData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
<<<<<<< HEAD
        <footer className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
              currentStep === 1 
                ? 'opacity-0 cursor-default' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
=======
        <footer className="mt-16 flex items-center justify-between border-t border-[var(--border-subtle)] pt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentStep === 1 ? 'opacity-0 cursor-default' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-default)]'
>>>>>>> develop
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center gap-4">
             {currentStep < 8 ? (
                <button
                  onClick={nextStep}
<<<<<<< HEAD
                  disabled={!isStepValid(currentStep)}
                  className="group relative flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
=======
                  disabled={currentStep === 1 && data.domains.length === 0}
                  className="group relative flex items-center gap-3 bg-[var(--text-primary)] text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
>>>>>>> develop
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button
                  onClick={handleFinish}
                  disabled={submitting || !data.honorDeclaration || !data.selectedCourse || !data.funding}
<<<<<<< HEAD
                  className="group relative flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
=======
                  className="btn-primary group relative flex items-center gap-3 px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
>>>>>>> develop
                  <span>Terminer l'inscription</span>
                </button>
             )}
          </div>
        </footer>
      </main>
<<<<<<< HEAD
=======

      <style jsx global>{`
        /* Override child components dark mode styles to light mode */
        .glass-card {
          background: #ffffff;
          border: 1px solid var(--border-default);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .text-white {
          color: var(--text-primary) !important;
        }
        .text-slate-400 {
          color: var(--text-secondary) !important;
        }
        .text-slate-500 {
          color: var(--text-tertiary) !important;
        }
        .bg-white\\/5 {
          background-color: var(--bg-secondary) !important;
        }
        .border-white\\/10 {
          border-color: var(--border-default) !important;
        }
        input::-webkit-calendar-picker-indicator {
          filter: invert(0);
          opacity: 0.7;
        }
      `}</style>
>>>>>>> develop
    </div>
  );
}
