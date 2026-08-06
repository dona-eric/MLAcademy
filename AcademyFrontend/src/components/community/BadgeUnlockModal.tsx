"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Flame, Zap, Award, Sparkles, Terminal, Swords, 
  Cpu, Moon, Bug, Crown, X, Check 
} from "lucide-react";
import { Badge } from "@/types/community";

interface BadgeUnlockModalProps {
  badge: Badge | null;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-12 h-12 text-amber-300" />,
  flame: <Flame className="w-12 h-12 text-orange-400" />,
  zap: <Zap className="w-12 h-12 text-yellow-300" />,
  award: <Award className="w-12 h-12 text-emerald-300" />,
  sparkles: <Sparkles className="w-12 h-12 text-indigo-300" />,
  terminal: <Terminal className="w-12 h-12 text-cyan-300" />,
  swords: <Swords className="w-12 h-12 text-purple-300" />,
  cpu: <Cpu className="w-12 h-12 text-blue-300" />,
  moon: <Moon className="w-12 h-12 text-violet-300" />,
  bug: <Bug className="w-12 h-12 text-rose-300" />,
  crown: <Crown className="w-12 h-12 text-yellow-200" />,
};

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  const iconComponent = ICON_MAP[badge.icon] || <Trophy className="w-12 h-12 text-amber-300" />;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Particules d'étincelles en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50 + "%", 
                y: "100%", 
                opacity: 0, 
                scale: Math.random() * 0.5 + 0.5 
              }}
              animate={{ 
                y: "-10%", 
                opacity: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: Math.random() * 2 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="absolute bottom-0 w-3 h-3 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full blur-[1px]"
            />
          ))}
        </div>

        {/* Modal Principal */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl p-8 bg-slate-900 border border-amber-500/40 text-center shadow-2xl shadow-amber-500/20 overflow-hidden"
        >
          {/* Glowing Aura */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl" />

          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Icon avec animation Bounce */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            className="relative w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/30 border border-yellow-200/50"
          >
            {iconComponent}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full ring-4 ring-slate-900 shadow-md">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </motion.div>

          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
            🎉 Nouveau Badge Débloqué !
          </span>

          <h3 className="text-2xl font-black text-white tracking-tight mt-1 mb-2">
            {badge.name}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {badge.description}
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-amber-300 text-sm font-extrabold mb-6">
            <Sparkles className="w-4 h-4" />
            +{badge.xp_reward} Points XP Débloqués
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Continuer l'aventure 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
