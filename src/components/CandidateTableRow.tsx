import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CandidateActionsCell } from "@/components/CandidateActionsCell";
import { Candidate } from "@/types";

interface CandidateTableRowProps {
  candidate: Candidate & { 
    aiScore?: number;
    applicationStrength?: string;
    keyHighlights?: string[];
    position_applied?: string;
  };
  showCheckboxes: boolean;
  showAiScore: boolean;
  showMatchReasons: boolean;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateRating: (id: string, rating: number) => void;
  positionApplied?: string;
}

export function CandidateTableRow({
  candidate,
  showCheckboxes,
  showAiScore,
  showMatchReasons,
  isSelected,
  onToggleSelection,
  onUpdateRating,
  positionApplied
}: CandidateTableRowProps) {
  return (
    <TableRow>
      {showCheckboxes && (
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(candidate.id)}
          />
        </TableCell>
      )}
      <TableCell className="font-medium font-sf">
        <div>
          {candidate.name}
          {showMatchReasons && candidate.keyHighlights && (
            <div className="text-xs text-gray-600 mt-1 md:hidden">
              {candidate.keyHighlights.slice(0, 1).join(', ')}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell font-sf">
        <div>
          {candidate.email}
          {showMatchReasons && candidate.keyHighlights && (
            <div className="text-xs text-gray-600 mt-1 hidden lg:block">
              {candidate.keyHighlights.slice(0, 2).join(', ')}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="font-sf">{candidate.experience}y</TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs font-sf">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 2 && (
            <Badge variant="outline" className="text-xs font-sf">
              +{candidate.skills.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell font-sf">{candidate.education}</TableCell>
      <TableCell className="hidden lg:table-cell font-sf">{positionApplied || candidate.position_applied || '-'}</TableCell>
      <TableCell className="hidden md:table-cell font-sf">{candidate.location}</TableCell>
      
      <TableCell>
        <Badge variant="outline" className="font-sf">{candidate.score || 0}</Badge>
      </TableCell>
      {showAiScore && (
        <TableCell>
          <Badge 
            variant={candidate.aiScore >= 80 ? "default" : "outline"} 
            className="font-sf"
          >
            {candidate.aiScore || 0}
          </Badge>
        </TableCell>
      )}
      
    </TableRow>
  );
}
