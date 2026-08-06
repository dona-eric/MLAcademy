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
  short_description?: string;
  description: string;
  objective?: string;
  rules: string;
  evaluation_criteria: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  difficulty_display?: string;
  category?: 'machine_learning' | 'data_science' | 'deep_learning' | 'nlp' | 'computer_vision' | 'data_engineering' | 'mlops' | 'generative_ai' | 'quantum_ml' | 'business_analytics';
  category_display?: string;
  challenge_type?: 'challenge' | 'hackathon' | 'competition' | 'sprint' | 'bootcamp' | 'kaggle';
  type_display?: string;
  status?: 'draft' | 'open' | 'closed' | 'evaluating' | 'completed';
  status_display?: string;
  start_date?: string;
  deadline: string;
  results_date?: string;
  allow_teams?: boolean;
  max_team_size?: number;
  dataset_url?: string;
  is_dataset_private?: boolean;
  dataset_size?: string;
  dataset_license?: string;
  deliverables?: string[];
  recommended_tech?: string[];
  evaluation_mode?: 'auto' | 'jury' | 'hybrid';
  enable_public_leaderboard?: boolean;
  reward: string;
  prize_pool: string;
  first_prize?: string;
  second_prize?: string;
  third_prize?: string;
  other_perks?: string;
  mentor_name?: string;
  contact_email?: string;
  organizer_website?: string;
  progression_order?: number;
  ranking_tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grand_master';
  badge_reward?: string;
  max_participants: number;
  spots_remaining: number | null;
  is_active: boolean;
  is_open: boolean;
  is_approved?: boolean;
  submissions_count: number;
  created_at: string;
  updated_at?: string;
}

export interface ChallengeSubmission {
  id: number;
  challenge: number;
  challenge_title: string;
  user: number;
  user_name: string;
  username: string;
  user_avatar: string | null;
  submission_number: number;
  repo_url?: string;
  notebook_url?: string;
  demo_url?: string;
  pdf_report_url?: string;
  description?: string;
  score: number | null;
  rank: number | null;
  jury_feedback?: string;
  status: 'draft' | 'submitted' | 'evaluated' | 'winner';
  status_display?: string;
  submitted_at: string;
  created_at: string;
}

export interface CommunityGlobalStats {
  totalTalents: number;
  activeJobs: number;
  activeChallenges: number;
}
