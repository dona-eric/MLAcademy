"use client";

import React from "react";
import { Flame, ShieldCheck, Trophy, Calendar } from "lucide-react";
import { UserStreak } from "@/types/community";

interface StreakWidgetProps {
  streak: UserStreak | null;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak }) => {
  const currentStreak = streak?.current_streak ?? 0;
  const maxStreak = streak?.max_streak ?? 0;
  const freezes = streak?.streak_freezes_available ?? 1;

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
            <Flame className="w-7 h-7 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Série d'apprentissage
            </span>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              {currentStreak} {currentStreak > 1 ? "Jours" : "Jour"} consécutifs
            </h3>
          </div>
        </div>

        {/* Badge Streak Freeze */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{freezes} Freeze {freezes > 1 ? "disponibles" : "disponible"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record personnel : <strong className="text-white font-bold">{maxStreak} j</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 justify-end">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Statut : <strong className="text-emerald-400 font-bold">Actif</strong></span>
        </div>
      </div>
    </div>
  );
};
