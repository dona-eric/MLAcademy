"use client";

import Link from "next/link";
<<<<<<< HEAD
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Code2,
  Cpu,
  Database,
  PlayCircle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Éditeur Interactif",
    desc: "Un environnement de code intégré pour pratiquer en temps réel sans quitter votre navigateur.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Intelligence Artificielle",
    desc: "Des cours conçus par des experts pour maîtriser le Deep Learning, les LLMs et plus encore.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Certifications",
    desc: "Validez vos compétences avec des certificats officiels reconnus par l'industrie.",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="mesh-gradient" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-indigo-500/20 text-indigo-400 text-sm font-medium animate-reveal">
            <Sparkles className="h-4 w-4" />
            <span>Nouveau : Parcours Large Language Models disponible</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] animate-reveal [animation-delay:200ms]">
            Dominez l'IA avec <br />
            <span className="text-gradient">MLAcademy</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed animate-reveal [animation-delay:400ms]">
            La plateforme d'apprentissage la plus avancée pour maîtriser le Machine Learning. 
            Des cours interactifs, des projets réels et une communauté de passionnés.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal [animation-delay:600ms]">
            <Link href="/parcours" className="btn btn-primary text-lg px-10 py-4 group">
              Démarrer l'aventure
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn btn-secondary text-lg px-10 py-4">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-32 animate-reveal [animation-delay:800ms]">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass-card bg-slate-950/80 border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <span className="ml-4 text-xs font-mono text-slate-500">training_model.py</span>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="font-mono text-sm leading-relaxed">
                <p className="text-indigo-400">import <span className="text-white">tensorflow</span> as <span className="text-white">tf</span></p>
                <p className="text-slate-500 mt-2"># Création d'un réseau de neurones</p>
                <p className="mt-2 text-white"><span className="text-indigo-400">model</span> = tf.keras.Sequential([</p>
                <p className="ml-4 text-white">tf.keras.layers.Dense(<span className="text-cyan-400">128</span>, activation=<span className="text-emerald-400">'relu'</span>),</p>
                <p className="ml-4 text-white">tf.keras.layers.Dense(<span className="text-cyan-400">10</span>, activation=<span className="text-emerald-400">'softmax'</span>)</p>
                <p className="text-white">])</p>
                <p className="mt-4 text-indigo-400">model.<span className="text-white">compile</span>(optimizer=<span className="text-emerald-400">'adam'</span>)</p>
                <p className="text-emerald-400 mt-4">✓ Entraînement en cours... 89%</p>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-400">Précision du Modèle</span>
                    <span className="text-emerald-400 font-bold">98.4%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[98.4%] bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <Zap className="h-6 w-6 text-indigo-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Calcul GPU Activé</p>
                    <p className="text-xs text-indigo-300">NVIDIA A100 - Temps restant: 2s</p>
                  </div>
                </div>
              </div>
=======
import Image from "next/image";
import { ArrowRight, Award, Code2, Users, Quote, ChevronRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="badge badge-brand">
              <span>Élite MLAcademy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.12]">
              Des compétences d'aujourd'hui <br className="hidden md:block" />
              qui ont <span className="text-[var(--brand-500)]">de l'avenir</span>.
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Notre différence ? Une école 100% en ligne et un modèle pédagogique unique qui propulse votre réussite dans le domaine de l'Intelligence Artificielle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register" className="btn-primary text-base px-8 py-4 group">
                Démarrer mon inscription
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/parcours" className="btn-secondary text-base px-8 py-4">
                Voir les formations
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-[500px] mx-auto">
            <div className="absolute -inset-4 bg-[var(--brand-50)] rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[var(--border-default)] aspect-[4/3] sm:aspect-square">
              <Image
                src="/images/hero_student.png"
                alt="Étudiant MLAcademy"
                width={600} height={600} priority
                className="w-full h-full object-cover"
              />
