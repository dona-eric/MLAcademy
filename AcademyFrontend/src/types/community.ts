export interface CompanyMinimal {
  id: number;
  name: string;
  location: string;
  website?: string;
  logo: string | null;
  is_verified: boolean;
}

export interface TalentProfile {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  headline: string;
  bio: string;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  rank: number;
  xpPoints: number;
  skills: string[];
  joinedAt: string;
  stats: {
    coursesCompleted: number;
    certificates: number;
    lessonsCompleted: number;
    challengesWon: number;
    points: number;
  };
  projects: {
    id: string;
    title: string;
    description: string;
    module: string | null;
    repoUrl: string | null;
    submittedAt: string | null;
  }[];
  country?: string;
  badge?: string;
  email?: string;
}

export interface JobOffer {
  id: number;
  company: number;
  company_name: string;
  company_logo: string | null;
  title: string;
  description: string;
  requirements: string;
  location: string;
  contract_type: 'CDI' | 'CDD' | 'STAGE' | 'FREELANCE';
  salary_range: string;
  posted_at: string;
  deadline: string | null;
}

export interface SponsoredChallenge {
  id: number;
  company: number;
  company_name: string;
  company_logo: string | null;
  title: string;
  slug: string;
  description: string;
  rules: string;
  evaluation_criteria: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: string;
  prize_pool: string;
  max_participants: number;
  spots_remaining: number | null;
  dataset_url: string;
  is_active: boolean;
  is_open: boolean;
  submissions_count: number;
  deadline: string;
  created_at: string;
}

export interface CommunityGlobalStats {
  totalTalents: number;
  activeJobs: number;
  activeChallenges: number;
}
