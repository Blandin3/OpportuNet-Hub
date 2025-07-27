
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X } from 'lucide-react';
import { AIRankingCriteria } from '@/lib/aiRanking';
import { useStore } from '@/store/useStore';

interface AIRankingPanelProps {
  onApplyAIRanking: (criteria: AIRankingCriteria) => void;
}

export function AIRankingPanel({ onApplyAIRanking }: AIRankingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'junior' | 'mid' | 'senior' | 'lead'>('mid');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [educationImportance, setEducationImportance] = useState([50]);

  const { candidates } = useStore();
  const availableLocations = [...new Set(candidates.map(c => c.location))].filter(Boolean);

  const addSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleApply = () => {
    const criteria: AIRankingCriteria = {
      jobTitle,
      requiredSkills,
      experienceLevel,
      location: location || undefined,
      educationImportance: educationImportance[0]
    };
    onApplyAIRanking(criteria);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        className="mb-4 font-sf"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        AI Smart Ranking
      </Button>
    );
  }

  return (
    <Card className="mb-6 font-sf">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            AI Smart Ranking
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="font-sf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={(value: any) => setExperienceLevel(value)}>
              <SelectTrigger className="font-sf">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="junior">Junior (0-3 years)</SelectItem>
                <SelectItem value="mid">Mid-level (2-7 years)</SelectItem>
                <SelectItem value="senior">Senior (5-15 years)</SelectItem>
                <SelectItem value="lead">Lead (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Required Skills</Label>
          <div className="flex gap-2 mb-2">
            <Input
              id="skills"
              placeholder="Add a skill (e.g., React, Python)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-sf"
            />
            <Button onClick={addSkill} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer font-sf"
                onClick={() => removeSkill(skill)}
              >
                {skill} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Preferred Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="font-sf">
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="">Any location</SelectItem>
                {availableLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Education Importance: {educationImportance[0]}%</Label>
            <Slider
              value={educationImportance}
              onValueChange={setEducationImportance}
              max={100}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleApply} className="font-sf">
            Apply AI Ranking
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="font-sf">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
