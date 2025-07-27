import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/store/useStore";
import { Candidate } from "@/types";
import { SortableTableHeader } from "@/components/SortableTableHeader";
import { CandidateTableRow } from "@/components/CandidateTableRow";

interface CandidateTableProps {
  candidates: Candidate[];
  showCheckboxes?: boolean;
  showAiScore?: boolean;
  showMatchReasons?: boolean;
}

type SortField = 'name' | 'experience' | 'rating' | 'score' | 'aiScore';
type SortDirection = 'asc' | 'desc';

export function CandidateTable({ 
  candidates, 
  showCheckboxes = false, 
  showAiScore = true, 
  showMatchReasons = false 
}: CandidateTableProps) {
  const { 
    selectedCandidates, 
    toggleCandidateSelection, 
    setSelectedCandidates,
    updateCandidateRating 
  } = useStore();

  const [sortField, setSortField] = useState<SortField>('aiScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Calculate AI scores for candidates (mock implementation)
  const candidatesWithAIScore = candidates.map(candidate => ({
    ...candidate,
    aiScore: Math.floor(Math.random() * 40) + 60, // Mock AI score between 60-100
    applicationStrength: Math.random() > 0.5 ? 'Strong' : 'Good',
    keyHighlights: [
      'Relevant experience',
      'Strong technical skills', 
      'Good cultural fit'
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  }));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCandidates = [...candidatesWithAIScore].sort((a, b) => {
    let aValue: any = a[sortField as keyof Candidate];
    let bValue: any = b[sortField as keyof Candidate];

    if (sortField === 'aiScore') {
      aValue = a.aiScore || 0;
      bValue = b.aiScore || 0;
    }

    if (sortField === 'name') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckboxes && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>
                <SortableTableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  Name
                </SortableTableHeader>
              </TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>
                <SortableTableHeader field="experience" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  Exp.
                </SortableTableHeader>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Skills</TableHead>
              <TableHead className="hidden lg:table-cell">Education</TableHead>
              <TableHead className="hidden lg:table-cell">Position Applied For</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>
                <SortableTableHeader field="score" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                AI Score
                </SortableTableHeader>
              </TableHead>
              {showAiScore && (
                <TableHead>
                  <SortableTableHeader 
                    field="aiScore" 
                    sortField={sortField} 
                    sortDirection={sortDirection} 
                    onSort={handleSort}
                    showIcon
                  >
                    AI Score
                  </SortableTableHeader>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedCandidates.map((candidate) => (
              <CandidateTableRow
                key={candidate.id}
                candidate={candidate}
                showCheckboxes={showCheckboxes}
                showAiScore={showAiScore}
                showMatchReasons={showMatchReasons}
                isSelected={selectedCandidates.includes(candidate.id)}
                onToggleSelection={toggleCandidateSelection}
                onUpdateRating={updateCandidateRating}
                positionApplied={candidate.position_applied}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
