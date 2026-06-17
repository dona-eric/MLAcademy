"use client";

import Link from "next/link";
import { Play, Plus, Sparkles, Video } from "lucide-react";

export default function InstructorTutosPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Espace Tutoriels & Live</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Vos Tutoriels & Webinaires</h1>
        </div>
        <button className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 border-amber-500">
          <Plus className="w-5 h-5" /> Publier un tuto
        </button>
      </div>

      <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-20 text-center space-y-6">
        <Video className="w-16 h-16 text-slate-700 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Aucun tutoriel</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">Partagez des astuces rapides ou des lives avec votre communauté.</p>
        </div>
        <button className="btn-secondary mt-4 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest">Créer mon premier contenu court</button>
      </div>
    </div>
  );
}
