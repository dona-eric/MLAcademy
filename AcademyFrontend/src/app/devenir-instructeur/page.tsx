"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Cpu,
  Coins,
  Users,
  ArrowRight,
  ClipboardCheck,
  Award,
} from "lucide-react";

export default function BecomeInstructorPage() {
  const router = useRouter();

  const scrollToPerks = () => {
    const perksSection = document.getElementById("perks");
    if (perksSection) {
      perksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-[#051424] text-[#d4e4fa] font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 flex flex-col items-center text-center px-6 z-10 max-w-5xl mx-auto">
        <div className="mb-8 px-5 py-2 rounded-full inline-flex items-center gap-2 bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 text-[#c0c1ff]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#c0c1ff]">
            REJOIGNEZ L'ÉLITE DES FORMATEURS
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight text-white">
          Devenez{" "}
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#c0c1ff] via-indigo-300 to-[#5de6ff] [text-shadow:0_0_35px_rgba(192,193,255,0.3)]">
            Instructeur
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#c7c4d7] max-w-3xl mb-12 leading-relaxed">
          Partagez votre savoir en Intelligence Artificielle et Machine Learning. Concevez des formations immersives, animez des TP interactifs, et propulsez la carrière de milliers d'apprenants.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
          <button
            onClick={() => router.push("/instructor/apply")}
            className="bg-[#c0c1ff] text-[#1000a9] hover:bg-[#d4e4fa] px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Commencer l'aventure
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={scrollToPerks}
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            En savoir plus
          </button>
        </div>
      </section>

      {/* Benefits Bento Grid */}
      <section id="perks" className="max-w-6xl mx-auto px-6 mb-24 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#c0c1ff]/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 p-8 rounded-2xl group flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-[#c0c1ff] group-hover:bg-[#c0c1ff] group-hover:text-[#1000a9] transition-all duration-300">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Technologie de pointe</h3>
              <p className="text-base text-[#c7c4d7] mb-8 leading-relaxed">
                Vos cours s'intègrent à des notebooks interactifs et à des environnements sandbox en direct.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
              <img
                className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
                alt="Technologie de pointe AI"
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-indigo-500/[0.04] backdrop-blur-md border border-[#c0c1ff]/30 hover:border-[#5de6ff]/50 hover:bg-indigo-500/[0.08] hover:shadow-[0_0_30px_rgba(93,230,255,0.15)] transition-all duration-300 p-8 rounded-2xl group flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#5de6ff]/10 border border-[#5de6ff]/20 flex items-center justify-center mb-6 text-[#5de6ff] group-hover:bg-[#5de6ff] group-hover:text-[#00363e] transition-all duration-300">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Rémunération attractive</h3>
              <p className="text-base text-[#c7c4d7] mb-8 leading-relaxed">
                Monétisez vos connaissances en touchant des royalties régulières sur vos cours et parcours certifiants.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
              <img
                className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
                alt="Rémunération attractive"
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#c0c1ff]/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 p-8 rounded-2xl group flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-[#051424] transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Impact communautaire</h3>
              <p className="text-base text-[#c7c4d7] mb-8 leading-relaxed">
                Aidez à former la relève technologique et scientifique en transmettant des savoirs concrets.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
              <img
                className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
                alt="Impact communautaire"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24 z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y border-white/10 py-12 bg-white/[0.01] rounded-2xl backdrop-blur-sm">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#c0c1ff] mb-2">50k+</div>
            <div className="text-xs font-black text-[#c7c4d7] uppercase tracking-widest">
              Apprenants
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#5de6ff] mb-2">120+</div>
            <div className="text-xs font-black text-[#c7c4d7] uppercase tracking-widest">
              Instructeurs
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#c0c1ff] mb-2">4.9/5</div>
            <div className="text-xs font-black text-[#c7c4d7] uppercase tracking-widest">
              Satisfaction
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#5de6ff] mb-2">15+</div>
            <div className="text-xs font-black text-[#c7c4d7] uppercase tracking-widest">
              Pays
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 mb-12 z-10 relative">
        <div className="relative bg-white/[0.03] backdrop-blur-md p-10 md:p-16 rounded-3xl overflow-hidden border border-[#c0c1ff]/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-transparent shadow-2xl">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 flex items-center justify-center mb-6 text-[#c0c1ff]">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              Prêt à transmettre votre expertise ?
            </h2>
            <p className="text-base md:text-lg text-[#c7c4d7] mb-10 leading-relaxed max-w-2xl">
              Le processus est simple : soumettez votre dossier, discutez avec nos experts pédagogiques et lancez votre première formation en quelques semaines.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <button
                onClick={() => router.push("/instructor/apply")}
                className="bg-[#8083ff] hover:bg-[#c0c1ff] text-[#0d0096] px-9 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Déposer ma candidature
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/instructor/application/status"
                className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/10 text-white px-9 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4 text-[#5de6ff]" />
                Suivre mon dossier
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
