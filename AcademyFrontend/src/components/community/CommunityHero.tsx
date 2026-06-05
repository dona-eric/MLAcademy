import React from "react";
import { Search, UserPlus, CircleAlert } from "lucide-react";
import { motion } from "framer-motion";

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
  activeTab,
  onOpenRegisterModal,
}: CommunityHeroProps) {
  // Translate activeTab to friendly label for advice tips
  const getTip = () => {
    switch (activeTab) {
      case "talents":
        return "Essayez: 'NLP', 'Sénégal', 'PyTorch', 'Vision'";
      case "leaderboard":
        return "Recherchez par nom, pays ou badge spécialisé";
      case "jobs":
        return "Filtrez: 'Remote', 'Kubernetes', 'Senior', 'Lelapa'";
      case "challenges":
        return "Explorez par thématique: 'Climate', 'Healthcare', 'Zindi'";
      default:
        return "Saisissez un mot-clé pour filtrer l'écosystème";
    }
  };

  return (
    <div id="community-hero" className="relative overflow-hidden pt-28 pb-16 bg-[#090C14]">
      {/* Background Gradients */}
      <div className="glow-extremity-top"></div>
      <div className="glow-extremity-bottom"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        {/* Hub Badge - Sophisticated Style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <span className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-[11px] mb-4.5 block">
            L'Écosystème Intelligent Tech de MLAcademy
          </span>
        </motion.div>

        {/* Display Heading - Sophisticated Style */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white max-w-4xl mx-auto leading-tight"
        >
          MLAcademy <br />
          <span className="italic-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Community Hub
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mt-6 font-normal leading-relaxed tracking-wide"
        >
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
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="search-input-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un talent, un framework, ou un pays..."
                className="w-full pl-13 pr-12 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/5 transition-all text-sm font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-white uppercase"
                >
                  [Effacer]
                </button>
              )}
            </div>

            <button
              id="search-submit-btn"
              type="submit"
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-black uppercase tracking-widest text-xs rounded-full transition-all shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
            >
              <span>Filtrer</span>
            </button>

            {onOpenRegisterModal && (
              <button
                id="register-profile-modal-btn"
                type="button"
                onClick={onOpenRegisterModal}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rejoindre</span>
              </button>
            )}
          </form>

          {/* Quick Tip / Helper */}
          <div className="flex items-center justify-center gap-1.5 mt-3.5 text-[11px] font-mono tracking-wide text-slate-500">
            <CircleAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getTip()}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
