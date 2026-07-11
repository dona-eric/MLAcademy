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
      whileHover={{ y: -4 }}
      className="card relative flex flex-col p-6 animate-fade-in group"
    >
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt={talent.fullName}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border border-[var(--border-subtle)]"
          />
          <div className="absolute -bottom-1 -right-1 bg-[var(--brand-500)] border-2 border-white text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-sm">
            #{talent.rank}
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight truncate">
            {talent.fullName}
          </h3>
          <p className="text-xs text-[var(--brand-500)] font-semibold mt-0.5 truncate">{talent.headline}</p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] mt-1">
            <MapPin className="w-3 h-3" />
            <span>{talent.country || "Afrique"}</span>
          </div>
        </div>
      </div>

      {/* Badge Award */}
      {talent.level && (
        <div className="badge badge-brand mt-4 self-start">
          <Award className="w-3.5 h-3.5" />
          <span>{levelLabel}</span>
        </div>
      )}

      {/* Bio Copy */}
      <p className="text-[var(--text-secondary)] text-sm mt-4 line-clamp-3 leading-relaxed flex-grow">
        {talent.bio || "Aucune biographie fournie."}
      </p>

      {/* Core Technology Skills */}
      <div className="flex flex-wrap gap-1.5 mt-5">
        {talent.skills && talent.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2 py-1 text-[10px] font-mono font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md flex items-center gap-1"
          >
            <Code className="w-3 h-3 text-[var(--brand-400)]" />
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between">
        {/* Score indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[var(--text-primary)] leading-none">{xp} XP</p>
            <p className="text-[10px] text-[var(--text-tertiary)] font-medium mt-1 uppercase tracking-wider">{projectsCount} projets</p>
          </div>
        </div>

        {/* Links & CTA */}
        <div className="flex items-center gap-2">
          {talent.github_url && (
            <a
              href={talent.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors"
              title="GitHub Profile"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          )}
          {talent.linkedin_url && (
            <a
              href={talent.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors"
              title="LinkedIn Profile"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          )}
          {talent.email && (
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="p-2 rounded-lg bg-[var(--brand-50)] hover:bg-[var(--brand-100)] text-[var(--brand-500)] transition-colors cursor-pointer"
              title={showEmail ? talent.email : "Afficher l'e-mail de contact"}
            >
              <Mail className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showEmail && talent.email && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-center"
        >
          <p className="text-xs text-[var(--text-secondary)] font-mono select-all truncate">{talent.email}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
