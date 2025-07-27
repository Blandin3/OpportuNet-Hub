export interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  cv: string;
  rating?: number;
  score?: number;
  position_applied?: string;
}

export interface FilterState {
  experienceRange: [number, number];
  selectedSkills: string[];
  education: string;
  location: string;
  searchTerm: string;
}

export interface Settings {
  experienceWeight: number;
  skillsWeight: number;
  educationWeight: number;
  defaultMinExperience: number;
  preferredSkills: string[];
}

export interface ScoreWeights {
  experience: number;
  skills: number;
  education: number;
}
