import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import CandidateList from "./pages/CandidateList";
import CandidateProfile from "./pages/CandidateProfile";
import Settings from "./pages/Settings";
import Email from "./pages/Email";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import CandidateDashboard from "./pages/candidate/Dashboard";
import ProfileSettings from "./pages/candidate/ProfileSettings";
import Application from "./pages/candidate/Application";
import DataProtection from "./pages/candidate/DataProtection";
import AdminProfileSettings from "./pages/AdminProfileSettings";
import JobPositions from "./pages/JobPositions";
import AdminApplications from "./pages/AdminApplications";
import AdminAISortApplications from "./pages/AdminAISortApplications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* HR Admin Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute requiredRole="hr">
              <div className="flex min-h-screen bg-white">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/candidates" element={<CandidateList />} />
                    <Route path="/candidate/:id" element={<CandidateProfile />} />
                    <Route path="/email" element={<Email />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<AdminProfileSettings />} />
                    <Route path="/job-positions" element={<JobPositions />} />
                    <Route path="/admin/applications" element={<AdminApplications />} />
                    <Route path="/admin/ai-sort-applications" element={<AdminAISortApplications />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Candidate Portal Protected routes */}
          <Route path="/candidate/*" element={
            <ProtectedRoute requiredRole="candidate">
              <div className="flex min-h-screen bg-white">
                <CandidateSidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/dashboard" element={<CandidateDashboard />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/data-protection" element={<DataProtection />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
