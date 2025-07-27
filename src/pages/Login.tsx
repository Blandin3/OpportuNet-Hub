import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'hr' | 'candidate'>("hr");

  const handleLogin = async (userType: 'hr' | 'candidate') => {
    setIsLoading(true);
    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      // Check user type matches selected tab
      if (data.user.role !== userType) {
        toast({
          title: "Login Failed",
          description: `This account is not a ${userType === 'hr' ? 'Employer' : 'Candidate'}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userType", data.user.role);
      localStorage.setItem("token", data.token);
      toast({
        title: "Login Successful",
        description: `Welcome to ${userType === 'hr' ? 'HR Dashboard' : 'Candidate Portal'}`
      });
      if (userType === 'hr') {
        navigate("/");
      } else {
        navigate("/candidate/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Server error. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(tab);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sf">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hr" className="w-full" onValueChange={v => setTab(v as 'hr' | 'candidate')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hr">Employer</TabsTrigger>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
            </TabsList>
            <TabsContent value="hr" className="space-y-4 mt-4">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hr-email">Email</Label>
                  <Input
                    id="hr-email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-password">Password</Label>
                  <Input
                    id="hr-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In the Employer Dashboard"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="candidate" className="space-y-4 mt-4">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-email">Email</Label>
                  <Input
                    id="candidate-email"
                    type="email"
                    placeholder="candidate@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-password">Password</Label>
                  <Input
                    id="candidate-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In as Candidate"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            <Link to="/landing" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
