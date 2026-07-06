export interface StudentProfile {
  onboarding_completed?: boolean;
  [key: string]: any;
}

export interface UserProfileStats {
  coursesCompleted: number;
  certificates: number;
  learningHours: number;
  points: number;
  levelNumber: number;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  bio: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  personal_goals: string;
  is_public_profile: boolean;
  email_verified: boolean;
  otp_enabled: boolean;
  date_joined: string;
  last_login: string | null;
  is_instructor: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  instructor_status: "pending" | "approved" | "rejected";
  student_profile?: StudentProfile;
  stats?: UserProfileStats;
  xp_points?: number;
}
