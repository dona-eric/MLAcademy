"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Briefcase, Heart, Cpu, ArrowRight, ClipboardCheck } from "lucide-react";

export default function BecomeInstructorPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#090C14] text-white flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      <div className="max-w-4xl mx-auto px-6 z-10 relative space-y-16 my-auto">
        
        {/* Header Block */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Rejoignez l'élite des formateurs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Devenez <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Instructeur</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Partagez votre savoir en Intelligence Artificielle et Machine Learning. Concevez des formations immersives, animez des TP interactifs, et propulsez la carrière de milliers d'apprenants.
          </p>
        </div>

        {/* Core Perks Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Technologie de pointe</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vos cours s'intègrent à des notebooks interactifs et à des environnements sandbox en direct.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Rémunération attractive</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monétisez vos connaissances en touchant des royalties régulières sur vos cours et parcours certifiants.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-indigo-500/10 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Impact communautaire</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Aidez à former la relève technologique et scientifique en transmettant des savoirs concrets.
            </p>
          </div>
        </div>

        {/* Action Call / Presentation Card */}
        <div className="glass-card rounded-[40px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/60 to-black p-8 md:p-12 relative shadow-2xl text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Prêt à transmettre votre expertise ?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Notre processus de recrutement est simple, rapide et entièrement transparent. Remplissez notre formulaire de candidature en moins de 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/instructeur/apply")}
              className="btn-primary py-4 px-10 rounded-2xl text-xs font-black uppercase tracking-widest bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 shadow-xl shadow-indigo-500/25 flex items-center gap-2"
            >
              Déposer ma candidature <ArrowRight className="w-4 h-4" />
            </button>
            
            <Link
              href="/instructeur/application/status"
              className="py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white border border-white/5 hover:border-white/10 bg-white/5 transition-all flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" /> Suivre mon dossier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
