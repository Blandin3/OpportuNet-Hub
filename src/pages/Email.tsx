import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import emailjs from '@emailjs/browser';
import { Mail, Send, FileText } from "lucide-react";


export default function Email() {
  const { candidates } = useStore();
  const { toast } = useToast();
  
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  const emailTemplates = [
    {
      id: "interview",
      name: "Interview Invitation",
      subject: "Interview Invitation - {{position}}",
      message: `Dear {{name}},

We are pleased to invite you for an interview for the position you applied for.

Interview Details:
- Date: [Please specify]
- Time: [Please specify]
- Location: [Please specify]

Please confirm your availability.

Best regards,
HR Team`
    },
    {
      id: "rejection",
      name: "Application Update",
      subject: "Update on Your Application",
      message: `Dear {{name}},

Thank you for your interest in our company and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We appreciate your time and wish you the best in your job search.

Best regards,
HR Team`
    },
    {
      id: "followup",
      name: "Follow-up",
      subject: "Follow-up on Your Application",
      message: `Dear {{name}},

We wanted to follow up on your recent application.

We are currently reviewing applications and will be in touch soon with next steps.

Thank you for your patience.

Best regards,
HR Team`
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        message: template.message
      }));
    }
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    const candidate = candidates.find(c => c.id === candidateId);
    setEmailData(prev => ({
      ...prev,
      to: candidate ? candidate.email : ""
    }));
  };

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all email fields",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Send to multiple recipients (comma-separated)
      const toEmails = emailData.to.split(',').map(e => e.trim()).filter(Boolean);
      const sendPromises = toEmails.map(toEmail =>
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: toEmail,
            subject: emailData.subject,
            message: emailData.message,
          },
          EMAILJS_PUBLIC_KEY
        )
      );
      await Promise.all(sendPromises);
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${emailData.to}`
      });
      setEmailData({ to: "", subject: "", message: "" });
      setSelectedCandidate("");
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "There was an error sending the email.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // EmailJS config (replace with your actual values or use env variables)
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-6 w-6" />
        <h1 className="text-3xl font-bold font-sf">Email Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-sf">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="candidate" className="font-sf">Select Candidate</Label>
                <Select value={selectedCandidate} onValueChange={handleCandidateSelect}>
                  <SelectTrigger className="font-sf">
                    <SelectValue placeholder="Choose candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id} className="font-sf">
                        {candidate.name} - {candidate.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template" className="font-sf">Email Template</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="font-sf">
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="font-sf">
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Composition */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-sf">
                <Send className="h-5 w-5" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="to" className="font-sf">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="candidate@email.com"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  className="font-sf"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="font-sf">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="font-sf"
                />
              </div>

              <div>
                <Label htmlFor="message" className="font-sf">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your email message here..."
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[200px] font-sf"
                />
              </div>

              <Button 
                onClick={handleSendEmail} 
                className="w-full font-sf"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
