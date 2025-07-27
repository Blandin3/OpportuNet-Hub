
import { Candidate } from '@/types';

export interface AIRankingCriteria {
  jobTitle: string;
  requiredSkills: string[];
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  location?: string;
  educationImportance: number; // 0-100
}

export const calculateAIScore = (candidate: Candidate, criteria: AIRankingCriteria): number => {
  let score = 0;
  let maxScore = 0;

  // Experience matching (30% weight)
  const experienceWeight = 30;
  const experienceLevels = {
    junior: { min: 0, max: 3 },
    mid: { min: 2, max: 7 },
    senior: { min: 5, max: 15 },
    lead: { min: 8, max: 30 }
  };
  
  const targetLevel = experienceLevels[criteria.experienceLevel];
  if (candidate.experience >= targetLevel.min && candidate.experience <= targetLevel.max) {
    score += experienceWeight;
  } else if (candidate.experience > targetLevel.max) {
    // Slight penalty for overqualification
    score += experienceWeight * 0.8;
  } else {
    // Penalty for underqualification
    const ratio = candidate.experience / targetLevel.min;
    score += experienceWeight * Math.max(0, ratio);
  }
  maxScore += experienceWeight;

  // Skills matching (40% weight)
  const skillsWeight = 40;
  const matchingSkills = candidate.skills.filter(skill => 
    criteria.requiredSkills.some(required => 
      skill.toLowerCase().includes(required.toLowerCase()) ||
      required.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const skillsScore = criteria.requiredSkills.length > 0 
    ? (matchingSkills.length / criteria.requiredSkills.length) * skillsWeight
    : skillsWeight * 0.5; // Base score if no required skills specified
  
  score += skillsScore;
  maxScore += skillsWeight;

  // Education matching (based on importance setting)
  const educationWeight = criteria.educationImportance * 0.2; // Max 20% weight
  const educationScores: { [key: string]: number } = {
    "Bachelor's": 0.7,
    "Master's": 0.85,
    "PhD": 1.0
  };
  
  const educationScore = (educationScores[candidate.education] || 0.5) * educationWeight;
  score += educationScore;
  maxScore += educationWeight;

  // Location bonus (10% weight)
  const locationWeight = 10;
  if (criteria.location && (candidate.location === criteria.location || candidate.location === 'Remote')) {
    score += locationWeight;
  }
  maxScore += locationWeight;

  return Math.round((score / maxScore) * 100);
};

export const generateJobMatchReasons = (candidate: Candidate, criteria: AIRankingCriteria): string[] => {
  const reasons: string[] = [];

  // Skills analysis
  const matchingSkills = candidate.skills.filter(skill => 
    criteria.requiredSkills.some(required => 
      skill.toLowerCase().includes(required.toLowerCase())
    )
  );

  if (matchingSkills.length > 0) {
    reasons.push(`Strong match: ${matchingSkills.slice(0, 3).join(', ')} skills`);
  }

  // Experience analysis
  const experienceLevels = {
    junior: { min: 0, max: 3, label: 'Junior' },
    mid: { min: 2, max: 7, label: 'Mid-level' },
    senior: { min: 5, max: 15, label: 'Senior' },
    lead: { min: 8, max: 30, label: 'Lead' }
  };

  const targetLevel = experienceLevels[criteria.experienceLevel];
  if (candidate.experience >= targetLevel.min && candidate.experience <= targetLevel.max) {
    reasons.push(`Perfect experience level for ${targetLevel.label} role`);
  }

  // Education analysis
  if (candidate.education === "Master's" || candidate.education === "PhD") {
    reasons.push(`Advanced education: ${candidate.education}`);
  }

  // Location analysis
  if (criteria.location && candidate.location === criteria.location) {
    reasons.push(`Located in ${criteria.location}`);
  } else if (candidate.location === 'Remote') {
    reasons.push('Open to remote work');
  }

  return reasons.length > 0 ? reasons : ['Basic qualifications met'];
};
