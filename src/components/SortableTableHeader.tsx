
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";

type SortField = 'name' | 'experience' | 'rating' | 'score' | 'aiScore';
type SortDirection = 'asc' | 'desc';

interface SortableTableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showIcon?: boolean;
}

export function SortableTableHeader({ 
  field, 
  children, 
  sortField, 
  sortDirection, 
  onSort,
  showIcon = false 
}: SortableTableHeaderProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="font-semibold justify-start p-0 h-auto font-sf"
    >
      {showIcon && <Sparkles className="mr-1 h-4 w-4" />}
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );
}
