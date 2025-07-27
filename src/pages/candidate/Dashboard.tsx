import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, FileText, Download, Briefcase, Send, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CandidateDashboard() {
  const applicationStatus = "under_review";
  const completionPercentage = 75;
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState("");
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [positionsError, setPositionsError] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-500";
      case "under_review": return "bg-yellow-500";
      case "interview": return "bg-purple-500";
      case "accepted": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return <Clock className="h-4 w-4" />;
      case "under_review": return <AlertCircle className="h-4 w-4" />;
      case "interview": return <FileText className="h-4 w-4" />;
      case "accepted": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoadingApps(true);
      setAppsError("");
      try {
        const res = await fetch("http://localhost:5000/api/my-applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        setAppsError("Could not load applications");
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApplications();

    const fetchPositions = async () => {
      setPositionsLoading(true);
      setPositionsError("");
      try {
        const res = await fetch("http://localhost:5000/api/jobpositions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch job positions");
        const data = await res.json();
        setJobPositions(data.positions || []);
      } catch (err) {
        setPositionsError("Could not load job positions");
      } finally {
        setPositionsLoading(false);
      }
    };
    fetchPositions();
  }, []);

  // Find the latest application for details card
  const latestApp = applications.length > 0 ? applications[0] : null;

  // Helper to download file with auth
  const downloadFile = async (filename: string) => {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`http://localhost:5000/api/download/${encodeURIComponent(filename)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("Failed to download file");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 font-sf">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your application progress and manage your profile</p>
      </div>

      {/* Compact dashboard cards for job positions and submitted jobs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1 flex flex-row items-center justify-between p-4">
          <div>
            <p className="text-sm text-gray-500">All Job Positions</p>
            <p className="text-2xl font-bold text-gray-900">
              {positionsLoading ? "-" : positionsError ? "-" : jobPositions.length}
            </p>
          </div>
          <Briefcase className="w-10 h-10 text-blue-500" />
        </Card>
        <Card className="flex-1 flex flex-row items-center justify-between p-4">
          <div>
            <p className="text-sm text-gray-500">Jobs You've Submitted</p>
            <p className="text-2xl font-bold text-gray-900">
              {loadingApps ? "-" : appsError ? "-" : applications.length}
            </p>
          </div>
          <Send className="w-10 h-10 text-green-500" />
        </Card>
        <Card className="flex-1 flex flex-row items-center justify-between p-4">
          {/* <div>
            <p className="text-sm text-gray-500">AI Score</p>
            <p className="text-2xl font-bold text-gray-900">Coming soon</p>
          </div> */}
          <Bot className="w-10 h-10 text-purple-500" />
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(applicationStatus)}
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(applicationStatus)} text-white`}>
              {applicationStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              Your application is currently being reviewed by our HR team.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
              <p className="text-sm text-gray-600">
                Complete your profile to improve your chances
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Profile submitted
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Documents uploaded
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Awaiting HR review
              </li>
            </ul>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[250px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest application updates</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="font-medium text-sm">Last Application Submitted</p>
                <p className="text-xs text-gray-600">
                  {applications.length > 0
                    ? new Date(applications[0].applied_at).toLocaleString()
                    : "No applications yet"}
                </p>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <p className="font-medium text-sm">Total Applications</p>
                <p className="text-xs text-gray-600">
                  {applications.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              {latestApp ? `Position: ${latestApp.job_title}` : "No applications yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestApp ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-600">{latestApp.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Applied At</label>
                  <p className="text-sm text-gray-600">{new Date(latestApp.applied_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CV</label>
                  <p className="text-sm text-gray-600">
                    {latestApp.cv_file ? (
                      <a href={`http://localhost:5000/api/download/${encodeURIComponent(latestApp.cv_file.split('/').pop())}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                    ) : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                  <p className="text-sm text-gray-600">
                    {latestApp.cover_letter_file ? (
                      <a href={`http://localhost:5000/api/download/${encodeURIComponent(latestApp.cover_letter_file.split('/').pop())}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                    ) : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Portfolio</label>
                  <p className="text-sm text-gray-600">
                    {latestApp.portfolio ? (
                      <a href={`http://localhost:5000/api/download/${encodeURIComponent(latestApp.portfolio.split('/').pop())}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                    ) : "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No application details available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applications Table - now below the cards */}
      <div className="mt-6 print-table-area">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Your Applications</h3>
           <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const token = localStorage.getItem("token") || "";
                const res = await fetch("http://localhost:5000/api/my-applications/pdf", {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                  alert("Failed to download PDF");
                  return;
                }
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "my_applications.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              }}
            >
              Download PDF
            </Button>
        </div>
        {loadingApps ? (
          <div className="text-gray-500 text-sm">Loading applications...</div>
        ) : appsError ? (
          <div className="text-red-500 text-sm">{appsError}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead>CV</TableHead>
                  <TableHead>Cover Letter</TableHead>
                  <TableHead>Portfolio</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{app.job_title}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>{new Date(app.applied_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {app.cv_file ? (
                        <Button variant="ghost" size="icon" onClick={() => downloadFile(app.cv_file.split('/').pop())} title="Download CV">
                          <Download className="w-5 h-5" />
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {app.cover_letter_file ? (
                        <Button variant="ghost" size="icon" onClick={() => downloadFile(app.cover_letter_file.split('/').pop())} title="Download Cover Letter">
                          <Download className="w-5 h-5" />
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {app.portfolio ? (
                        <Button variant="ghost" size="icon" onClick={() => downloadFile(app.portfolio.split('/').pop())} title="Download Portfolio">
                          <Download className="w-5 h-5" />
                        </Button>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
