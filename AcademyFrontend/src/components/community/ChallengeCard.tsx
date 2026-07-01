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
        return "badge-beginner";
      case "intermediate":
        return "badge-intermediate";
      case "advanced":
        return "badge-advanced";
      default:
        return "badge-neutral";
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
      className="card flex flex-col md:flex-row gap-0 overflow-hidden"
    >
      {/* Banner / Graphic Section */}
      <div className="relative w-full md:w-80 h-56 md:h-auto shrink-0 bg-[var(--bg-tertiary)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)]">
        <img
          src={bannerUrl}
          alt={challenge.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Organizer Float glass badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-md border border-[var(--border-default)] text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider shadow-sm">
          {challenge.company_name}
        </div>
        {challenge.company_logo && (
          <div className="absolute bottom-4 right-4 w-14 h-14 rounded-lg bg-white border border-[var(--border-default)] p-1.5 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={challenge.company_logo} alt={challenge.company_name} className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="flex-grow p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2.5 items-center mb-4">
            {/* Difficulty badge */}
            <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
              <Gauge className="w-3.5 h-3.5" />
              <span>{getDifficultyLabel(challenge.difficulty)}</span>
            </span>

            {challengeTags.map((tag, idx) => (
              <span
                key={idx}
                className="badge badge-neutral"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{challenge.title}</h3>

          <p className="text-[var(--text-secondary)] text-sm mt-3 leading-relaxed max-w-2xl">
            {challenge.description}
          </p>
        </div>

        <div>
          {/* Info Grid row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-[var(--border-subtle)]">
            {/* Prize Pool */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider leading-none">Cagnotte</p>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{formattedPrize}</p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--brand-50)] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[var(--brand-500)]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider leading-none">Date Limite</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{formattedDeadline}</p>
              </div>
            </div>

            {/* Participants count */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--info-light)] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider leading-none">Inscriptions</p>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{participantsCount} Hackers</p>
              </div>
            </div>
          </div>

          {/* Actions bar */}
          <div id="challenge-action-row" className="mt-8 flex items-center gap-4">
            {registered ? (
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--success-light)] border border-[var(--success)] text-[var(--success)] text-xs font-bold uppercase tracking-wider rounded-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inscrit · Commencer le Hack</span>
              </div>
            ) : (
              <button
                id={`register-challenge-btn-${challenge.id}`}
                onClick={handleRegister}
                disabled={registering}
                className="btn-primary w-full sm:w-auto px-8 py-3 uppercase tracking-wider text-xs"
              >
                {registering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <span>S'inscrire au Challenge</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
