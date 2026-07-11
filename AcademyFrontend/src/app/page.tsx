"use client";

import Link from "next/link";
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
            </div>
          </div>
        </div>
      </section>

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