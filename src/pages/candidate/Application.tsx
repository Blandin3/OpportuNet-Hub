import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Check } from "lucide-react";

export default function Application() {
  const initialFormData = {
    fullName: "",
    position: "",
    coverLetter: "",
    reasonForApplying: "",
    compensationExpectation: "",
    availableStartDate: "",
    additionalInfo: ""
  };
  const initialUploadedFiles = {
    cv: null as File | null,
    coverLetter: null as File | null,
    portfolio: null as File | null
  };
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState(initialUploadedFiles);
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [jobPositions, setJobPositions] = useState<{id: number, title: string}[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [positionsError, setPositionsError] = useState("");

  useEffect(() => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`
    });
  };

  const FileUploadSection = ({ 
    title, 
    type, 
    accept = ".pdf,.doc,.docx" 
  }: { 
    title: string; 
    type: keyof typeof uploadedFiles; 
    accept?: string; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
            {uploadedFiles[type] ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span>{uploadedFiles[type]?.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            )}
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(type, file);
              }}
            />
          </div>
        </label>
      </CardContent>
    </Card>
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("job_position_id", String(formData.position)); // Ensure it's an ID
      form.append("cover_letter", formData.coverLetter);
      form.append("reason_for_applying", formData.reasonForApplying);
      form.append("compensation_expectation", formData.compensationExpectation);
      form.append("available_start_date", formData.availableStartDate);
      form.append("additional_info", formData.additionalInfo);
      if (uploadedFiles.cv) form.append("cv", uploadedFiles.cv);
      if (uploadedFiles.coverLetter) form.append("coverLetter", uploadedFiles.coverLetter);
      if (uploadedFiles.portfolio) form.append("portfolio", uploadedFiles.portfolio);
      const res = await fetch("http://localhost:5000/api/jobapplications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted for review.",
        });
        setFormData(initialFormData);
        setUploadedFiles(initialUploadedFiles);
      } else {
        if (res.status === 409 && data.error) {
          toast({
            title: "Duplicate Application",
            description: data.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Submission Failed",
            description: data.error || "An error occurred.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sf max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Job Application</h1>
        <p className="text-gray-600 mt-2">Complete your application and upload required documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Provide information about your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Names</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position Applied For</Label>
                {positionsLoading ? (
                  <div className="text-gray-500 text-sm">Loading positions...</div>
                ) : positionsError ? (
                  <div className="text-red-500 text-sm">{positionsError}</div>
                ) : (
                  <select
                    id="position"
                    value={formData.position}
                    onChange={e => handleInputChange("position", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  >
                    <option value="">Select a position</option>
                    {jobPositions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reasonForApplying">Why are you interested in this position?</Label>
              <Textarea
                id="reasonForApplying"
                rows={4}
                value={formData.reasonForApplying}
                onChange={(e) => handleInputChange("reasonForApplying", e.target.value)}
                placeholder="Explain your motivation and interest in this role..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compensationExpectation">Salary Expectation(RWF)</Label>
                <Input
                  id="compensationExpectation"
                  value={formData.compensationExpectation}
                  onChange={(e) => handleInputChange("compensationExpectation", e.target.value)}
                  placeholder="e.g., RWF 80,000 - RWF 5,000,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableStartDate">Available Start Date</Label>
                <Input
                  id="availableStartDate"
                  type="date"
                  value={formData.availableStartDate}
                  onChange={(e) => handleInputChange("availableStartDate", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                rows={3}
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FileUploadSection 
          title="Resume/CV" 
          type="cv" 
        />
        <FileUploadSection 
          title="Cover Letter" 
          type="coverLetter" 
        />
        <FileUploadSection 
          title="Portfolio" 
          type="portfolio" 
          accept=".pdf,.doc,.docx,.zip"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cover Letter</CardTitle>
          <CardDescription>Write a personalized cover letter</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={8}
            value={formData.coverLetter}
            onChange={(e) => handleInputChange("coverLetter", e.target.value)}
            placeholder="Dear Hiring Manager,..."
            className="resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
