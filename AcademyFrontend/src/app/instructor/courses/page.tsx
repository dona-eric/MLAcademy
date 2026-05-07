"use client";

import Link from "next/link";
import { BookOpen, Plus, Sparkles } from "lucide-react";

export default function InstructorCoursesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A192F]/5 rounded-full border border-[#0A192F]/5">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            <span className="text-[10px] font-black text-[#0A192F] uppercase tracking-widest">Gestion des Parcours</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A192F] font-georgia tracking-tight">Vos Formations</h1>
        </div>
        <Link href="/instructor/courses/create" className="btn btn-primary shadow-xl shadow-cyan-100 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Créer un parcours
        </Link>
      </div>

      <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center space-y-6">
        <BookOpen className="w-16 h-16 text-gray-200 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0A192F]">Aucune formation trouvée</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto">Vous n'avez pas encore créé de formation. Commencez dès maintenant à partager votre expertise.</p>
        </div>
        <Link href="/instructor/courses/create" className="btn btn-secondary mt-4">Créer ma première formation</Link>
      </div>
    </div>
  );
}
