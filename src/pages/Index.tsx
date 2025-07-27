// This file is no longer needed as we're using the new App structure
// Redirecting to Home component
import { Navigate, Link } from "react-router-dom";
import AdminApplications from "./AdminApplications";

const Index = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to the HR Management System</h1>
      <ul className="space-y-2">
        <li><Link to="/job-positions" className="text-blue-600 underline">Manage Job Positions</Link></li>
        {/* Add other links here as needed */}
      </ul>
    </div>
  );
};

export default Index;
