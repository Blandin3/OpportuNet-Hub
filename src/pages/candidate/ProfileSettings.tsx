import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    totalExperience: "",
    educationLevel: "",
    currentSalary: "",
    expectedSalary: "",
    availabilityDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/candidates/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        const user = data.user || {};
        const profile = data.profile || {};
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          bio: user.bio || '',
          linkedIn: profile.linkedIn || '',
          github: profile.github || '',
          portfolio: profile.portfolio || '',
          totalExperience: profile.totalExperience || '',
          educationLevel: profile.educationLevel || '',
          currentSalary: profile.currentSalary || '',
          expectedSalary: profile.expectedSalary || '',
          availabilityDate: profile.availabilityDate || ''
        });
      } catch (err) {
        toast({ title: 'Error', description: 'Could not load profile.' });
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/candidates/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          linkedIn: formData.linkedIn,
          github: formData.github,
          portfolio: formData.portfolio,
          totalExperience: formData.totalExperience,
          educationLevel: formData.educationLevel,
          currentSalary: formData.currentSalary,
          expectedSalary: formData.expectedSalary,
          availabilityDate: formData.availabilityDate
        })
      });
      if (!res.ok) throw new Error('Failed to update profile');
      // Refetch updated profile
      const updatedRes = await fetch('http://localhost:5000/api/candidates/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        const user = data.user || {};
        const profile = data.profile || {};
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          bio: user.bio || '',
          linkedIn: profile.linkedIn || '',
          github: profile.github || '',
          portfolio: profile.portfolio || '',
          totalExperience: profile.totalExperience || '',
          educationLevel: profile.educationLevel || '',
          currentSalary: profile.currentSalary || '',
          expectedSalary: profile.expectedSalary || '',
          availabilityDate: profile.availabilityDate || ''
        });
      }
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Could not update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 font-sf max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="w-[850px]">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalExperience">Total Experience (years)</Label>
              <Input
                id="totalExperience"
                value={formData.totalExperience}
                onChange={(e) => handleInputChange("totalExperience", e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Input
                id="educationLevel"
                value={formData.educationLevel}
                onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                placeholder="e.g. Bachelor's Degree"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentSalary">Current Salary(RWF)</Label>
              <Input
                id="currentSalary"
                value={formData.currentSalary}
                onChange={(e) => handleInputChange("currentSalary", e.target.value)}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary(RWF)</Label>
              <Input
                id="expectedSalary"
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                placeholder="e.g. 60000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availabilityDate">Availability Date</Label>
              <Input
                id="availabilityDate"
                type="date"
                value={formData.availabilityDate}
                onChange={(e) => handleInputChange("availabilityDate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload your photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Professional Links</CardTitle>
          <CardDescription>Add your professional profiles and portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              id="linkedIn"
              value={formData.linkedIn}
              onChange={(e) => handleInputChange("linkedIn", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio Website</Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => handleInputChange("portfolio", e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-10">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
