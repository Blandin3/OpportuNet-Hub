
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Star, Users, Brain, Calendar, Link as LinkIcon } from "lucide-react";

export default function Landing() {
  const currentServices = [
    {
      title: "Candidate Filtering",
      description: "Filter candidates by experience, skills, education, and location with customizable criteria.",
      icon: Users
    },
    {
      title: "Scoring System", 
      description: "Rank candidates using a weighted scoring algorithm tailored to your hiring needs.",
      icon: Star
    },
    {
      title: "Candidate Profiles",
      description: "Access detailed profiles with CV previews, ratings, and more.",
      icon: CheckCircle
    }
  ];

  const futureServices = [
    {
      title: "AI-Powered Insights",
      description: "Leverage AI to identify top candidates based on industry trends and predictive analytics.",
      icon: Brain
    },
    {
      title: "Automated Interviews",
      description: "Schedule and evaluate video interviews with automated scoring.",
      icon: Calendar
    },
    {
      title: "Integration with HR Tools",
      description: "Seamlessly integrate with platforms like LinkedIn, Workday, or BambooHR.",
      icon: LinkIcon
    }
  ];

  const testimonials = [
    {
      quote: "This platform halved our hiring time!",
      author: "Jane Doe",
      role: "HR Manager"
    },
    {
      quote: "The AI scoring system is incredibly accurate.",
      author: "John Smith", 
      role: "Talent Acquisition Lead"
    },
    {
      quote: "Finally, an HR tool that actually works.",
      author: "Sarah Johnson",
      role: "Head of People"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sf">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-semibold">HR Evalution Management System</div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Streamline Your Hiring Process
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Filter top talent with precision using our AI-powered HR platform
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Current Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Current Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Other Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 relative">
                  <CardHeader>
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      Available
                    </Badge>
                    <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-gray-700">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-500 text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            What HR Professionals Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <blockquote className="text-lg mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join hundreds of HR professionals who are already using our platform to find the best talent.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/signup">Start Filtering Talent Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-8">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="ghost">Privacy Policy</Button>
          </div>
          <p className="text-gray-600">
            © 2025 HR Evalution Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
