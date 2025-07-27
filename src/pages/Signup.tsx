import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "hr", // default role
    skills: "",
    jobPosition: "",
    experience: "",
    location: "",
    education: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [jobPositions, setJobPositions] = useState<{id: number, title: string}[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.role === "candidate") {
      setPositionsLoading(true);
      setPositionsError("");
      fetch("http://localhost:5000/api/jobpositions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
        .then(res => res.json())
        .then(data => setJobPositions(data.positions || []))
        .catch(() => setPositionsError("Could not load job positions"))
        .finally(() => setPositionsLoading(false));
    }
  }, [formData.role]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // For candidate, require skills, job position, experience, location, education
    if (formData.role === "candidate" && (
      !formData.skills.trim() ||
      !formData.jobPosition ||
      !formData.experience.trim() ||
      !formData.location.trim() ||
      !formData.education.trim()
    )) {
      toast({
        title: "Missing Information",
        description: "Please fill in all candidate fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          skills: formData.role === "candidate" ? formData.skills : undefined,
          jobPosition: formData.role === "candidate" ? formData.jobPosition : undefined,
          experience: formData.role === "candidate" ? formData.experience : undefined,
          location: formData.role === "candidate" ? formData.location : undefined,
          education: formData.role === "candidate" ? formData.education : undefined
        })
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.error || "Could not create account",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userType", data.user.role);
      localStorage.setItem("token", data.token);
      toast({
        title: "Account Created",
        description: `Welcome to ${formData.role === 'hr' ? 'HR Dashboard' : 'Candidate Portal'}`
      });
      if (formData.role === 'hr') {
        navigate("/login");
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Server error. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sf">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
          <CardDescription>Sign up for HR Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                value={formData.role}
                onChange={e => handleInputChange("role", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="hr">Employer</option>
                <option value="candidate">Candidate</option>
              </select>
            </div>
            {formData.role === "candidate" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g. React, Python, SQL"
                    value={formData.skills}
                    onChange={e => handleInputChange("skills", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobPosition">Job Position</Label>
                  {positionsLoading ? (
                    <div className="text-gray-500 text-sm">Loading positions...</div>
                  ) : positionsError ? (
                    <div className="text-red-500 text-sm">{positionsError}</div>
                  ) : (
                    <select
                      id="jobPosition"
                      value={formData.jobPosition}
                      onChange={e => handleInputChange("jobPosition", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select a position</option>
                      {jobPositions.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.title}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={formData.experience}
                    onChange={e => handleInputChange("experience", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Kigali, Rwanda"
                    value={formData.location}
                    onChange={e => handleInputChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <select
                    id="education"
                    value={formData.education}
                    onChange={e => handleInputChange("education", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select education</option>
                    <option value="HS Diploma">High School Diploma</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </>
            )}
            <Button 
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            <Link to="/landing" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
