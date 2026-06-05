import React, { useState } from "react";
import { TalentProfile } from "@/types/community";
import { Mail, MapPin, Award, Zap, Code } from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

interface TalentCardProps {
  talent: TalentProfile;
  key?: string | number;
}

export function TalentCard({ talent }: TalentCardProps) {
  const [showEmail, setShowEmail] = useState(false);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "advanced": return "Expert";
      case "intermediate": return "Spécialiste";
      default: return "Apprenti";
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";
  const avatar = talent.avatarUrl || defaultAvatar;
  const levelLabel = getLevelLabel(talent.level);
  const projectsCount = talent.projects ? talent.projects.length : 0;
  const xp = talent.xpPoints || 0;

  return (
    <motion.div
      id={`talent-card-${talent.id}`}
      whileHover={{ y: -6, borderColor: "rgba(99,102,241,0.35)" }}
      className="relative flex flex-col p-8 rounded-[32px] bg-white/[0.03] border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 backdrop-blur-xl animate-fade-in"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={avatar}
            alt={talent.fullName}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border border-white/10"
          />
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 border border-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white">
            #{talent.rank || 1}
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
            {talent.fullName}
          </h3>
          <p className="text-xs text-indigo-400 font-bold mt-0.5">{talent.headline}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{talent.country || "Afrique"}</span>
          </div>
        </div>
      </div>

      {/* Badge Award */}
      {talent.level && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-4 self-start">
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{levelLabel}</span>
        </div>
      )}

      {/* Bio Copy */}
      <p className="text-slate-450 text-xs font-normal mt-4 line-clamp-3 leading-relaxed">
        {talent.bio || "Aucune biographie fournie."}
      </p>

      {/* Core Technology Skills */}
      <div className="flex flex-wrap gap-1.5 mt-5">
        {talent.skills && talent.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2 py-1 text-[10px] font-mono font-medium text-slate-350 bg-white/[0.04] border border-white/5 rounded-lg flex items-center gap-1"
          >
            <Code className="w-2.5 h-2.5 text-indigo-400/70" />
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        {/* Score indicator */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <div className="text-left">
            <p className="text-xs font-bold text-white leading-none">{xp} XP</p>
            <p className="text-[9px] text-slate-550 font-mono mt-0.5 uppercase tracking-wider">{projectsCount} projets</p>
          </div>
        </div>

        {/* Links & CTA */}
        <div className="flex items-center gap-2">
          {talent.github_url && (
            <a
              href={talent.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-slate-400 transition-colors border border-white/5"
              title="GitHub Profile"
            >
              <FaGithub className="w-3.5 h-3.5" />
            </a>
          )}
          {talent.linkedin_url && (
            <a
              href={talent.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-slate-400 transition-colors border border-white/5"
              title="LinkedIn Profile"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {talent.email && (
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-555 border border-indigo-500/20 hover:border-indigo-400 text-indigo-300 transition-colors cursor-pointer"
              title={showEmail ? talent.email : "Afficher l'e-mail de contact"}
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {showEmail && talent.email && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-indigo-950/40 border border-indigo-500/10 rounded-xl text-center"
        >
          <p className="text-[10px] text-indigo-300 font-mono select-all truncate">{talent.email}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
