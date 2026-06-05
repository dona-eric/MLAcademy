import React from "react";
import { TalentProfile } from "@/types/community";
import { Award, Trophy, Medal, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardProps {
  talents: TalentProfile[];
}

export function Leaderboard({ talents }: LeaderboardProps) {
  // Sort descending by xpPoints
  const sorted = [...talents].sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0));

  // Take top 3 for podium highlight cards
  const topThree = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  const getPodiumBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-amber-400 to-yellow-600 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]";
      case 2:
        return "from-slate-300 to-slate-500 border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.15)]";
      case 3:
        return "from-amber-600 to-amber-800 border-amber-700 shadow-[0_0_20px_rgba(180,83,9,0.15)]";
      default:
        return "from-slate-700 to-slate-900 border-slate-650 opacity-80";
    }
  };

  const getPodiumIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "advanced": return "Expert ML";
      case "intermediate": return "Spécialiste ML";
      default: return "Apprenti ML";
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";

  return (
    <div id="leaderboard-section-container" className="space-y-12">
      {/* Podiums Highlights */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6">
          {topThree.map((talent, idx) => {
            const rank = idx + 1;
            const levelLabel = getLevelLabel(talent.level);
            const projectsCount = talent.projects ? talent.projects.length : 0;
            const xp = talent.xpPoints || 0;
            const avatar = talent.avatarUrl || defaultAvatar;

            return (
              <motion.div
                id={`podium-card-${rank}`}
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-[1px] rounded-[32px] bg-gradient-to-b ${getPodiumBadgeColor(rank)}`}
              >
                <div className="p-6 rounded-[31px] bg-[#0c0f1b] flex flex-col items-center text-center h-full">
                  {/* Floating Rank circle indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] rounded-full border border-white/10 font-mono text-[9px] font-bold text-slate-400">
                    {getPodiumIcon(rank)}
                    <span>RANG {rank}</span>
                  </div>

                  {/* Avatar highlight container */}
                  <div className="relative mt-4">
                    <img
                      src={avatar}
                      alt={talent.fullName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/10 border border-white/20"
                    />
                    <div className="absolute -bottom-2 -right-1 bg-indigo-600 border border-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                      #{rank}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white mt-6 tracking-tight font-display">{talent.fullName}</h3>
                  <p className="text-xs text-indigo-400 font-bold mt-1 uppercase tracking-widest">{talent.headline}</p>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{talent.country || "Afrique"}</span>
                  </div>

                  {talent.level && (
                    <div className="mt-3.5 inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-display">
                      <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{levelLabel}</span>
                    </div>
                  )}

                  {/* Score */}
                  <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Compteur Projets</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">{projectsCount} Projets actifs</p>
                    </div>
                    <div className="text-right flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/10">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white">{xp} XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Class.</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Scientifique</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Localisation</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Niveau</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Projets</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Score Global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {remaining.map((talent, index) => {
                  const rank = index + 4;
                  const levelLabel = getLevelLabel(talent.level);
                  const projectsCount = talent.projects ? talent.projects.length : 0;
                  const xp = talent.xpPoints || 0;
                  const avatar = talent.avatarUrl || defaultAvatar;

                  return (
                    <tr
                      id={`leaderboard-row-${talent.id}`}
                      key={talent.id}
                      className="hover:bg-white/[0.04] transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-white/[0.03] border border-white/10 px-2 py-1 rounded-lg">
                          #{rank}
                        </span>
                      </td>

                      {/* Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={talent.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <p className="text-sm font-bold text-white hover:text-indigo-400 transition-colors leading-none">{talent.fullName}</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">{talent.headline}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{talent.country || "Afrique"}</span>
                        </div>
                      </td>

                      {/* Expertise Badge Column */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-bold text-slate-350">
                          <Award className="w-3 h-3 text-indigo-400" />
                          {levelLabel}
                        </span>
                      </td>

                      {/* Projects Column */}
                      <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-slate-300">
                        {projectsCount}
                      </td>

                      {/* Experience Points Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-indigo-500/5 px-2.5 py-1 border border-indigo-500/10 rounded-xl">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono text-xs font-black text-white">{xp} XP</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