>>>>>>> develop
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Pourquoi choisir MLAcademy ?</h2>
          <p className="text-slate-400 text-lg">Une technologie de pointe pour des résultats concrets.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="glass-card p-8 group hover:bg-white/[0.03]">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Apprenants", val: "10k+" },
            { label: "Cours", val: "45+" },
            { label: "Projets", val: "120+" },
            { label: "Succès", val: "99%" },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-black text-white">{stat.val}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="relative glass-card bg-indigo-600/10 border-indigo-500/20 p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Prêt à coder le futur ?</h2>
          <p className="text-xl text-indigo-200/60 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers de développeurs qui transforment leur carrière avec le Machine Learning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="btn btn-primary px-12 py-4 text-lg">
              Commencer gratuitement
            </Link>
            <Link href="/parcours" className="btn btn-secondary px-12 py-4 text-lg">
              Voir le programme
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer minimaliste */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 MLAcademy. Développé avec passion pour la communauté Data.</p>
      </footer>
    </div>
  );
}
=======
      {/* ── AUDIENCE CARDS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Étudiants */}
          <div className="card p-10 md:p-12 border-l-4 border-l-[var(--warning)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:opacity-80 transition-all"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight leading-tight relative z-10">
              Étudiants(es), Professionnels, Profils en reconversion
            </h3>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8 max-w-sm relative z-10">
              Faites un grand pas vers votre nouvelle carrière en suivant l'une de nos formations diplômantes.
            </p>
            <Link href="/register" className="btn-primary py-3 px-6 text-sm relative z-10">
              Démarrer mon inscription
            </Link>
            <div className="mt-6 relative z-10">
              <Link href="/parcours" className="text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors inline-flex items-center gap-1">
                Découvrir les formations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Instructeurs */}
          <div className="card p-10 md:p-12 border-l-4 border-l-[var(--success)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:opacity-80 transition-all"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight leading-tight relative z-10">
              Instructeurs / Entreprises
            </h3>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8 max-w-sm relative z-10">
              Partagez votre expertise ou recrutez nos talents. Rejoignez notre réseau d'expertise, de talents émergents.
            </p>
            <Link href="/instructeur/apply" className="btn-success py-3 px-6 text-sm relative z-10">
              Devenir Instructeur
            </Link>
            <div className="mt-6 flex flex-col gap-3 relative z-10">
              <Link href="/studio" className="text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors inline-flex items-center gap-1">
                Découvrir l'espace <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/instructeur/application/status" className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors inline-flex items-center gap-1">
                Suivre ma candidature <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-[var(--bg-secondary)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Savoir. Faire. <span className="text-[var(--brand-500)]">Savoir-faire</span>.
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Avec MLAcademy, découvrez une nouvelle façon d'apprendre : <span className="text-[var(--brand-500)] font-bold">20% de théorie, 80% de pratique.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                color: 'var(--brand-500)',
                bgColor: 'var(--brand-50)',
                title: 'Apprenez\noù que vous soyez',
                desc: "Accédez à votre formation 100% en ligne au bureau, à la maison, en ville... Partout !",
              },
              {
                icon: Users,
                color: 'var(--success)',
                bgColor: 'var(--success-light)',
                title: 'Un mentor\npour vous accompagner',
                desc: "Bénéficiez des conseils d'un expert professionnel qui vous aide à progresser tout au long de votre formation.",
              },
              {
                icon: Award,
                color: 'var(--warning)',
                bgColor: 'var(--warning-light)',
                title: 'Travaillez sur\ndes projets professionnalisants',
                desc: "Réalisez des projets concrets, issus de scénarios métiers, directement applicables dans le monde du travail.",
              },
            ].map(({ icon: Icon, color, bgColor, title, desc }, i) => (
              <div key={i} className="card-flat p-8 text-center space-y-5 flex flex-col items-center hover:shadow-md transition-shadow">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] whitespace-pre-line leading-snug">{title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs mx-auto">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative w-full max-w-[500px] mx-auto">
            <div className="absolute -inset-4 bg-[var(--brand-50)] rounded-3xl blur-2xl opacity-40"></div>
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-lg aspect-[4/3] sm:aspect-square">
              <Image
                src="/images/testimonial_student.png"
                alt="Témoignage Étudiant"
                width={500} height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center">
              <Quote className="w-5 h-5 text-[var(--brand-500)]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Nos étudiants <span className="text-[var(--brand-500)]">témoignent</span>
            </h2>

            <blockquote className="text-lg text-[var(--text-secondary)] leading-relaxed">
              « Ma formation m'a beaucoup plu parce qu'elle était très adaptée à mes contraintes de temps ! Tout est fait à distance, mais je me sentais quand même très accompagnée. Chez MLAcademy, l'expertise des instructeurs fait toute la différence. »
            </blockquote>

            <div className="pt-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">Amina Diallo</p>
              <p className="text-[var(--brand-500)] font-medium text-sm">Data Scientist Junior chez TechAfrica</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 pb-24">
        <div className="rounded-2xl border border-[var(--brand-200)] bg-[var(--brand-50)] p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--brand-100)] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                Prêt à donner un <span className="text-[var(--brand-500)]">nouvel élan</span> à votre carrière ?
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                Mettez à jour vos connaissances, développez de nouvelles compétences et obtenez une certification reconnue. Quel que soit votre projet, nous sommes là pour vous accompagner.
              </p>
              <Link href="/register" className="btn-primary text-base px-8 py-4 inline-flex">
                Démarrer mon inscription <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-default)] shadow-lg bg-white">
              <Image
                src="/images/femme_africaine_tech_mlacademy_1.png"
                alt="Étudiante en formation IA"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
>>>>>>> develop
