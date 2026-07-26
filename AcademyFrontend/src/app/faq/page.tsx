"use client";

import { useState } from "react";
import { Search, ChevronDown, MessageCircleQuestion, LayoutGrid, BookOpen, CreditCard, Briefcase, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { name: "Toutes", icon: LayoutGrid },
  { name: "Plateforme", icon: MonitorPlay },
  { name: "Formations", icon: BookOpen },
  { name: "Paiements", icon: CreditCard },
  { name: "Carrière", icon: Briefcase }
];

const FAQS = [
  {
    id: 1,
    category: "Plateforme",
    question: "Qu'est-ce que MLAcademy ?",
    answer: "MLAcademy est une plateforme d'apprentissage en ligne spécialisée dans l'Intelligence Artificielle et la Data Science. Nous proposons des parcours certifiants basés sur la pratique avec un accompagnement par des mentors experts."
  },
  {
    id: 2,
    category: "Formations",
    question: "Dois-je avoir des connaissances préalables pour m'inscrire ?",
    answer: "Cela dépend des parcours. Nous avons des formations pour débutants absolus (comme l'Introduction au Machine Learning) et d'autres plus avancées qui nécessitent des bases en programmation Python."
  },
  {
    id: 3,
    category: "Paiements",
    question: "Les formations sont-elles gratuites ?",
    answer: "Nous proposons des cours d'introduction gratuits pour vous permettre de découvrir la plateforme. Les parcours certifiants complets sont payants et incluent le mentorat, les revues de code et le certificat final."
  },
  {
    id: 4,
    category: "Plateforme",
    question: "Combien de temps faut-il pour terminer un parcours ?",
    answer: "Les parcours sont conçus pour être complétés entre 3 et 6 mois, à raison de 10 à 15 heures de travail par semaine. Cependant, vous progressez à votre propre rythme."
  },
  {
    id: 5,
    category: "Carrière",
    question: "Aidez-vous à trouver un emploi après la certification ?",
    answer: "Oui ! Notre module Communauté permet aux recruteurs de publier des offres d'emploi et de vous contacter directement. De plus, nos mentors vous aident à préparer vos entretiens et à optimiser votre portfolio."
  },
  {
    id: 6,
    category: "Formations",
    question: "Comment se déroule la validation des projets ?",
    answer: "À la fin de chaque module, vous devez soumettre un projet pratique. Il sera évalué par un pair ou un instructeur selon une grille stricte. Vous devez obtenir au moins 80% pour valider le module."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Toutes" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-24 pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--brand-50)] rounded-b-full blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-50)] text-[var(--brand-500)] mb-2 shadow-sm border border-[var(--brand-100)]">
            <MessageCircleQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Comment pouvons-nous <span className="text-[var(--brand-500)]">vous aider ?</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions concernant nos parcours, notre plateforme ou votre carrière.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Rechercher une question (ex: Mentorat, Certificat...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-14 py-5 text-base text-[var(--text-primary)] shadow-sm outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeCategory === name
                  ? "bg-[var(--brand-500)] text-white shadow-md"
                  : "bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-active)] hover:text-[var(--brand-500)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`card-flat overflow-hidden transition-all duration-300 border ${
                  openId === faq.id ? "border-[var(--brand-300)] shadow-md" : "border-[var(--border-default)] hover:border-[var(--border-active)]"
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-lg font-bold transition-colors ${openId === faq.id ? "text-[var(--brand-500)]" : "text-[var(--text-primary)]"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 bg-[var(--bg-secondary)] ${openId === faq.id ? "rotate-180 bg-[var(--brand-50)] text-[var(--brand-500)]" : "text-[var(--text-tertiary)]"}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-4 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-16 card-flat border-dashed">
              <Search className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Aucun résultat</h3>
              <p className="text-[var(--text-secondary)]">Nous n'avons pas trouvé de réponse à votre recherche.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <p className="text-[var(--text-secondary)] mb-4">Vous n'avez pas trouvé votre réponse ?</p>
          <Link href="mailto:contact@mlacademy.io" className="btn-secondary">
            Contactez le support
          </Link>
        </div>

      </div>
    </div>
  );
}
