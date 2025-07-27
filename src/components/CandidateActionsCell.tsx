import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AIRankingDetails } from "@/components/AIRankingDetails";
import { Candidate } from "@/types";

interface CandidateActionsCellProps {
  candidate: Candidate & { aiScore?: number };
  onUpdateRating: (id: string, rating: number) => void;
}

export function CandidateActionsCell({ candidate, onUpdateRating }: CandidateActionsCellProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ratingDialog, setRatingDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [newRating, setNewRating] = useState('');
  const [editSkillsDialog, setEditSkillsDialog] = useState(false);
  const [skillsInput, setSkillsInput] = useState((candidate.skills && candidate.skills.length > 0) ? candidate.skills.join(", ") : "");
  const [skillsLoading, setSkillsLoading] = useState(false);

  const handleRatingSubmit = () => {
    if (newRating) {
      const rating = parseInt(newRating);
      if (rating >= 0 && rating <= 100) {
        onUpdateRating(candidate.id, rating);
        setRatingDialog(false);
        setNewRating('');
        toast({
          title: "Rating Updated",
          description: `Rating for ${candidate.name} has been updated to ${rating}.`
        });
      }
    }
  };

  const handleSkillsSave = async () => {
    if (!skillsInput.trim()) {
      toast({
        title: "Skills Required",
        description: "Please enter at least one skill.",
        variant: "destructive"
      });
      return;
    }
    setSkillsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`http://localhost:5000/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ skills: skillsInput })
      });
      if (!res.ok) throw new Error("Failed to update skills");
      toast({
        title: "Skills Updated",
        description: `Skills for ${candidate.name} have been updated.`
      });
      setEditSkillsDialog(false);
      // Optionally, trigger a refresh of the candidate list here
    } catch (e) {
      toast({
        title: "Update Failed",
        description: "Could not update skills. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSkillsLoading(false);
    }
  };

  return (
    <div className="flex gap-1 lg:gap-2 flex-col lg:flex-row">
      
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="font-sf text-xs lg:text-sm">
            <Eye className="h-3 w-3 mr-1" />
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-sf">AI Analysis - {candidate.name}</DialogTitle>
          </DialogHeader>
          <AIRankingDetails candidate={candidate} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={ratingDialog} onOpenChange={setRatingDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="font-sf text-xs lg:text-sm">
            Rate
          </Button>
        </DialogTrigger>
        {/* <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-sf">Rate {candidate.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating" className="font-sf">Rating (0-100)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="100"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                placeholder={candidate.rating?.toString() || "Enter rating..."}
                className="font-sf"
              />
            </div>
            <Button onClick={handleRatingSubmit} className="w-full font-sf">
              Update Rating
            </Button>
          </div>
        </DialogContent> */}
      </Dialog>
      <Button
        size="sm"
        variant="outline"
        className="font-sf text-xs lg:text-sm"
        onClick={() => setEditSkillsDialog(true)}
        title="Edit Skills"
      >
        <Pencil className="h-3 w-3 mr-1" />
        Edit
      </Button>
      <Dialog open={editSkillsDialog} onOpenChange={setEditSkillsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-sf">Edit Skills - {candidate.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="skills-edit" className="font-sf">Skills (comma separated)</Label>
              <Input
                id="skills-edit"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="e.g. React, Python, SQL"
                className="font-sf"
              />
            </div>
            <Button onClick={handleSkillsSave} className="w-full font-sf" disabled={skillsLoading}>
              {skillsLoading ? "Saving..." : "Save Skills"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
