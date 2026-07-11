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
    address: { street: "", zip: "", city: "", country: "Bénin" },
    diplomes: [],
    projects: [],
    languages: { french: "B2 - Avancé", english: "B1 - Intermédiaire" },
    professional: { situation: "", experience: [], workPermit: [], specificStatus: [] },
    availability: { hoursPerWeek: "20", startDate: "" },
    honorDeclaration: false,
    selectedCourse: null,
    funding: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/login?callbackUrl=/onboarding");
    }
  }, [profile, authLoading, router]);

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
             projects: data.projects,
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
      localStorage.removeItem("onboardingData"); // Nettoyer après succès
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setSubmitting(false);
    }
  };

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
           </div>

           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                <div 
                  key={step}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    step === currentStep ? 'w-12 bg-[var(--brand-500)] shadow-sm' : 
                    step < currentStep ? 'w-4 bg-[var(--brand-300)]' : 'w-4 bg-[var(--border-default)]'
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
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
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
        <footer className="mt-16 flex items-center justify-between border-t border-[var(--border-subtle)] pt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentStep === 1 ? 'opacity-0 cursor-default' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-default)]'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center gap-4">
             {currentStep < 8 ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 1 && data.domains.length === 0}
                  className="group relative flex items-center gap-3 bg-[var(--text-primary)] text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button
                  onClick={handleFinish}
                  disabled={submitting || !data.honorDeclaration || !data.selectedCourse || !data.funding}
                  className="btn-primary group relative flex items-center gap-3 px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  <span>Terminer l'inscription</span>
                </button>
             )}
          </div>
        </footer>
      </main>

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
    </div>
  );
}
