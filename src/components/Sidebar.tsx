import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Users, Settings, Menu, X, Mail, LogOut, User, Briefcase, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
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
      href: "/",
      icon: Home,
      current: location.pathname === "/"
    },
    {
      name: "Candidates",
      href: "/candidates",
      icon: Users,
      current: location.pathname === "/candidates"
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: Briefcase,
      current: location.pathname === "/admin/applications"
    },
    // {
    //   name: "AI Sort Applications",
    //   href: "/admin/ai-sort-applications",
    //   icon: Sparkles,
    //   current: location.pathname === "/admin/ai-sort-applications"
    // },
    {
      name: "Email Center",
      href: "/email",
      icon: Mail,
      current: location.pathname === "/email"
    },
    {
      name: "Job Positions",
      href: "/job-positions",
      icon: Briefcase,
      current: location.pathname === "/job-positions"
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      current: location.pathname === "/profile"
    },
    // {
    //   name: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    //   current: location.pathname === "/settings"
    // },
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
          <h1 className="text-xl font-semibold text-gray-900 font-sf">HR Dashboard</h1>
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
