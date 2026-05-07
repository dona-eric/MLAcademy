"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Cours structurés",
    desc: "Des parcours progressifs pour apprendre le ML, la data science et l’IA sans te perdre.",
  },
  {
    title: "Pratique guidée",
    desc: "Notebooks, exercices et projets pour transformer la théorie en compétences concrètes.",
  },
  {
    title: "Certifications",
    desc: "Valide tes acquis avec des certificats valorisables dans ton portfolio et ton CV.",
  },
];

const features = [
  {
    icon: <Code2 className="h-7 w-7" />,
    title: "Éditeur intégré",
    desc: "Travaille directement dans l’interface avec une expérience pensée pour apprendre efficacement.",
  },
  {
    icon: <Cpu className="h-7 w-7" />,
    title: "Apprentissage moderne",
    desc: "Des contenus orientés cas d’usage, projets concrets et montée en compétence progressive.",
  },
  {
    icon: <Award className="h-7 w-7" />,
    title: "Certificats",
    desc: "Une reconnaissance claire de ton niveau sur chaque parcours terminé.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Communauté",
    desc: "Apprends aux côtés d’autres passionnés et progresse avec plus de motivation.",
  },
  {
    icon: <Database className="h-7 w-7" />,
    title: "Datasets & cas réels",
    desc: "Des ressources adaptées aux problématiques data science et IA actuelles.",
  },
  {
    icon: <ChevronRight className="h-7 w-7" />,
    title: "Parcours évolutifs",
    desc: "Des modules conçus pour accompagner la progression du débutant à l’avancé.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              MLAcademy — plateforme d’apprentissage en IA
            </div>

            <div className="space-y-6">
              <h1 className="max-w-xl text-5xl font-bold leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
                Apprends le{" "}
                Apprends le <span className="text-gradient">Machine Learning</span> avec une
                                expérience moderne.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Une plateforme pensée pour progresser en data science, IA et
                machine learning avec des parcours clairs, des exercices
                pratiques et des certifications.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/parcours" className="btn btn-primary px-7 py-4">
                Explorer les parcours <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register" className="btn btn-secondary px-7 py-4">
                Créer un compte
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur"
                >
                  <h3 className="text-sm font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-3 shadow-2xl">
              <div className="rounded-[1.5rem] bg-slate-900">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 text-xs text-slate-400">
                  <span>training_pipeline.py</span>
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Progression en temps réel
                  </span>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-[1.3fr_0.7fr]">
                  <div className="rounded-3xl bg-white/5 p-5 font-mono text-sm leading-7 text-cyan-200">
                    <pre className="whitespace-pre-wrap">{`from mlacademy import Dataset

# Charger un projet data science
project = Dataset.load("ml_foundations")
X, y = project.prepare()

model.fit(X, y)
print("Modèle entraîné avec succès")`}</pre>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-white p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Progression
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-950">
                        84%
                      </p>
                      <div className="mt-4 h-2 rounded-full bg-slate-100">
                        <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
                      </div>
                    </div>
                    <div className="rounded-3xl bg-indigo-500 p-5 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
                        Certification
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        Prêt pour l’examen final
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["2500+", "apprenants déjà inscrits"],
            ["Parcours", "structurés et progressifs"],
            ["Certifications", "pour valider les acquis"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Pourquoi MLAcademy
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Une base produit claire, minimaliste et centrée sur l’apprentissage.
          </h2>
          <p className="text-lg leading-8 text-slate-600">
            On garde toutes les fonctionnalités du projet, mais on les présente
                        dans une interface plus sobre, plus lisible et plus rassurante sur
                        mobile, tablette et desktop.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl md:px-12 md:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
            Prêt à commencer ?
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Construis ton parcours en IA dès maintenant.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Explore les formations, démarre ton onboarding et retrouve tout dans
            ton dashboard.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="btn btn-primary bg-white text-slate-950 hover:bg-indigo-50"
            >
              Rejoindre MLAcademy
            </Link>
            <Link
              href="/parcours"
              className="btn btn-secondary border-white/15 bg-white/5 text-white hover:border-white/30 hover:text-white"
            >
              Voir les parcours <PlayCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
