
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default function DataProtection() {
  return (
    <div className="p-6 space-y-6 font-sf max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900">Data Protection & Privacy</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your privacy and data security are our top priorities. Learn how we protect your information 
          and what you can do to keep your data safe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              How We Protect Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">End-to-End Encryption</p>
                  <p className="text-xs text-gray-600">All data transmitted is encrypted using industry-standard protocols</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Storage</p>
                  <p className="text-xs text-gray-600">Your files are stored in secure, encrypted databases</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Access Control</p>
                  <p className="text-xs text-gray-600">Only authorized personnel can access your information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Regular Audits</p>
                  <p className="text-xs text-gray-600">We conduct regular security audits and compliance checks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Data We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Personal Information</Badge>
                <p className="text-xs text-gray-600">Name, email, phone, address for identification and communication</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Professional Data</Badge>
                <p className="text-xs text-gray-600">Resume, work experience, skills, and qualifications</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Application Data</Badge>
                <p className="text-xs text-gray-600">Cover letters, preferences, and application status</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Usage Analytics</Badge>
                <p className="text-xs text-gray-600">Platform usage patterns to improve our services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-600" />
            Your Rights & Controls
          </CardTitle>
          <CardDescription>
            You have full control over your personal data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium text-sm mb-1">Access</h3>
              <p className="text-xs text-gray-600">View all data we have about you</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium text-sm mb-1">Correct</h3>
              <p className="text-xs text-gray-600">Update or correct your information</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium text-sm mb-1">Restrict</h3>
              <p className="text-xs text-gray-600">Limit how we use your data</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h3 className="font-medium text-sm mb-1">Delete</h3>
              <p className="text-xs text-gray-600">Request deletion of your data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Best Practices for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Use Strong Passwords</p>
                <p className="text-xs text-gray-600">Create unique, complex passwords for your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Keep Information Updated</p>
                <p className="text-xs text-gray-600">Regularly review and update your profile information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Log Out When Done</p>
                <p className="text-xs text-gray-600">Always log out when using shared or public computers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Report Suspicious Activity</p>
                <p className="text-xs text-gray-600">Contact us immediately if you notice unusual account activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">GDPR</Badge>
                <span className="text-sm text-gray-600">EU General Data Protection Regulation</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">CCPA</Badge>
                <span className="text-sm text-gray-600">California Consumer Privacy Act</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">SOC 2</Badge>
                <span className="text-sm text-gray-600">Security, Availability & Confidentiality</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">ISO 27001</Badge>
                <span className="text-sm text-gray-600">Information Security Management</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need Help?</strong> Contact our Data Protection Officer at 
                <span className="font-medium"> privacy@company.com</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
