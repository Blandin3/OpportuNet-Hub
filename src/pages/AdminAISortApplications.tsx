import { useEffect, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Printer } from "lucide-react";

export default function AdminAISortApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scoring, setScoring] = useState(false);
  const [keyword, setKeyword] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  const fetchAIScoredApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/applications/with-scores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch AI scored applications");
      setApplications(data.applications || []);
    } catch (e) {
      setError(e.message || "Error fetching AI scored applications");
    } finally {
      setLoading(false);
      setScoring(false);
    }
  };

  const handleRefreshScores = async () => {
    setScoring(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/applications/refresh-scores", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refresh AI scores");
      // After refresh, reload applications
      await fetchAIScoredApplications();
    } catch (e) {
      setError(e.message || "Error refreshing AI scores");
      setScoring(false);
    }
  };

  const handlePrintTable = () => {
    if (!tableRef.current) return;
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>AI Sort Applications Table</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background: #f3f3f3; }
            </style>
          </head>
          <body>
            <h2>AI Sort Applications Table</h2>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  };

  useEffect(() => {
    fetchAIScoredApplications();
  }, []);

  // Sort applications by ai_score descending, handle missing/null scores
  const sortedApplications = [...applications].sort((a, b) => {
    const scoreA = typeof a.ai_score === 'number' ? a.ai_score : -1;
    const scoreB = typeof b.ai_score === 'number' ? b.ai_score : -1;
    return scoreB - scoreA;
  });

  // Filter applications by keyword
  const filteredApplications = keyword.trim() === ""
    ? sortedApplications
    : sortedApplications.filter((app: any) => {
        const kw = keyword.toLowerCase();
        return (
          (app.first_name && app.first_name.toLowerCase().includes(kw)) ||
          (app.last_name && app.last_name.toLowerCase().includes(kw)) ||
          (app.email && app.email.toLowerCase().includes(kw)) ||
          (app.job_title && app.job_title.toLowerCase().includes(kw)) ||
          (app.status && app.status.toLowerCase().includes(kw)) ||
          (app.ai_explanation && app.ai_explanation.toLowerCase().includes(kw)) ||
          (app.candidate_skills && Array.isArray(app.candidate_skills) && app.candidate_skills.some((skill: string) => skill.toLowerCase().includes(kw))) ||
          (app.candidate_skills && typeof app.candidate_skills === "string" && app.candidate_skills.toLowerCase().includes(kw)) ||
          (app.candidate_experience && String(app.candidate_experience).toLowerCase().includes(kw)) ||
          (app.candidate_education && app.candidate_education.toLowerCase().includes(kw))
        );
      });

  if (loading) return <div className="p-8">Loading applications...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" /> AI Sort Applications
        </h2>
        <div className="flex gap-2">
          <Button onClick={handlePrintTable} variant="ghost" size="icon" title="Print Table">
            <Printer className="w-5 h-5" />
          </Button>
          <Button onClick={handleRefreshScores} disabled={scoring} variant="secondary">
            {scoring ? "Scoring..." : "Re-run AI Scoring"}
          </Button>
        </div>
      </div>
      
      {/* Keyword filter input */}
      <div className="mb-4 max-w-md">
        <Input
          placeholder="Type anything to filter applications (name, email, job title, skills, etc)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
      
      <div ref={tableRef} className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>AI Explanation</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Education</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app, i) => (
              <TableRow key={app.application_id || i}>
                <TableCell>{app.first_name} {app.last_name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.job_title}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell className={`font-bold text-lg ${app.ai_score === 0 || app.ai_score === null || app.ai_score === undefined ? 'text-gray-400' : 'text-yellow-700'}`}>{
                  app.ai_score === null || app.ai_score === undefined ? <span title="No AI score">—</span> : app.ai_score
                }</TableCell>
                <TableCell className="text-sm text-gray-700">{
                  app.ai_explanation && app.ai_explanation.startsWith('AI error') ?
                    <span className="text-red-500" title={app.ai_explanation}>{app.ai_explanation}</span> :
                    app.ai_explanation || <span className="text-gray-400">—</span>
                }</TableCell>
                <TableCell>{
                  Array.isArray(app.candidate_skills)
                    ? app.candidate_skills.join(", ")
                    : typeof app.candidate_skills === "string"
                      ? app.candidate_skills
                      : ""
                }</TableCell>
                <TableCell>{app.candidate_experience} Years</TableCell>
                <TableCell>{app.candidate_education}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 