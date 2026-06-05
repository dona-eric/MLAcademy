import React, { useState } from "react";
import { SponsoredChallenge } from "@/types/community";
import { Calendar, Users, Trophy, ChevronRight, CheckCircle2, Loader2, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";

interface ChallengeCardProps {
  challenge: SponsoredChallenge;
  onRegisterSuccess?: () => void;
  key?: string | number;
}

export function ChallengeCard({ challenge, onRegisterSuccess }: ChallengeCardProps) {
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(challenge.submissions_count || 0);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await fetchApi(`/api/community/challenges/${challenge.id}/participate/`, {
        method: "POST",
      });
      setRegistered(true);
      setParticipantsCount(prev => prev + 1);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "intermediate":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "advanced":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "beginner": return "Débutant";
      case "intermediate": return "Intermédiaire";
      case "advanced": return "Avancé";
      default: return diff;
    }
  };

  const bannerUrl = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop";
  const challengeTags = [
    challenge.difficulty === 'advanced' ? "Deep Tech" : "Data Science",
    challenge.is_open ? "Ouvert à tous" : "Sélection"
  ];

  const formattedPrize = challenge.prize_pool && parseFloat(challenge.prize_pool) > 0
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(parseFloat(challenge.prize_pool))
    : challenge.reward || "Offre de Stage / Emploi";

  const formattedDeadline = challenge.deadline
    ? new Date(challenge.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Non spécifiée";

  return (
    <motion.div
      id={`challenge-card-${challenge.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: "rgba(245,158,11,0.35)" }}
      className="p-2 rounded-[36px] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col md:flex-row gap-6 backdrop-blur-xl"
    >
      {/* Banner / Graphic Section */}
      <div className="relative w-full md:w-72 h-48 md:h-full min-h-[200px] shrink-0 rounded-[28px] overflow-hidden border border-white/5 bg-slate-900">
        <img
          src={bannerUrl}
          alt={challenge.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Organizer Float glass badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
          {challenge.company_name}
        </div>
        {challenge.company_logo && (
          <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-slate-900 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
            <img src={challenge.company_logo} alt={challenge.company_name} className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="flex-grow p-5 md:p-6 flex flex-col">
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Difficulty badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(challenge.difficulty)}`}>
            <Gauge className="w-3 h-3" />
            {getDifficultyLabel(challenge.difficulty)}
          </span>

          {challengeTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 bg-white/[0.04] border border-white/5 text-slate-400 rounded-full text-[10px] font-normal"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mt-3">{challenge.title}</h3>

        <p className="text-slate-400 text-xs mt-3 leading-relaxed max-w-2xl font-normal">
          {challenge.description}
        </p>

        {/* Info Grid row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          {/* Prize Pool */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Cagnotte</p>
              <p className="text-sm font-black text-amber-300 mt-1">{formattedPrize}</p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Date Limite</p>
              <p className="text-xs font-semibold text-slate-300 mt-1">{formattedDeadline}</p>
            </div>
          </div>

          {/* Participants count */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Inscriptions</p>
              <p className="text-sm font-black text-cyan-300 mt-1">{participantsCount} Hackers</p>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div id="challenge-action-row" className="mt-8 flex items-center gap-4">
          {registered ? (
            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider rounded-2xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inscrit · Commencer le Hack</span>
            </div>
          ) : (
            <button
              id={`register-challenge-btn-${challenge.id}`}
              onClick={handleRegister}
              disabled={registering}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-550 disabled:bg-indigo-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {registering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span>S'inscrire au Challenge</span>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
