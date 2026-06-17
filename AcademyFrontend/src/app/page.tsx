"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Code2, Users, Quote, MonitorPlay, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#090C14] overflow-hidden">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold">
              <span>Élite MLAcademy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Des compétences d'aujourd'hui <br className="hidden md:block" />
              qui ont <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">de l'avenir</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
              Notre différence ? Une école 100% en ligne et un modèle pédagogique unique qui propulse votre réussite dans le domaine de l'Intelligence Artificielle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="btn-primary text-base px-8 py-4 shadow-xl shadow-indigo-500/20 group">
                Démarrer mon inscription
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform inline-block ml-2" />
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-up slide-in-from-right-8 duration-1000 delay-300 w-full max-w-[500px] mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-[3rem] blur-2xl opacity-40"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 aspect-[4/3] sm:aspect-square">
              <Image src="/images/hero_student.png"
                alt="Étudiant MLAcademy" width={600} height={600} priority
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090C14]/50 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Étudiants Card */}
          <div className="glass-card rounded-[2rem] p-10 md:p-12 border-l-4 border-l-amber-500 relative overflow-hidden group hover:border-l-amber-400 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight leading-tight">Étudiants(es), Professionnels, Profils en reconversion</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
              Faites un grand pas vers votre nouvelle carrière en suivant l'une de nos formations diplômantes.
            </p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-sm">
              Démarrer mon inscription
            </Link>
            <div className="mt-6">
              <Link href="/parcours" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1">
                Découvrir les formations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Instructeurs Card */}
          <div className="glass-card rounded-[2rem] p-10 md:p-12 border-l-4 border-l-emerald-400 relative overflow-hidden group hover:border-l-emerald-400 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-all"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight leading-tight">Instructeurs / Entreprises</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
              Partagez votre expertise ou recrutez nos talents. Rejoignez notre réseau d'expertise, de talents émergents.
            </p>
            <Link href="/instructeur/apply" className="btn bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30 inline-flex items-center gap-2 py-3 px-6 text-sm rounded-xl font-bold transition-all shadow-lg">
              Devenir Instructeur
            </Link>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/studio" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1">
                Découvrir l'espace <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/instructeur/application/status" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
                Suivre ma candidature <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*FEATURES Savoir. Faire. Savoir-faire.  */}
      <section className="max-w-6xl mx-auto px-5 lg:px-6 py-20">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Savoir. Faire. <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Savoir-faire</span>.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Avec MLAcademy, découvrez une nouvelle façon d'apprendre : <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-extrabold">20% de théorie, 80% de pratique.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="text-center space-y-5 flex flex-col items-center">
            <div className="w-22 h-22 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-indigo-500/10 border-dashed"></div>
              <Code2 className="w-15 h-15 text-indigo-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Apprenez <br /> où que vous soyez</h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs mx-auto">
                Accédez à votre formation 100% en ligne au bureau, à la maison, en ville... Partout !
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="text-center space-y-5 flex flex-col items-center">
            <div className="w-22 h-22 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-cyan-500/10 border-dashed"></div>
              <Users className="w-15 h-15 text-cyan-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Un mentor <br /> pour vous accompagner</h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs mx-auto">
                Bénéficiez des conseils d'un expert professionnel qui vous aide à progresser tout au long de votre formation.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="text-center space-y-5 flex flex-col items-center">
            <div className="w-22 h-22 rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-emerald-500/10 border-dashed"></div>
              <Award className="w-15 h-15 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Travaillez sur <br /> des projets professionnalisants</h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs mx-auto">
                Réalisez des projets concrets, issus de scénarios métiers, directement applicables dans le monde du travail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL SHOWCASE ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative w-full max-w-[500px] mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-[3rem] blur-2xl opacity-40"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl aspect-[4/3] sm:aspect-square">
              <Image
                src="/images/testimonial_student.png"
                alt="Témoignage Étudiant"
                width={500} height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090C14]/80 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
              <Quote className="w-4 h-4 text-indigo-400" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Nos étudiants <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">témoignent</span>
            </h2>

            <blockquote className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium italic">
              « Ma formation m'a beaucoup plu parce qu'elle était très adaptée à mes contraintes de temps ! Tout est fait à distance, mais je me sentais quand même très accompagnée. Chez MLAcademy, l'expertise des instructeurs fait toute la différence. »
            </blockquote>

            <div className="pt-4">
              <p className="text-xl font-bold text-white">Amina Diallo</p>
              <p className="text-indigo-400 font-medium text-sm">Data Scientist Junior chez TechAfrica</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 pb-32">
        <div className="glass-card rounded-[3rem] border border-indigo-500/10 p-12 lg:p-20 relative overflow-hidden bg-gradient-to-b from-indigo-500/5 to-transparent">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative z-10">
            <div className="space-y-7">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Prêt à donner un <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">nouvel élan</span> à votre carrière ?
              </h2>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
                Mettez à jour vos connaissances, développez de nouvelles compétences et obtenez une certification reconnue. Quel que soit votre projet, nous sommes là pour vous accompagner.
              </p>
              <Link href="/register" className="btn-primary text-base px-8 py-4 shadow-xl shadow-indigo-500/20 inline-flex">
                Démarrer mon inscription
              </Link>
            </div>
            {/* VIDEO D'INSCRIPTION À MODIFIER*/}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group cursor-pointer flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 bg-[#090C14]/30"></div>
              <div className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-6 h-6 text-white ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
                01:15
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}