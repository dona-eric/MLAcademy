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
                Continuer mon inscription
              </Link>
              
              <div className="pt-6 space-y-3">
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
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-[var(--brand-50)] border border-[var(--brand-100)] overflow-hidden shadow-md animate-fade-in">
                <Image 
                  src="/images/registration_illustration.png" 
                  alt="Illustration MLAcademy" 
                  fill
                  sizes="256px"
                  className="object-cover object-top"  
                />
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="space-y-8">
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
                  Créer mon profil
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--border-default)] opacity-80">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Orientation</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Recevez instantanément des suggestions adaptées à votre profil et choisissez facilement le parcours qui vous convient.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
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
                    <span className="font-bold">Vous envisagez l'alternance ?</span> Nous proposons des services pour vous aider à décrocher votre contrat !
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 rounded-2xl border-[var(--border-default)] opacity-80">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Finalisation</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Une fois votre financement validé, vous commencez officiellement votre formation !
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* DOCUMENTS SECTION */}
        <section className="card rounded-2xl p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Documents pour votre inscription</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                <span className="font-bold text-[var(--text-primary)]">Bonne nouvelle : vous pouvez poursuivre votre inscription dès maintenant, sans aucun document obligatoire !</span>
                <br />
                Une fois votre inscription avancée, notre équipe vous indiquera les documents à fournir selon votre situation.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-4">
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