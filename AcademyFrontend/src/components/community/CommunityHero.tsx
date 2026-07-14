import React from "react";
import { Search, UserPlus } from "lucide-react";
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
    <div id="community-hero" className="relative overflow-hidden pt-28 pb-16 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--brand-50)] rounded-full blur-[120px] opacity-70 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        {/* Display Heading - Sophisticated Style */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-tight">
          MLAcademy 
          <span className="text-[var(--brand-500)]">
              {" "}Community Hub
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm lg:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mt-6 font-normal leading-relaxed tracking-wide">
          Découvrez les meilleurs scientifiques de données, postulez à des offres d'emploi exclusives, participez à des défis financés et propulsez l'innovation locale.
        </motion.p>

        {/* Interactive Search & CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mt-10"
        >
          <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                id="search-input-field"
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un talent, un framework, ou un pays..."
                className="w-full pl-13 pr-12 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-glow)] transition-all text-sm font-normal"/>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] uppercase"
                >
                  [Effacer]
                </button>
              )}
            </div>

            <button
              id="search-submit-btn"
              type="submit"
              className="btn-primary px-8 py-4 rounded-2xl text-sm"
            >
              <span>Filtrer</span>
            </button>

            {onOpenRegisterModal && !user && (
              <button
                id="register-profile-modal-btn"
                type="button"
                onClick={onOpenRegisterModal}
                className="btn-secondary px-6 py-4 rounded-2xl text-sm"
              >
                <UserPlus className="w-4 h-4 text-[var(--brand-500)]" />
                <span>Rejoindre</span>
              </button>
            )}

            {user && (
              <Link href="/communaute/messages" className="btn-secondary px-6 py-4 rounded-2xl text-sm whitespace-nowrap">
                Messages
              </Link>
            )}
            
            {user && (user.is_recruiter || user.is_staff) && (
              <Link href="/communaute/recruteur" className="btn-secondary px-6 py-4 rounded-2xl text-sm bg-[var(--brand-50)] text-[var(--brand-600)] border-[var(--brand-200)] whitespace-nowrap">
                Espace Recruteur
              </Link>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
