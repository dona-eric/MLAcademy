export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  credentialUrl?: string;
}

export interface MLProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface TalentProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  headline: string; // Ex: "Apprenti MLOps | Passionné de Vision par Ordinateur"
  bio: string;
  xpPoints: number;
  rank: number; // Place dans le leaderboard
  skills: string[]; // Ex: ["Python", "PyTorch", "Docker", "Scikit-Learn"]
  certificates: Certificate[];
  projects: MLProject[];
  joinedAt: string;
}
