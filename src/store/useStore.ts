
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Candidate, FilterState, Settings } from '@/types';
import candidatesData from '@/data/candidates.json';
import { calculateCandidateScore } from '@/lib/scoring';

interface StoreState {
  candidates: Candidate[];
  filteredCandidates: Candidate[];
  filters: FilterState;
  settings: Settings;
  selectedCandidates: string[];
  
  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  setSettings: (settings: Partial<Settings>) => void;
  updateCandidateRating: (id: string, rating: number) => void;
  setSelectedCandidates: (ids: string[]) => void;
  toggleCandidateSelection: (id: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  experienceRange: [0, 30],
  selectedSkills: [],
  education: 'Any',
  location: 'Any',
  searchTerm: ''
};

const defaultSettings: Settings = {
  experienceWeight: 40,
  skillsWeight: 30,
  educationWeight: 30,
  defaultMinExperience: 0,
  preferredSkills: []
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      candidates: candidatesData as Candidate[],
      filteredCandidates: candidatesData as Candidate[],
      filters: defaultFilters,
      settings: defaultSettings,
      selectedCandidates: [],

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
        get().applyFilters();
      },

      setSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        get().applyFilters();
      },

      updateCandidateRating: (id, rating) => {
        set((state) => ({
          candidates: state.candidates.map(candidate =>
            candidate.id === id ? { ...candidate, rating } : candidate
          )
        }));
        get().applyFilters();
      },

      setSelectedCandidates: (ids) => {
        set({ selectedCandidates: ids });
      },

      toggleCandidateSelection: (id) => {
        set((state) => ({
          selectedCandidates: state.selectedCandidates.includes(id)
            ? state.selectedCandidates.filter(selectedId => selectedId !== id)
            : [...state.selectedCandidates, id]
        }));
      },

      applyFilters: () => {
        const { candidates, filters, settings } = get();
        
        let filtered = candidates.filter(candidate => {
          // Experience filter
          if (candidate.experience < filters.experienceRange[0] || 
              candidate.experience > filters.experienceRange[1]) {
            return false;
          }

          // Skills filter
          if (filters.selectedSkills.length > 0) {
            const hasMatchingSkill = filters.selectedSkills.some(skill =>
              candidate.skills.some(candidateSkill =>
                candidateSkill.toLowerCase().includes(skill.toLowerCase())
              )
            );
            if (!hasMatchingSkill) return false;
          }

          // Education filter
          if (filters.education !== 'Any' && candidate.education !== filters.education) {
            return false;
          }

          // Location filter
          if (filters.location !== 'Any' && candidate.location !== filters.location) {
            return false;
          }

          // Search term filter
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            if (!candidate.name.toLowerCase().includes(searchLower) &&
                !candidate.email.toLowerCase().includes(searchLower)) {
              return false;
            }
          }

          return true;
        });

        // Calculate scores and sort
        filtered = filtered.map(candidate => ({
          ...candidate,
          score: calculateCandidateScore(
            candidate,
            {
              experience: settings.experienceWeight,
              skills: settings.skillsWeight,
              education: settings.educationWeight
            },
            settings.preferredSkills
          )
        })).sort((a, b) => (b.score || 0) - (a.score || 0));

        set({ filteredCandidates: filtered });
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
        get().applyFilters();
      }
    }),
    {
      name: 'hr-app-storage',
      partialize: (state) => ({
        settings: state.settings,
        filters: state.filters
      })
    }
  )
);
