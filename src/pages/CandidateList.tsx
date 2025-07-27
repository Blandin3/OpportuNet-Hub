import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/FilterPanel";
import { useStore } from "@/store/useStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Printer } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CandidateList() {
  const { 
    filteredCandidates, 
    selectedCandidates, 
    setSelectedCandidates,
    updateCandidateRating,
    applyFilters 
  } = useStore();
  
  const { toast } = useToast();
  const [bulkRatingDialog, setBulkRatingDialog] = useState(false);
  const [bulkRating, setBulkRating] = useState('');

  // New state for the simple candidate table
  const [simpleCandidates, setSimpleCandidates] = useState([]);
  const [loadingSimple, setLoadingSimple] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [keyword, setKeyword] = useState("");

  // Get user role from localStorage
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Fetch simple candidate data for the new table
  useEffect(() => {
    setLoadingSimple(true);
    fetch("http://localhost:5000/api/candidates/simple", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSimpleCandidates(data))
      .finally(() => setLoadingSimple(false));
  }, []);

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Experience', 'Skills', 'Education', 'Location', 'Rating', 'Score'];
    const csvContent = [
      headers.join(','),
      ...filteredCandidates.map(candidate => [
        candidate.name,
        candidate.email,
        candidate.experience,
        `"${candidate.skills.join(', ')}"`,
        candidate.education,
        candidate.location,
        candidate.rating || '',
        candidate.score || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_candidates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkRating = () => {
    const rating = parseInt(bulkRating);
    if (rating >= 0 && rating <= 100 && selectedCandidates.length > 0) {
      selectedCandidates.forEach(id => {
        updateCandidateRating(id, rating);
      });
      setBulkRatingDialog(false);
      setBulkRating('');
      setSelectedCandidates([]);
      toast({
        title: "Bulk Rating Applied",
        description: `Rating of ${rating} applied to ${selectedCandidates.length} candidates.`
      });
    }
  };

  const handleBulkDelete = () => {
    // In a real app, this would delete candidates
    // For demo purposes, we'll just clear the selection
    setSelectedCandidates([]);
    toast({
      title: "Bulk Action",
      description: "Bulk delete functionality would be implemented here.",
      variant: "destructive"
    });
  };

  const openEditDialog = (candidate: any) => {
    setEditCandidate(candidate);
    setEditForm({ ...candidate });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setSavingEdit(true);
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${editCandidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update candidate');
      const updated = await res.json();
      setSimpleCandidates((prev: any) => prev.map((c: any) => c.id === updated.id ? updated : c));
      setEditDialogOpen(false);
      setEditCandidate(null);
      toast({ title: 'Candidate updated', description: `${updated.first_name} ${updated.last_name} updated successfully.` });
    } catch (e) {
      toast({ title: 'Error', description: 'Could not update candidate', variant: 'destructive' });
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter simpleCandidates by keyword
  const filteredSimpleCandidates = keyword.trim() === ""
    ? simpleCandidates
    : simpleCandidates.filter((c: any) => {
        const kw = keyword.toLowerCase();
        return (
          (c.first_name && c.first_name.toLowerCase().includes(kw)) ||
          (c.last_name && c.last_name.toLowerCase().includes(kw)) ||
          (c.skills && c.skills.toLowerCase().includes(kw)) ||
          (c.education && c.education.toLowerCase().includes(kw)) ||
          (c.location && c.location.toLowerCase().includes(kw)) ||
          (c.experience && String(c.experience).toLowerCase().includes(kw))
        );
      });

  // Delete candidate handler
  const handleDeleteCandidate = async (candidate: any) => {
    if (!window.confirm(`Are you sure you want to delete ${candidate.first_name} ${candidate.last_name}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${candidate.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (res.status === 204) {
        setSimpleCandidates((prev: any) => prev.filter((c: any) => c.id !== candidate.id));
        toast({ title: 'Candidate deleted', description: `${candidate.first_name} ${candidate.last_name} deleted successfully.` });
      } else {
        const err = await res.json();
        toast({ title: 'Error', description: err.error || 'Could not delete candidate', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Could not delete candidate', variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600">
            Filter, sort, and manage all job candidates
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedCandidates.length > 0 && (
          <div className="flex gap-2">
            <Dialog open={bulkRatingDialog} onOpenChange={setBulkRatingDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Rate Selected ({selectedCandidates.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Rate Candidates</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Apply rating to {selectedCandidates.length} selected candidates
                  </p>
                  <div>
                    <Label htmlFor="bulk-rating">Rating (0-100)</Label>
                    <Input
                      id="bulk-rating"
                      type="number"
                      min="0"
                      max="100"
                      value={bulkRating}
                      onChange={(e) => setBulkRating(e.target.value)}
                      placeholder="Enter rating..."
                    />
                  </div>
                  <Button onClick={handleBulkRating} className="w-full">
                    Apply Rating
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* New shadcn filter input for keywording */}
      <div className="mb-4 max-w-md">
        <Input
          placeholder="Type anything to filter candidates (name, skill, location, etc)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      {/* New shadcn/ui table for simple candidate data */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            All Candidates
            <Button
              variant="ghost"
              size="icon"
              aria-label="Print Candidates"
              onClick={async () => {
                const res = await fetch("http://localhost:5000/api/candidates/simple/csv", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                  },
                });
                if (res.ok) {
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "candidates.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                }
              }}
            >
              <Printer className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingSimple ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredSimpleCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No candidates found.</TableCell>
                  </TableRow>
                ) : (
                  filteredSimpleCandidates.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.first_name}</TableCell>
                      <TableCell>{c.last_name}</TableCell>
                      <TableCell>{c.skills}</TableCell>
                      <TableCell>{c.education}</TableCell>
                      <TableCell>{c.location}</TableCell>
                      <TableCell>{c.experience}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(c)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCandidate(c)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Candidate</DialogTitle>
              </DialogHeader>
              {editCandidate && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" value={editForm.first_name || ''} onChange={handleEditChange} />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" value={editForm.last_name || ''} onChange={handleEditChange} />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input id="skills" name="skills" value={editForm.skills || ''} onChange={handleEditChange} />
                  </div>
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input id="education" name="education" value={editForm.education || ''} onChange={handleEditChange} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={editForm.location || ''} onChange={handleEditChange} />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Input id="experience" name="experience" type="number" value={editForm.experience || ''} onChange={handleEditChange} />
                  </div>
                  <Button type="submit" className="w-full" disabled={savingEdit}>{savingEdit ? 'Saving...' : 'Save'}</Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
