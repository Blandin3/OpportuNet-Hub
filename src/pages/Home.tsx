import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { calculateAIScore, generateJobMatchReasons, AIRankingCriteria } from "@/lib/aiRanking";
import { Candidate } from "@/types";
import { AIRankingPanel } from "@/components/AIRankingPanel";
import { Users, Star, TrendingUp, Filter, Sparkles, GraduationCap } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
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

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen font-sf">
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 font-sf">HR Dashboard</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {/* Candidates Available */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-blue-100 to-blue-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">Candidates Available</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{simpleCandidates.length}</div>
            </CardContent>
          </Card>

          {/* Most Common Degree */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-green-100 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">Most Common Degree</CardTitle>
              <GraduationCap className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-900">
                {(() => {
                  if (!simpleCandidates.length) return 'N/A';
                  const degreeCounts = simpleCandidates.reduce((acc: any, c: any) => {
                    if (c.education) acc[c.education] = (acc[c.education] || 0) + 1;
                    return acc;
                  }, {});
                  const sorted = Object.entries(degreeCounts).sort((a: any, b: any) => b[1] - a[1]);
                  return sorted.length ? sorted[0][0] : 'N/A';
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Average Experience */}
          <Card className="shadow-md border-0 bg-white to-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-yellow-900">Average Experience</CardTitle>
              <TrendingUp className="h-6 w-6 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-900">
                {(() => {
                  if (!simpleCandidates.length) return 'N/A';
                  const total = simpleCandidates.reduce((sum: number, c: any) => sum + (parseInt(c.experience) || 0), 0);
                  return (total / simpleCandidates.length).toFixed(1) + ' yrs';
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Average AI Result (placeholder) */}
          {/* <Card className="shadow-md border-0 bg-gradient-to-br from-purple-100 to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">Average AI Result</CardTitle>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </CardHeader> */}
            {/* <CardContent>
              <div className="text-lg font-bold text-purple-900">Coming soon</div>
            </CardContent> 
          </Card>*/}
        </div>
      </div>

      {/* New shadcn filter input for keywording */}

      {/* New shadcn/ui table for simple candidate data */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            All Candidates
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingSimple ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredSimpleCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No candidates found.</TableCell>
                  </TableRow>
                ) : (
                  filteredSimpleCandidates.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.first_name}</TableCell>
                      <TableCell>{c.last_name}</TableCell>
                      <TableCell>{c.skills}</TableCell>
                      <TableCell>{c.education}</TableCell>
                      <TableCell>{c.location}</TableCell>
                      <TableCell>{c.experience} Years</TableCell>
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
