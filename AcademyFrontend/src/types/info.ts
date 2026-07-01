 export type OnboardingData = {
  domains: string[];
  phone: string;
  gender: string;
  address: { street: string; zip: string; city: string; country: string };
  diplomes: { title: string; year: string; school: string; mention: string }[];
  projects: { title: string; description: string; link: string; year: string }[];
  languages: { french: string; english: string };
  professional: { 
    situation: string; 
    experience: { company: string; role: string; missions: string; duration: string }[]; 
    workPermit: string[]; 
    specificStatus: string[] 
  };
  availability: { hoursPerWeek: string; startDate: string };
  honorDeclaration: boolean;
  selectedCourse: string | null;
  funding: string | null;
};


export interface VerifyEmailResponse {
    success: boolean;
    message: string;
};