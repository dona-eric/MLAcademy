"use client";

import Link from "next/link";
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
            </div>
          </div>
        </div>
      </section>

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
