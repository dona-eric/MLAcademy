import React, { useState } from "react";
import { SponsoredChallenge } from "@/types/community";
import {
  Trophy, Calendar, Users, ArrowUpRight, Award, Sparkles, Database, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { ChallengeDetailModal } from "./ChallengeDetailModal";

interface ChallengeCardProps {
  challenge: SponsoredChallenge;
  onRegisterSuccess?: () => void;
}

export function ChallengeCard({ challenge, onRegisterSuccess }: ChallengeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const difficultyColors = {
    beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    expert: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <>
      <motion.div
        id={`challenge-card-${challenge.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:border-[#5de6ff]/50 hover:shadow-[0_0_30px_rgba(93,230,255,0.15)] flex flex-col justify-between group"
      >
        <div>
          {/* Header Row: Company Logo + Meta Badges */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {challenge.company_logo ? (
                <img
                  src={challenge.company_logo}
                  alt={challenge.company_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/10 bg-slate-950 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-[#5de6ff]/10 flex items-center justify-center text-[#5de6ff] font-bold shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-[#908fa0] uppercase tracking-wider block">
                  Organisé par {challenge.company_name}
                </span>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#5de6ff] transition-colors">
                  {challenge.title}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${difficultyColors[challenge.difficulty || 'intermediate']}`}>
                {challenge.difficulty_display || challenge.difficulty}
              </span>
              {challenge.category_display && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-[#c7c4d7] border border-white/10">
                  {challenge.category_display}
                </span>
              )}
              {challenge.type_display && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/20">
                  {challenge.type_display}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-[#c7c4d7] text-sm leading-relaxed mb-6 line-clamp-3">
            {challenge.short_description || challenge.description}
          </p>

          {/* Structured Prizes / Rewards */}
          {(challenge.first_prize || challenge.second_prize || challenge.reward) && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Award className="w-4 h-4" /> Récompenses & Prize Pool
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#d4e4fa]">
                {challenge.first_prize ? (
                  <div>🥇 <span className="font-bold text-white">1er:</span> {challenge.first_prize}</div>
                ) : (
                  <div>🏆 <span className="font-bold text-white">Prix:</span> {challenge.prize_pool ? `${challenge.prize_pool} FCFA` : challenge.reward}</div>
                )}
                {challenge.second_prize && (
                  <div>🥈 <span className="font-bold text-white">2ème:</span> {challenge.second_prize}</div>
                )}
                {challenge.third_prize && (
                  <div>🥉 <span className="font-bold text-white">3ème:</span> {challenge.third_prize}</div>
                )}
              </div>
            </div>
          )}

          {/* Tech stack pills */}
          {challenge.recommended_tech && challenge.recommended_tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {challenge.recommended_tech.slice(0, 5).map((tech, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950 border border-white/10 text-[#c7c4d7]">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#908fa0]">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Calendar className="w-4 h-4 text-[#5de6ff]" />
              {challenge.deadline}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#c0c1ff]" />
              {challenge.submissions_count} participants
            </span>
            {challenge.dataset_size && (
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#5de6ff]" />
                {challenge.dataset_size}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-[#5de6ff] hover:bg-[#a2eeff] text-[#001f25] font-black py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(93,230,255,0.2)]"
          >
            <span>Détails & Leaderboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Challenge Detail Modal */}
      <ChallengeDetailModal
        challenge={challenge}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmissionSuccess={onRegisterSuccess}
      />
    </>
  );
}
