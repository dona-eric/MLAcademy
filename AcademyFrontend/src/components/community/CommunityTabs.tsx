import { motion } from "framer-motion";
import { Users, Trophy, Briefcase } from "lucide-react";

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
            className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 pointer-events-auto cursor-pointer border ${
              isActive
                ? 'text-[var(--text-inverse)] border-[var(--brand-500)] bg-[var(--brand-500)] shadow-md'
                : 'text-[var(--text-secondary)] border-[var(--border-default)] bg-[var(--bg-primary)] hover:text-[var(--brand-500)] hover:border-[var(--brand-200)]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="active-tab-glow"
                className="absolute inset-0 rounded-full border border-[var(--brand-400)] pointer-events-none"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--text-inverse)]' : 'text-[var(--text-tertiary)]'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
