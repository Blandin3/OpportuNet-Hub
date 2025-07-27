import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getUniqueSkills, getUniqueLocations, getEducationOptions } from "@/lib/scoring";
import { Label } from "@/components/ui/label";

interface FilterPanelProps {
  onExport?: () => void;
}

const EDUCATION_OPTIONS = [
  "Any",
  "High School Diploma",
  "Bachelor Degree",
  "Masters Degree",
  "PhD Degree"
];

export function FilterPanel({ onExport }: FilterPanelProps) {
  const { 
    candidates, 
    filteredCandidates, 
    filters, 
    setFilters, 
    resetFilters, 
    applyFilters 
  } = useStore();
  const [jobPositions, setJobPositions] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const allSkills = getUniqueSkills(candidates);
  const allLocations = getUniqueLocations(candidates);

  useEffect(() => {
    setLoadingJobs(true);
    fetch("http://localhost:5000/api/jobpositions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.positions) {
          setJobPositions(data.positions.map((p: any) => p.title));
        }
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleSkillSelect = (skill: string) => {
    if (!filters.selectedSkills.includes(skill)) {
      setFilters({
        selectedSkills: [...filters.selectedSkills, skill]
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFilters({
      selectedSkills: filters.selectedSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const quickFilters = [
    {
      label: "5+ Years Experience",
      action: () => setFilters({ experienceRange: [5, 30] })
    },
    {
      label: "Remote Only",
      action: () => setFilters({ location: "Remote" })
    },
    {
      label: "Master's Degree",
      action: () => setFilters({ education: "Master's" })
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Candidates</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            {onExport && (
              <Button onClick={onExport}>
                Export Results
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Filters</label>
          <div className="flex gap-2 flex-wrap">
            {quickFilters.map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={filter.action}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword search */}
          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword</Label>
            <Input
              id="keyword"
              placeholder="Search by name, email, skills, etc."
              value={filters.searchTerm}
              onChange={e => setFilters({ searchTerm: e.target.value })}
              className="w-48"
            />
          </div>

          {/* Location (free text) */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Type any location..."
              value={filters.location === 'Any' ? '' : filters.location}
              onChange={e => setFilters({ location: e.target.value || 'Any' })}
              className="w-40"
            />
          </div>

          {/* Skills (Job Positions) */}
          <div className="space-y-2">
            <Label htmlFor="skills">Job Position</Label>
            <select
              id="skills"
              className="border rounded px-2 py-1 w-44"
              value={filters.selectedSkills[0] || ''}
              onChange={e => setFilters({ selectedSkills: e.target.value ? [e.target.value] : [] })}
            >
              <option value="">Any</option>
              {jobPositions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <select
              id="education"
              className="border rounded px-2 py-1 w-44"
              value={filters.education}
              onChange={e => setFilters({ education: e.target.value })}
            >
              {EDUCATION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Experience Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Experience: {filters.experienceRange[0]}-{filters.experienceRange[1]} years
            </label>
            <Slider
              value={filters.experienceRange}
              onValueChange={(value) => setFilters({ experienceRange: value as [number, number] })}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Skills */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <Select onValueChange={handleSkillSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select skills..." />
            </SelectTrigger>
            <SelectContent>
              {allSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div> */}

        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={applyFilters} className="h-10">Apply</Button>
          <Button variant="outline" onClick={resetFilters} className="h-10">Reset</Button>
          <Button variant="secondary" onClick={onExport} className="h-10">Export CSV</Button>
        </div>
      </div>
    </Card>
  );
}
