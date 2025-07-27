
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, MapPin, GraduationCap, Briefcase, Star, Download, FileText, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIRankingDetails } from "@/components/AIRankingDetails";

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { candidates, updateCandidateRating } = useStore();
  
  const [ratingDialog, setRatingDialog] = useState(false);
  const [aiAnalysisDialog, setAiAnalysisDialog] = useState(false);
  const [newRating, setNewRating] = useState('');

  const candidate = candidates.find(c => c.id === id);

  // Mock application data
  const applicationData = {
    applicationDate: "2024-01-15",
    position: "Senior Frontend Developer",
    compensationExpectation: "$85,000 - $95,000",
    applicationReason: "I am excited about this opportunity to join your innovative team and contribute to building cutting-edge web applications. Your company's commitment to user experience aligns perfectly with my passion for creating intuitive, accessible interfaces.",
    availability: "Immediate",
    workPreference: "Hybrid",
    aiScore: 87
  };

  if (!candidate) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
        <Button onClick={() => navigate('/candidates')}>
          Back to Candidates
        </Button>
      </div>
    );
  }

  const handleRatingSubmit = () => {
    const rating = parseInt(newRating);
    if (rating >= 0 && rating <= 100) {
      updateCandidateRating(candidate.id, rating);
      setRatingDialog(false);
      setNewRating('');
      toast({
        title: "Rating Updated",
        description: `Rating for ${candidate.name} has been updated to ${rating}.`
      });
    }
  };

  const handleDownload = (type: 'cv' | 'coverLetter') => {
    // Mock download functionality
    toast({
      title: "Download Started",
      description: `Downloading ${type === 'cv' ? 'CV' : 'Cover Letter'} for ${candidate.name}`
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sf">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/candidates')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Candidates
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{candidate.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {candidate.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{candidate.rating}</span>
                    </div>
                  )}
                  {candidate.score && (
                    <Badge variant="outline" className="text-sm">
                      Score: {candidate.score}
                    </Badge>
                  )}
                  <Badge variant="default" className="text-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI: {applicationData.aiScore}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4" />
                    <h3 className="font-semibold">Experience</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {candidate.experience} years
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <h3 className="font-semibold">Education</h3>
                  </div>
                  <p className="text-lg font-medium">{candidate.education}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Application Details */}
              <div>
                <h3 className="font-semibold mb-4">Application Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Applied Position</Label>
                    <p className="font-medium">{applicationData.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Application Date</Label>
                    <p className="font-medium">{applicationData.applicationDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Compensation Expectation</Label>
                    <p className="font-medium">{applicationData.compensationExpectation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Availability</Label>
                    <p className="font-medium">{applicationData.availability}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600">Reason for Applying</Label>
                  <p className="mt-1 text-sm leading-relaxed">{applicationData.applicationReason}</p>
                </div>
              </div>

              <Separator />

              {/* CV Preview */}
              <div>
                <h3 className="font-semibold mb-3">CV Summary</h3>
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <Textarea
                      value={candidate.cv}
                      readOnly
                      className="min-h-[100px] resize-none border-none bg-transparent"
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{applicationData.aiScore}/100</div>
                <div className="text-sm text-gray-600">Overall AI Score</div>
              </div>
              
              <Dialog open={aiAnalysisDialog} onOpenChange={setAiAnalysisDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    View AI Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>AI Analysis - {candidate.name}</DialogTitle>
                  </DialogHeader>
                  <AIRankingDetails candidate={{...candidate, aiScore: applicationData.aiScore}} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={ratingDialog} onOpenChange={setRatingDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    {candidate.rating ? 'Update Rating' : 'Rate Candidate'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate {candidate.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Rating (0-100)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="100"
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                        placeholder={candidate.rating?.toString() || "Enter rating..."}
                      />
                    </div>
                    <Button onClick={handleRatingSubmit} className="w-full">
                      Update Rating
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownload('cv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownload('coverLetter')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Download Cover Letter
              </Button>
              
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{candidate.experience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Skills Count:</span>
                <span className="font-medium">{candidate.skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education:</span>
                <span className="font-medium">{candidate.education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Manual Rating:</span>
                <span className="font-medium">
                  {candidate.rating || 'Not rated'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calculated Score:</span>
                <span className="font-medium">
                  {candidate.score || 'Not calculated'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI Score:</span>
                <span className="font-medium text-blue-600">
                  {applicationData.aiScore}/100
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
