import { motion } from "framer-motion";
import { Users, Trophy, Briefcase, Stars } from "lucide-react";

export type TabType = 'talents' | 'leaderboard' | 'jobs' | 'challenges';

interface CommunityTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function CommunityTabs({ activeTab, setActiveTab }: CommunityTabsProps) {
  const tabs: { id: TabType; label: string; icon: any; countBadge?: string }[] = [
    { id: 'talents', label: 'Talents', icon: Users },
    { id: 'leaderboard', label: 'Classement ML', icon: Trophy },
    { id: 'jobs', label: 'Recrutement', icon: Briefcase },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
  ];

  return (
    <div id="community-tabs-container" className="flex flex-wrap items-center justify-center gap-2 mb-12 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            id={`tab-btn-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black tracking-[0.16em] uppercase transition-all duration-300 pointer-events-auto cursor-pointer border font-display ${
              isActive
                ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/[0.04] shadow-[0_4px_24px_rgba(99,102,241,0.08)]'
                : 'text-slate-400 border-white/5 bg-white/[0.01] hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="active-tab-glow"
                className="absolute inset-0 rounded-full border border-indigo-500/30 bg-indigo-500/[0.01] pointer-events-none"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
