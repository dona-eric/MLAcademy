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
    address: { street: "", zip: "", city: "", country: "" },
    diplomes: [],
    languages: { french: "B2 - Avancé", english: "B1 - Intermédiaire" },
    professional: { situation: "", experience: [], workPermit: [], specificStatus: [] },
    availability: { hoursPerWeek: "20", startDate: "" },
    honorDeclaration: false,
    selectedCourse: null,
    funding: null,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/login?callbackUrl=/onboarding");
    }
  }, [profile, authLoading, router]);

  const toggleDomain = (id: string) => {
    setData(prev => ({
      ...prev,
      domains: prev.domains.includes(id) 
        ? []
        : [id]
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
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
      alert("Une erreur s'est produite lors de la finalisation.");
    } finally {
      setSubmitting(false);
    }
  };

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
           </div>

           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                <div 
                  key={step}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    step === currentStep 
                      ? 'w-12 bg-indigo-600 shadow-sm' 
                      : step < currentStep 
                        ? 'w-4 bg-indigo-300' 
                        : 'w-4 bg-slate-200'
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
              transition={{ duration: 0.3, ease: "easeOut" }}
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
        <footer className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
              currentStep === 1 
                ? 'opacity-0 cursor-default' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center gap-4">
             {currentStep < 8 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="group relative flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button
                  onClick={handleFinish}
                  disabled={submitting || !data.honorDeclaration || !data.selectedCourse || !data.funding}
                  className="group relative flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                  <span>Terminer l'inscription</span>
                </button>
             )}
          </div>
        </footer>
      </main>
    </div>
  );
}
