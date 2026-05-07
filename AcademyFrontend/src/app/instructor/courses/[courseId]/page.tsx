"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Settings, Users, Sparkles } from "lucide-react";

export default function InstructorCourseDetailPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="space-y-6">
        <Link href="/instructor/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0A192F] transition-colors text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Retour aux formations
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#0A192F] font-georgia tracking-tight">Détails du Parcours</h1>
            <p className="text-gray-500 font-medium">Gérez le contenu, les paramètres et les étudiants.</p>
          </div>
          <button className="btn btn-primary shadow-xl shadow-cyan-100">Publier les modifications</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#00D1FF]/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#00D1FF]" />
          </div>
          <h3 className="text-lg font-bold text-[#0A192F]">Curriculum</h3>
          <p className="text-sm text-gray-500 font-medium">Gérez les modules et les leçons.</p>
        </div>
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#FFB800]/10 flex items-center justify-center">
            <Settings className="w-8 h-8 text-[#FFB800]" />
          </div>
          <h3 className="text-lg font-bold text-[#0A192F]">Paramètres</h3>
          <p className="text-sm text-gray-500 font-medium">Titre, description, prix, etc.</p>
        </div>
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#0A192F]/5 flex items-center justify-center">
            <Users className="w-8 h-8 text-[#0A192F]" />
          </div>
          <h3 className="text-lg font-bold text-[#0A192F]">Étudiants</h3>
          <p className="text-sm text-gray-500 font-medium">Suivez la progression de vos apprenants.</p>
        </div>
      </div>
    </div>
  );
}
