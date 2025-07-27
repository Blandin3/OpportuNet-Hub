
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { getUniqueSkills } from "@/lib/scoring";
import { useToast } from "@/hooks/use-toast";
import { X, Save, RotateCcw } from "lucide-react";

export default function Settings() {
  const { candidates, settings, setSettings } = useStore();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const allSkills = getUniqueSkills(candidates);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    // Ensure weights add up to 100
    const totalWeight = localSettings.experienceWeight + localSettings.skillsWeight + localSettings.educationWeight;
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Weights",
        description: "Scoring weights must add up to 100%",
        variant: "destructive"
      });
      return;
    }

    setSettings(localSettings);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      experienceWeight: 40,
      skillsWeight: 30,
      educationWeight: 30,
      defaultMinExperience: 0,
      preferredSkills: []
    };
    setLocalSettings(defaultSettings);
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values."
    });
  };

  const addPreferredSkill = (skill: string) => {
    if (!localSettings.preferredSkills.includes(skill)) {
      setLocalSettings({
        ...localSettings,
        preferredSkills: [...localSettings.preferredSkills, skill]
      });
    }
  };

  const removePreferredSkill = (skillToRemove: string) => {
    setLocalSettings({
      ...localSettings,
      preferredSkills: localSettings.preferredSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleWeightChange = (field: 'experienceWeight' | 'skillsWeight' | 'educationWeight', value: number[]) => {
    const newValue = value[0];
    const currentTotal = localSettings.experienceWeight + localSettings.skillsWeight + localSettings.educationWeight;
    const otherWeights = currentTotal - localSettings[field];
    
    // Don't allow negative values for other weights
    if (newValue > currentTotal) return;
    
    setLocalSettings({
      ...localSettings,
      [field]: newValue
    });
  };

  const totalWeight = localSettings.experienceWeight + localSettings.skillsWeight + localSettings.educationWeight;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Configure scoring weights and default filter preferences
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scoring Weights */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Weights</CardTitle>
            <p className="text-sm text-gray-600">
              Configure how different factors contribute to candidate scores
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Weight Indicator */}
            <div className={`p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
              <p className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-800' : 'text-red-800'}`}>
                Total Weight: {totalWeight}%
                {totalWeight !== 100 && ' (Must equal 100%)'}
              </p>
            </div>

            {/* Experience Weight */}
            <div className="space-y-2">
              <Label>Experience Weight: {localSettings.experienceWeight}%</Label>
              <Slider
                value={[localSettings.experienceWeight]}
                onValueChange={(value) => handleWeightChange('experienceWeight', value)}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                How much years of experience contributes to the overall score
              </p>
            </div>

            {/* Skills Weight */}
            <div className="space-y-2">
              <Label>Skills Weight: {localSettings.skillsWeight}%</Label>
              <Slider
                value={[localSettings.skillsWeight]}
                onValueChange={(value) => handleWeightChange('skillsWeight', value)}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                How much skill matching contributes to the overall score
              </p>
            </div>

            {/* Education Weight */}
            <div className="space-y-2">
              <Label>Education Weight: {localSettings.educationWeight}%</Label>
              <Slider
                value={[localSettings.educationWeight]}
                onValueChange={(value) => handleWeightChange('educationWeight', value)}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                How much education level contributes to the overall score
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filter Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Preferences</CardTitle>
            <p className="text-sm text-gray-600">
              Set default values for common filters
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Minimum Experience */}
            <div className="space-y-2">
              <Label htmlFor="min-experience">
                Default Minimum Experience: {localSettings.defaultMinExperience} years
              </Label>
              <Slider
                value={[localSettings.defaultMinExperience]}
                onValueChange={(value) => 
                  setLocalSettings({
                    ...localSettings,
                    defaultMinExperience: value[0]
                  })
                }
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* Preferred Skills */}
            <div className="space-y-2">
              <Label>Preferred Skills</Label>
              <Select onValueChange={addPreferredSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Add preferred skills..." />
                </SelectTrigger>
                <SelectContent>
                  {allSkills
                    .filter(skill => !localSettings.preferredSkills.includes(skill))
                    .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {localSettings.preferredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {localSettings.preferredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removePreferredSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-600">
                Skills used for calculating skill match scores
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Preview</CardTitle>
          <p className="text-sm text-gray-600">
            See how your settings affect candidate scoring
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {localSettings.experienceWeight}%
              </div>
              <div className="text-sm text-gray-600">Experience Impact</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {localSettings.skillsWeight}%
              </div>
              <div className="text-sm text-gray-600">Skills Impact</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {localSettings.educationWeight}%
              </div>
              <div className="text-sm text-gray-600">Education Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
