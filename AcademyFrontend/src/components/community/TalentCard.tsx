import React, { useState } from "react";
import { TalentProfile } from "@/types/community";
import { Mail, MapPin, CheckCircle, Code, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

interface TalentCardProps {
  talent: TalentProfile;
}

export function TalentCard({ talent }: TalentCardProps) {
  const [showEmail, setShowEmail] = useState(false);

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop";
  const avatar = talent.avatarUrl || defaultAvatar;

  return (
    <motion.div
      id={`talent-card-${talent.id}`}
      whileHover={{ y: -6 }}
      className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-[#c0c1ff] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] group relative"
    >
      {/* Rank badge top left */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5">
        {talent.rank && (
          <span className="bg-white/5 border border-white/10 text-[#c0c1ff] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
            #{talent.rank}
          </span>
        )}
        {talent.rankName && (
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
            {talent.rankName}
          </span>
        )}
      </div>

      {/* Avatar with Gradient Border */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#c0c1ff] to-[#5de6ff] shadow-lg">
          <img
            src={avatar}
            alt={talent.fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full bg-[#051424]"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#5de6ff] rounded-full border-4 border-[#051424] flex items-center justify-center text-[#001f25]">
          <CheckCircle className="w-4 h-4 fill-current text-[#001f25]" />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-black text-white mb-1 tracking-tight">
        {talent.fullName}
      </h3>

      {/* Role / Headline */}
      <p className="text-xs font-bold text-[#5de6ff] mb-2 tracking-widest uppercase">
        {talent.headline || "ML ENGINEER / AI RESEARCHER"}
      </p>

      {/* Country */}
      {talent.country && (
        <div className="flex items-center gap-1.5 text-xs text-[#908fa0] mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#c0c1ff]" />
          <span>{talent.country}</span>
        </div>
      )}

      {/* Bio Copy */}
      <p className="text-[#c7c4d7] text-xs leading-relaxed mb-6 line-clamp-3 max-w-xs">
        {talent.bio || "Membre passionné par le machine learning, la data science et les architectures IA."}
      </p>

      {/* Tech Skills Badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 mt-auto">
        {talent.skills && talent.skills.length > 0 ? (
          talent.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#c7c4d7] flex items-center gap-1 uppercase tracking-wider"
            >
              <Code className="w-3 h-3 text-[#5de6ff]" />
              {skill}
            </span>
          ))
        ) : (
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#c7c4d7]">
            PYTHON
          </span>
        )}
      </div>

      {/* Social Links & Contact */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 w-full">
        {talent.github_url && (
          <a
            href={talent.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#908fa0] hover:text-[#c0c1ff] transition-colors p-2 rounded-lg hover:bg-white/5"
            title="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        )}

        {talent.linkedin_url && (
          <a
            href={talent.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#908fa0] hover:text-[#5de6ff] transition-colors p-2 rounded-lg hover:bg-white/5"
            title="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        )}

        {talent.email && (
          <button
            onClick={() => setShowEmail(!showEmail)}
            className="text-[#908fa0] hover:text-[#5de6ff] transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer"
            title="Afficher l'e-mail de contact"
          >
            <Mail className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Email Disclosure */}
      {showEmail && talent.email && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2 bg-slate-950/80 border border-white/10 rounded-lg text-center w-full"
        >
          <p className="text-xs text-[#5de6ff] font-mono select-all truncate">{talent.email}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
