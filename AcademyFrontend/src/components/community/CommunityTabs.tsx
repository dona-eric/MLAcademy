import { motion } from "framer-motion";
import { Users, Trophy, Briefcase, Award } from "lucide-react";

export type TabType = 'talents' | 'leaderboard' | 'jobs' | 'challenges' | 'badges';

interface CommunityTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function CommunityTabs({ activeTab, setActiveTab }: CommunityTabsProps) {
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'talents', label: 'TALENTS', icon: Users },
    { id: 'leaderboard', label: 'CLASSEMENT', icon: Trophy },
    { id: 'jobs', label: "OFFRES D'EMPLOI", icon: Briefcase },
    { id: 'challenges', label: 'CHALLENGES', icon: Award },
    { id: 'badges', label: 'BADGES & RANGS', icon: Award },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-12">
      <div id="community-tabs-container" className="flex flex-wrap items-center justify-center gap-4 border-b border-white/10 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 pointer-events-auto cursor-pointer ${
                isActive
                  ? 'bg-[#c0c1ff] text-[#07006c] shadow-[0_0_25px_rgba(99,102,241,0.35)] scale-105'
                  : 'text-[#c7c4d7] hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-glow"
                  className="absolute inset-0 rounded-full border border-white/30 pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#07006c]' : 'text-[#908fa0]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
