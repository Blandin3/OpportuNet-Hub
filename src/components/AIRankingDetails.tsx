
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface AIRankingDetailsProps {
  candidate: any;
}

export function AIRankingDetails({ candidate }: AIRankingDetailsProps) {
  // Mock AI analysis data
  const analysis = {
    overallScore: candidate.aiScore || 85,
    strengths: [
      "Strong technical background matching job requirements",
      "Excellent communication skills demonstrated in cover letter",
      "Relevant industry experience of 5+ years"
    ],
    improvements: [
      "Could benefit from additional certification in cloud technologies",
      "Limited experience with agile methodologies"
    ],
    skillsMatch: 88,
    experienceMatch: 92,
    educationMatch: 78,
    culturalFit: 85,
    resumeQuality: 90,
    coverLetterQuality: 82
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6 font-sf">
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">Overall Score</span>
            <Badge variant={getScoreVariant(analysis.overallScore)} className="text-lg px-3 py-1">
              {analysis.overallScore}/100
            </Badge>
          </div>
          <Progress value={analysis.overallScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Based on comprehensive analysis of application materials and job requirements
          </p>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Skills Match", score: analysis.skillsMatch },
            { label: "Experience Match", score: analysis.experienceMatch },
            { label: "Education Match", score: analysis.educationMatch },
            { label: "Cultural Fit", score: analysis.culturalFit },
            { label: "Resume Quality", score: analysis.resumeQuality },
            { label: "Cover Letter Quality", score: analysis.coverLetterQuality }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                <Progress value={item.score} className="h-2" />
                <span className={`text-sm font-semibold min-w-[40px] ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Application Materials */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Application Materials Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{analysis.resumeQuality}%</div>
              <div className="text-sm text-gray-600">Resume Quality</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg">{analysis.coverLetterQuality}%</div>
              <div className="text-sm text-gray-600">Cover Letter Quality</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Analysis based on content quality, formatting, relevance, and completeness
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
