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
        ? prev.domains.filter(d => d !== id)
        : [...prev.domains, id]
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
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C]"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 py-12 pt-20">
        {/* Progress Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Étape {currentStep} sur 8</span>
                </div>
                <div className="h-px w-8 bg-white/10" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {currentStep === 1 ? 'Objectifs' : currentStep === 8 ? 'Finalisation' : 'Configuration'}
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tighter">Onboarding <span className="text-indigo-400">MLAcademy</span></h1>
           </div>

           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                <div 
                  key={step}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    step === currentStep ? 'w-12 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 
                    step < currentStep ? 'w-4 bg-indigo-500/40' : 'w-4 bg-white/5'
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
        <footer className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              currentStep === 1 ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                  className="group relative flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button
                  onClick={handleFinish}
                  disabled={submitting || !data.honorDeclaration || !data.selectedCourse || !data.funding}
                  className="group relative flex items-center gap-3 bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  <span>Terminer l'inscription</span>
                </button>
             )}
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
