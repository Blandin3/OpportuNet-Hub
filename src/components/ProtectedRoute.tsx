
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'hr' | 'candidate';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userType = localStorage.getItem("userType") as 'hr' | 'candidate' | null;

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Role-based access control
  if (requiredRole && userType !== requiredRole) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'hr') {
      return <Navigate to="/" replace />;
    } else if (userType === 'candidate') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
    return <Navigate to="/landing" replace />;
  }

  // Auto-redirect based on user type if on root protected route
  if (location.pathname === "/" && userType === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return <>{children}</>;
}
