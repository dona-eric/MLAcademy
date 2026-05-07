"use client";

import { CheckCircle2, Search, Users, Sparkles } from "lucide-react";

export default function PeerReviewsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A192F]/5 rounded-full border border-[#0A192F]/5">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            <span className="text-[10px] font-black text-[#0A192F] uppercase tracking-widest">Évaluations</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A192F] font-georgia tracking-tight">Peer Reviews</h1>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-200 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0A192F]">Tout est à jour !</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto">Vous n'avez aucune évaluation en attente. Beau travail !</p>
        </div>
      </div>
    </div>
  );
}
