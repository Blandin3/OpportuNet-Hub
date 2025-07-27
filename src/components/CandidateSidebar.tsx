
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, User, FileText, Shield, Menu, X, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CandidateSidebarProps {
  className?: string;
}

export function CandidateSidebar({ className }: CandidateSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    navigate("/landing");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/candidate/dashboard",
      icon: Home,
      current: location.pathname === "/candidate/dashboard"
    },
    {
      name: "Application",
      href: "/candidate/application",
      icon: FileText,
      current: location.pathname === "/candidate/application"
    },
    {
      name: "Data Protection",
      href: "/candidate/data-protection",
      icon: Shield,
      current: location.pathname === "/candidate/data-protection"
    },
    {
      name: "Profile",
      href: "/candidate/profile",
      icon: User,
      current: location.pathname === "/candidate/profile"
    },
    {
      name: "Logout",
      icon: LogOut,
      isLogout: true
    }
  ];

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 font-sf",
      isCollapsed ? "w-16" : "w-64",
      "lg:relative lg:translate-x-0",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-gray-900 font-sf">Candidate Portal</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 lg:flex hidden"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          if (item.isLogout) {
            return (
              <Button
                key="logout"
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full justify-start font-sf text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Logout"}
              </Button>
            );
          }
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={item.current ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start font-sf",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
