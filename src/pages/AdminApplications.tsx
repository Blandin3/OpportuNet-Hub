import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || "Unexpected response from server");
      }
      if (!res.ok) throw new Error(data.error || "Failed to fetch applications");
      setApplications(data.applications || []);
    } catch (e) {
      setError(e.message || "Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete application");
      }
      setApplications(applications.filter(app => app.application_id !== id));
    } catch (e) {
      alert(e.message || "Error deleting application");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  // Filter applications by keyword
  const filteredApplications = keyword.trim() === ""
    ? applications
    : applications.filter((app: any) => {
        const kw = keyword.toLowerCase();
        return (
          (app.first_name && app.first_name.toLowerCase().includes(kw)) ||
          (app.last_name && app.last_name.toLowerCase().includes(kw)) ||
          (app.email && app.email.toLowerCase().includes(kw)) ||
          (app.job_title && app.job_title.toLowerCase().includes(kw)) ||
          (app.status && app.status.toLowerCase().includes(kw)) ||
          (app.applied_at && new Date(app.applied_at).toLocaleString().toLowerCase().includes(kw)) ||
          (app.cv_file && app.cv_file.toLowerCase().includes(kw)) ||
          (app.cover_letter_file && app.cover_letter_file.toLowerCase().includes(kw)) ||
          (app.portfolio && app.portfolio.toLowerCase().includes(kw))
        );
      });

  if (loading) return <div className="p-8">Loading applications...</div>;
  if (error) return (
    <div className="p-8 text-red-600">
      <div>Error: {error}</div>
      <Button className="mt-4" onClick={fetchApplications}>Retry</Button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Job Applications</h2>
        <div className="flex gap-2">
          <Button onClick={fetchApplications} variant="outline">Refresh</Button>
          <Button onClick={() => {
            const token = localStorage.getItem("token");
            const url = "/api/admin/applications/pdf";
            // Open PDF in new tab with auth header
            // Since browsers don't allow setting headers on <a>, use fetch+blob
            fetch(url, { headers: { Authorization: `Bearer ${token}` } })
              .then(res => res.blob())
              .then(blob => {
                const pdfUrl = window.URL.createObjectURL(blob);
                window.open(pdfUrl, "_blank");
              });
          }} variant="secondary">Print PDF</Button>
        </div>
      </div>
      
      {/* Keyword filter input */}
      <div className="mb-4 max-w-md">
        <Input
          placeholder="Type anything to filter applications (name, email, job title, status, etc)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied At</TableHead>
            <TableHead>CV</TableHead>
            <TableHead>Cover Letter</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.map((app) => (
            <TableRow key={app.application_id}>
              <TableCell>{app.first_name} {app.last_name}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.job_title}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>{new Date(app.applied_at).toLocaleString()}</TableCell>
              <TableCell>
                {app.cv_file ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const fileUrl = `/api/download/${encodeURIComponent(app.cv_file)}`;
                      const res = await fetch(fileUrl, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (!res.ok) {
                        alert("Failed to download file");
                        return;
                      }
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = app.cv_file.split(/[\\/]/).pop(); // get filename
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>
                ) : "-"}
              </TableCell>
              <TableCell>
                {app.cover_letter_file ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const fileUrl = `/api/download/${encodeURIComponent(app.cover_letter_file)}`;
                      const res = await fetch(fileUrl, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (!res.ok) {
                        alert("Failed to download file");
                        return;
                      }
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = app.cover_letter_file.split(/[\\/]/).pop(); // get filename
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>
                ) : "-"}
              </TableCell>
              <TableCell>
                {app.portfolio ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const fileUrl = `/api/download/${encodeURIComponent(app.portfolio)}`;
                      const res = await fetch(fileUrl, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (!res.ok) {
                        alert("Failed to download file");
                        return;
                      }
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = app.portfolio.split(/[\\/]/).pop(); // get filename
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>
                ) : "-"}
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(app.application_id)} disabled={deletingId === app.application_id}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 