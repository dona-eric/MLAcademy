import React from "react";
import { Search, UserPlus, MessageSquare, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface CommunityHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  activeTab: string;
  onOpenRegisterModal?: () => void;
}

export function CommunityHero({
  searchQuery,
  setSearchQuery,
  onSearch,
  onOpenRegisterModal,
}: CommunityHeroProps) {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-28 pb-12 text-center border-b border-white/10 bg-[#051424]">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Display Heading with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#c0c1ff] via-[#8083ff] to-[#5de6ff] bg-clip-text text-transparent max-w-4xl mx-auto leading-tight"
        >
          MLAcademy Hub: L'épicentre des talents IA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-[#c7c4d7] mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Connectez-vous avec les meilleurs ingénieurs, data scientists et chercheurs du monde entier pour propulser l'avenir de l'intelligence artificielle.
        </motion.p>

        {/* Search Bar & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={onSearch} className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[#c0c1ff]" />
              </div>
              <input
                id="search-input-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des talents, des jobs ou des technologies..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-full py-4 pl-12 pr-6 text-[#d4e4fa] placeholder-[#908fa0] focus:outline-none focus:ring-2 focus:ring-[#5de6ff]/50 focus:border-[#5de6ff] transition-all text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#908fa0] hover:text-[#d4e4fa] uppercase"
                >
                  [Effacer]
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                id="search-submit-btn"
                type="submit"
                className="bg-[#c0c1ff] hover:bg-[#a2eeff] text-[#07006c] font-bold px-6 py-4 rounded-full text-xs tracking-wider uppercase shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
              >
                Filtrer
              </button>

              {onOpenRegisterModal && !user && (
                <button
                  id="register-profile-modal-btn"
                  type="button"
                  onClick={onOpenRegisterModal}
                  className="bg-[#5de6ff] hover:bg-[#a2eeff] text-[#001f25] font-extrabold px-6 py-4 rounded-full text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Rejoindre le Hub</span>
                </button>
              )}

              {user && (
                <Link
                  href="/communaute/messages"
                  className="bg-white/10 hover:bg-white/20 text-[#d4e4fa] border border-white/10 font-bold px-6 py-4 rounded-full text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#5de6ff]" />
                  <span>Messages</span>
                </Link>
              )}

              {user && (user.is_recruiter || user.is_staff) && (
                <Link
                  href="/communaute/recruteur"
                  className="bg-[#5de6ff]/10 border border-[#5de6ff]/30 text-[#5de6ff] hover:bg-[#5de6ff]/20 font-bold px-6 py-4 rounded-full text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Espace Recruteur</span>
                </Link>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
