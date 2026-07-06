"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function RegistrationStepsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "J'hésite entre plusieurs formations, que faire ?",
      answer: "Pas d'inquiétude ! Lors de la création de votre profil, nos algorithmes et nos conseillers vous orienteront vers le parcours le plus adapté à vos compétences et objectifs professionnels."
    },
    {
      question: "Quels sont les prérequis pour s'inscrire ?",
      answer: "La plupart de nos parcours sont ouverts aux débutants. Des prérequis spécifiques peuvent s'appliquer pour les niveaux avancés (ex: notions en Python pour la Data Science). Tout sera évalué lors de la phase d'orientation."
    },
    {
      question: "Comment fonctionne le financement ?",
      answer: "Nous vous accompagnons pour trouver la meilleure option selon votre statut : CPF, alternance, entreprise, ou paiement en plusieurs fois."
    }
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#090C14] pt-24 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-10 lg:px-10 relative z-10 space-y-16">
        
        {/* HEADER SECTION */}
        <section className="glass-card rounded-[32px] p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Bienvenue ! Vous faites le premier pas vers votre avenir professionnel
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Obtenez un <span className="text-white font-bold">diplôme reconnu</span>, à votre rythme, avec un <span className="text-white font-bold">financement adapté</span> et un accompagnement personnalisé.
              </p>
              
              <Link href="/register/account" className="btn-primary inline-block py-4 px-8 text-base shadow-lg shadow-indigo-500/20">
=======
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-24 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-50)] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--info-light)] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-60"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 relative z-10 space-y-16">
        
        {/* HEADER SECTION */}
        <section className="card rounded-3xl p-8 md:p-12 shadow-lg border-[var(--border-subtle)]">
          <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                Bienvenue ! Vous faites le premier pas vers votre avenir professionnel
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                Obtenez un <span className="text-[var(--brand-500)] font-bold">diplôme reconnu</span>, à votre rythme, avec un <span className="text-[var(--brand-500)] font-bold">financement adapté</span> et un accompagnement personnalisé.
              </p>
              
              <Link href="/register/account" className="btn-primary inline-block py-3 px-8 text-base shadow-sm">
>>>>>>> develop
                Continuer mon inscription
              </Link>
              
              <div className="pt-6 space-y-3">
<<<<<<< HEAD
                <p className="text-sm font-medium text-slate-500 mb-4">
                  Rejoignez la communauté d'élites MLAcademy :
                </p>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">Frais de dossier gratuits</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">Complétion de votre dossier à votre rythme</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">Réponse rapide de nos équipes pédagogiques</p>
=======
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-4">
                  Rejoignez la communauté MLAcademy :
                </p>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--text-secondary)]">Frais de dossier gratuits</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--text-secondary)]">Complétion de votre dossier à votre rythme</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--text-secondary)]">Réponse rapide de nos équipes pédagogiques</p>
>>>>>>> develop
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-center">
<<<<<<< HEAD
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-white/10 overflow-hidden shadow-2xl animate-reveal">
=======
              <div className="relative w-64 h-64 rounded-full bg-[var(--brand-50)] border border-[var(--brand-100)] overflow-hidden shadow-md animate-fade-in">
>>>>>>> develop
                <Image 
                  src="/images/registration_illustration.png" 
                  alt="Illustration MLAcademy" 
                  fill
                  sizes="256px"
<<<<<<< HEAD
                  priority
=======
>>>>>>> develop
                  className="object-cover object-top"  
                />
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="space-y-8">
<<<<<<< HEAD
          <h2 className="text-2xl font-black text-white">L'inscription MLAcademy en 4 étapes</h2>
          
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-cyan-500 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#090C14] bg-indigo-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-indigo-500/20 relative z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
                <h3 className="text-xl font-bold text-white mb-2">Profil</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Renseignez vos informations clés (parcours, niveau, disponibilités) pour accéder à des recommandations de formations adaptées à votre profil.
                </p>
                <Link href="/register/account" className="inline-block px-5 py-2.5 rounded-xl border border-indigo-500/50 text-indigo-400 text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all">
=======
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">L'inscription MLAcademy en 4 étapes</h2>
          
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--border-default)]">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--brand-500)] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--brand-200)] bg-white shadow-md">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Profil</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                  Renseignez vos informations clés (parcours, niveau, disponibilités) pour accéder à des recommandations de formations adaptées à votre profil.
                </p>
                <Link href="/register/account" className="btn-secondary px-5 py-2 inline-block text-sm">
>>>>>>> develop
                  Créer mon profil
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<<<<<<< HEAD
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#090C14] bg-slate-800 text-slate-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-white/5 opacity-80">
                <h3 className="text-xl font-bold text-white mb-2">Orientation</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
=======
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--border-default)] opacity-80">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Orientation</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
>>>>>>> develop
                  Recevez instantanément des suggestions adaptées à votre profil et choisissez facilement le parcours qui vous convient.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<<<<<<< HEAD
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#090C14] bg-slate-800 text-slate-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-white/5 opacity-80">
                <h3 className="text-xl font-bold text-white mb-2">Financement</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Selon votre situation, nous vous accompagnons pour valider votre dossier et vos options de financement.
                </p>
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-300">
=======
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--border-default)] opacity-80">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Financement</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                  Selon votre situation, nous vous accompagnons pour valider votre dossier et vos options de financement.
                </p>
                <div className="p-3 bg-[var(--info-light)] border border-[var(--info)] rounded-xl">
                  <p className="text-xs text-[var(--info)]">
>>>>>>> develop
                    <span className="font-bold">Vous envisagez l'alternance ?</span> Nous proposons des services pour vous aider à décrocher votre contrat !
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<<<<<<< HEAD
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#090C14] bg-slate-800 text-slate-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-white/5 opacity-80">
                <h3 className="text-xl font-bold text-white mb-2">Finalisation</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
=======
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--border-default)] opacity-80">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Finalisation</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
>>>>>>> develop
                  Une fois votre financement validé, vous commencez officiellement votre formation !
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* DOCUMENTS SECTION */}
<<<<<<< HEAD
        <section className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Documents pour votre inscription</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                <span className="font-bold text-white">Bonne nouvelle : vous pouvez poursuivre votre inscription dès maintenant, sans aucun document obligatoire !</span>
=======
        <section className="card rounded-2xl p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Documents pour votre inscription</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                <span className="font-bold text-[var(--text-primary)]">Bonne nouvelle : vous pouvez poursuivre votre inscription dès maintenant, sans aucun document obligatoire !</span>
>>>>>>> develop
                <br />
                Une fois votre inscription avancée, notre équipe vous indiquera les documents à fournir selon votre situation.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-4">
<<<<<<< HEAD
          <h2 className="text-2xl font-black text-white">Les questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card border border-white/5 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-transparent hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-slate-200">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-4 text-slate-400 text-sm leading-relaxed border-t border-white/5 mt-2">
=======
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Les questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="card border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[var(--text-primary)]">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-4 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border-subtle)] mt-2">
>>>>>>> develop
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}