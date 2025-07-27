
import { Candidate, ScoreWeights } from '@/types';

export const calculateCandidateScore = (
  candidate: Candidate,
  weights: ScoreWeights,
  preferredSkills: string[] = []
): number => {
  // Experience score (0-100 based on years, max at 20 years)
  const experienceScore = Math.min((candidate.experience / 20) * 100, 100);

  // Skills score based on how many preferred skills the candidate has
  const skillsMatch = preferredSkills.length > 0 
    ? (candidate.skills.filter(skill => 
        preferredSkills.some(preferred => 
          skill.toLowerCase().includes(preferred.toLowerCase()) ||
          preferred.toLowerCase().includes(skill.toLowerCase())
        )
      ).length / preferredSkills.length) * 100
    : candidate.skills.length * 10; // Base score if no preferred skills

  // Education score
  const educationScores: { [key: string]: number } = {
    "Bachelor's": 70,
    "Master's": 85,
    "PhD": 100
  };
  const educationScore = educationScores[candidate.education] || 50;

  // Calculate weighted score
  const totalWeight = weights.experience + weights.skills + weights.education;
  const normalizedWeights = {
    experience: weights.experience / totalWeight,
    skills: weights.skills / totalWeight,
    education: weights.education / totalWeight
  };

  const score = 
    (experienceScore * normalizedWeights.experience) +
    (Math.min(skillsMatch, 100) * normalizedWeights.skills) +
    (educationScore * normalizedWeights.education);

  return Math.round(score);
};

export const getUniqueSkills = (candidates: Candidate[]): string[] => {
  const allSkills = candidates.flatMap(candidate => candidate.skills);
  return [...new Set(allSkills)].sort();
};

export const getUniqueLocations = (candidates: Candidate[]): string[] => {
  const allLocations = candidates.map(candidate => candidate.location);
  return [...new Set(allLocations)].sort();
};

export const getEducationOptions = (): string[] => {
  return ["Any", "Bachelor's", "Master's", "PhD"];
};
