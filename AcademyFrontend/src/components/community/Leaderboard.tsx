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
        return "bg-amber-50 border-amber-200 shadow-sm";
      case 2:
        return "bg-slate-50 border-slate-200 shadow-sm";
      case 3:
        return "bg-orange-50 border-orange-200 shadow-sm";
      default:
        return "bg-white border-slate-100";
    }
  };

  const getPodiumIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-amber-500 fill-amber-100" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
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
                className={`relative p-6 rounded-2xl border flex flex-col items-center text-center h-full ${getPodiumBadgeColor(rank)}`}
              >
                {/* Floating Rank circle indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[var(--border-default)] text-[10px] font-bold text-[var(--text-secondary)] shadow-sm">
                  {getPodiumIcon(rank)}
                  <span>RANG {rank}</span>
                </div>

                {/* Avatar highlight container */}
                <div className="relative mt-8">
                  <img
                    src={avatar}
                    alt={talent.fullName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
                  />
                  <div className={`absolute -bottom-2 -right-1 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                    rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-400' : 'bg-orange-500'
                  }`}>
                    #{rank}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-4 tracking-tight">{talent.fullName}</h3>
                <p className="text-xs text-[var(--brand-500)] font-bold mt-1 uppercase tracking-widest">{talent.headline}</p>

                <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{talent.country || "Afrique"}</span>
                </div>

                {talent.level && (
                  <div className="badge badge-brand mt-4">
                    <Award className="w-3.5 h-3.5" />
                    <span>{levelLabel}</span>
                  </div>
                )}

                {/* Score */}
                <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] w-full flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Compteur Projets</p>
                    <p className="text-xs font-bold text-[var(--text-primary)] mt-1">{projectsCount} Projets actifs</p>
                  </div>
                  <div className="text-right flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[var(--border-default)] shadow-sm">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-100" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">{xp} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Class.</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Scientifique</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Localisation</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Niveau</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] text-right">Projets</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] text-right">Score Global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
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
                      className="hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-2 py-1 rounded-md">
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
                            className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[var(--text-primary)]">{talent.fullName}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{talent.headline}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{talent.country || "Afrique"}</span>
                        </div>
                      </td>

                      {/* Expertise Badge Column */}
                      <td className="py-4 px-6">
                        <span className="badge badge-brand">
                          <Award className="w-3 h-3" />
                          {levelLabel}
                        </span>
                      </td>

                      {/* Projects Column */}
                      <td className="py-4 px-6 text-right text-xs font-bold text-[var(--text-primary)]">
                        {projectsCount}
                      </td>

                      {/* Experience Points Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
                          <span className="text-xs font-bold text-[var(--text-primary)]">{xp} XP</span>
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
