"use client";

import React from "react";
import { Badge } from "@/types/community";
import { 
  Trophy, Flame, Zap, Award, Sparkles, Terminal, Swords, 
  Cpu, Moon, Bug, Crown, Lock, CheckCircle2 
} from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-7 h-7 text-amber-400" />,
  flame: <Flame className="w-7 h-7 text-orange-500" />,
  zap: <Zap className="w-7 h-7 text-yellow-400" />,
  award: <Award className="w-7 h-7 text-emerald-400" />,
  sparkles: <Sparkles className="w-7 h-7 text-indigo-400" />,
  terminal: <Terminal className="w-7 h-7 text-cyan-400" />,
  swords: <Swords className="w-7 h-7 text-purple-400" />,
  cpu: <Cpu className="w-7 h-7 text-blue-400" />,
  moon: <Moon className="w-7 h-7 text-violet-400" />,
  bug: <Bug className="w-7 h-7 text-rose-400" />,
  crown: <Crown className="w-7 h-7 text-yellow-300" />,
};

const CATEGORY_LABEL: Record<string, { label: string; color: string }> = {
  learning: { label: "Apprentissage", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  challenge: { label: "Challenge", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  community: { label: "Communauté", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  streak: { label: "Constance", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  rank: { label: "Rang", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
  secret: { label: "Badge Secret", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isUnlocked = badge.is_unlocked ?? false;
  const iconComponent = ICON_MAP[badge.icon] || <Trophy className="w-7 h-7 text-amber-400" />;
  const categoryInfo = CATEGORY_LABEL[badge.category] || CATEGORY_LABEL.learning;

  return (
    <div
      className={`relative group rounded-2xl p-5 border transition-all duration-300 backdrop-blur-xl ${
        isUnlocked
          ? "bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/15"
          : "bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-80"
      }`}
    >
      {/* Halo de brillance si débloqué */}
      {isUnlocked && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
      )}

      <div className="flex items-start gap-4">
        {/* Icône du badge */}
        <div
          className={`relative shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
            isUnlocked
              ? "bg-gradient-to-br from-amber-500/20 via-slate-900 to-yellow-500/10 border-amber-500/40 shadow-inner"
              : "bg-slate-900/60 border-slate-800"
          }`}
        >
          {isUnlocked ? iconComponent : <Lock className="w-6 h-6 text-slate-500" />}
          
          {isUnlocked && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-950">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Détails du badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`text-base font-bold truncate ${isUnlocked ? "text-white" : "text-slate-400"}`}>
              {badge.is_secret && !isUnlocked ? "🔒 Badge Masqué" : badge.name}
            </h4>
            <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {badge.is_secret && !isUnlocked
              ? "Accomplissez des actions spéciales pour révéler ce badge secret !"
              : badge.description}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <span className="font-mono font-bold text-amber-400">+{badge.xp_reward} XP</span>
            {isUnlocked && badge.awarded_at && (
              <span className="text-[10px] text-slate-500">
                Débloqué le {new Date(badge.awarded_at).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
