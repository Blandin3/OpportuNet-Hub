# HR Dashboard - UML Diagrams

## Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HR Candidate Management System                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐                                                                │
│  │   HR    │                                                                │
│  │ Admin   │────────────────┐                                              │
│  └─────────┘                │                                              │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Manage Dashboard │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ View Candidates  │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Filter/Sort      │                               │
│                         │ Candidates       │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ AI Ranking       │                               │
│                         │ Analysis         │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Download CV/     │                               │
│                         │ Cover Letter     │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Send Emails      │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Manage Profile   │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ System Settings  │                               │
│                         └──────────────────┘                               │
│                                                                             │
│  ┌─────────┐                                                                │
│  │Candidate│────────────────┐                                              │
│  └─────────┘                │                                              │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Register/Login   │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Manage Profile   │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Submit           │                               │
│                         │ Application      │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ View Application │                               │
│                         │ Status           │                               │
│                         └──────────────────┘                               │
│                              │                                              │
│                              ▼                                              │
│                         ┌──────────────────┐                               │
│                         │ Data Protection  │                               │
│                         │ Settings         │                               │
│                         └──────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## UML Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HR Dashboard System Classes                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │              User                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - email: string                     │                                     │
│ │ - password: string                  │                                     │
│ │ - firstName: string                 │                                     │
│ │ - lastName: string                  │                                     │
│ │ - role: "hr" | "candidate"          │                                     │
│ │ - phone: string                     │                                     │
│ │ - location: string                  │                                     │
│ │ - profilePicture: string            │                                     │
│ │ - bio: string                       │                                     │
│ │ - createdAt: Date                   │                                     │
│ │ - updatedAt: Date                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + login(): boolean                  │                                     │
│ │ + logout(): void                    │                                     │
│ │ + updateProfile(): boolean          │                                     │
│ │ + validateCredentials(): boolean    │                                     │
│ └─────────────────────────────────────┘                                     │
│                  ▲                                                          │
│                  │                                                          │
│         ┌────────┴────────┐                                                 │
│         │                 │                                                 │
│ ┌───────▼──────┐ ┌────────▼─────────┐                                       │
│ │    HRAdmin   │ │    Candidate     │                                       │
│ ├──────────────┤ ├──────────────────┤                                       │
│ │ - company:   │ │ - skills: array  │                                       │
│ │   string     │ │ - experience:    │                                       │
│ │ - department:│ │   number         │                                       │
│ │   string     │ │ - education:     │                                       │
│ │ - jobTitle:  │ │   string         │                                       │
│ │   string     │ │ - resume: string │                                       │
│ │ - linkedIn:  │ │ - coverLetter:   │                                       │
│ │   string     │ │   string         │                                       │
│ │ - website:   │ │ - portfolio:     │                                       │
│ │   string     │ │   string         │                                       │
│ ├──────────────┤ ├──────────────────┤                                       │
│ │ + viewCandid-│ │ + submitApplica- │                                       │
│ │   ates()     │ │   tion()         │                                       │
│ │ + filterCand-│ │ + updateResume() │                                       │
│ │   idates()   │ │ + viewApplications()                                     │
│ │ + sendEmail()│ │ + manageDPSettings()                                     │
│ │ + generateR- │ └──────────────────┘                                       │
│ │   eports()   │                                                            │
│ └──────────────┘                                                            │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │           Application               │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - candidateId: number               │                                     │
│ │ - jobId: number                     │                                     │
│ │ - status: string                    │                                     │
│ │ - aiScore: number                   │                                     │
│ │ - aiAnalysis: string                │                                     │
│ │ - submittedAt: Date                 │                                     │
│ │ - reviewedAt: Date                  │                                     │
│ │ - reviewedBy: number                │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + calculateAIScore(): number        │                                     │
│ │ + generateAnalysis(): string        │                                     │
│ │ + updateStatus(): boolean           │                                     │
│ │ + downloadDocuments(): File[]       │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │              Job                    │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - title: string                     │                                     │
│ │ - description: text                 │                                     │
│ │ - requirements: text                │                                     │
│ │ - department: string                │                                     │
│ │ - location: string                  │                                     │
│ │ - salary: decimal                   │                                     │
│ │ - employmentType: string            │                                     │
│ │ - postedBy: number                  │                                     │
│ │ - postedAt: Date                    │                                     │
│ │ - closingDate: Date                 │                                     │
│ │ - status: enum                      │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + createJob(): boolean              │                                     │
│ │ + updateJob(): boolean              │                                     │
│ │ + closeJob(): boolean               │                                     │
│ │ + getApplications(): Application[]  │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │            AIRanking                │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - applicationId: number             │                                     │
│ │ - overallScore: number              │                                     │
│ │ - skillsScore: number               │                                     │
│ │ - experienceScore: number           │                                     │
│ │ - educationScore: number            │                                     │
│ │ - personalityScore: number          │                                     │
│ │ - analysisDetails: text             │                                     │
│ │ - strengths: text                   │                                     │
│ │ - improvements: text                │                                     │
│ │ - createdAt: Date                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + analyzeApplication(): void        │                                     │
│ │ + calculateScores(): object         │                                     │
│ │ + generateInsights(): string        │                                     │
│ │ + updateRanking(): boolean          │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │           Document                  │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - candidateId: number               │                                     │
│ │ - applicationId: number             │                                     │
│ │ - type: enum                        │                                     │
│ │ - fileName: string                  │                                     │
│ │ - filePath: string                  │                                     │
│ │ - fileSize: number                  │                                     │
│ │ - mimeType: string                  │                                     │
│ │ - uploadedAt: Date                  │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + uploadDocument(): boolean         │                                     │
│ │ + downloadDocument(): File          │                                     │
│ │ + deleteDocument(): boolean         │                                     │
│ │ + validateFile(): boolean           │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          EmailTemplate              │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - name: string                      │                                     │
│ │ - subject: string                   │                                     │
│ │ - body: text                        │                                     │
│ │ - type: enum                        │                                     │
│ │ - variables: json                   │                                     │
│ │ - createdBy: number                 │                                     │
│ │ - createdAt: Date                   │                                     │
│ │ - updatedAt: Date                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + createTemplate(): boolean         │                                     │
│ │ + updateTemplate(): boolean         │                                     │
│ │ + deleteTemplate(): boolean         │                                     │
│ │ + processVariables(): string        │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │           EmailLog                  │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - fromEmail: string                 │                                     │
│ │ - toEmail: string                   │                                     │
│ │ - subject: string                   │                                     │
│ │ - body: text                        │                                     │
│ │ - templateId: number                │                                     │
│ │ - candidateId: number               │                                     │
│ │ - sentBy: number                    │                                     │
│ │ - sentAt: Date                      │                                     │
│ │ - status: enum                      │                                     │
│ │ - errorMessage: text                │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + sendEmail(): boolean              │                                     │
│ │ + trackDelivery(): boolean          │                                     │
│ │ + resendEmail(): boolean            │                                     │
│ │ + logError(): void                  │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          SystemSettings             │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ - id: number                        │                                     │
│ │ - settingKey: string                │                                     │
│ │ - settingValue: text                │                                     │
│ │ - dataType: enum                    │                                     │
│ │ - description: text                 │                                     │
│ │ - updatedBy: number                 │                                     │
│ │ - updatedAt: Date                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ + getSetting(): string              │                                     │
│ │ + updateSetting(): boolean          │                                     │
│ │ + validateValue(): boolean          │                                     │
│ │ + resetToDefault(): boolean         │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         React Component Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │               App.tsx               │                                     │
│ │         (Main Application)          │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          Router Provider            │                                     │
│ │       (React Router DOM)            │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │         ProtectedRoute              │                                     │
│ │       (Role-based Access)           │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│        ┌──────┴──────┐                                                      │
│        ▼             ▼                                                      │
│ ┌─────────────┐ ┌─────────────────┐                                         │
│ │   Sidebar   │ │ CandidateSidebar│                                         │
│ │ (HR Admin)  │ │  (Candidates)   │                                         │
│ └─────────────┘ └─────────────────┘                                         │
│        │                 │                                                  │
│        ▼                 ▼                                                  │
│ ┌─────────────────────────────────────┐                                     │
│ │             Pages                   │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ • Home                              │                                     │
│ │ • CandidateList                     │                                     │
│ │ • CandidateProfile                  │                                     │
│ │ • AdminProfileSettings              │                                     │
│ │ • Email                             │                                     │
│ │ • Settings                          │                                     │
│ │ • Login/Signup                      │                                     │
│ │ • candidate/Dashboard               │                                     │
│ │ • candidate/ProfileSettings         │                                     │
│ │ • candidate/Application             │                                     │
│ │ • candidate/DataProtection          │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │           Components                │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ • CandidateTable                    │                                     │
│ │ • CandidateTableRow                 │                                     │
│ │ • CandidateActionsCell              │                                     │
│ │ • SortableTableHeader               │                                     │
│ │ • FilterPanel                       │                                     │
│ │ • AIRankingPanel                    │                                     │
│ │ • AIRankingDetails                  │                                     │
│ │ • UI Components (shadcn/ui)         │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          Services/Utils             │                                     │
│ ├─────────────────────────────────────┤                                     │
│ │ • aiRanking.ts                      │                                     │
│ │ • scoring.ts                        │                                     │
│ │ • utils.ts                          │                                     │
│ │ • useStore.ts (Zustand)             │                                     │
│ │ • React Query (Data fetching)       │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Database Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Database Schema (MySQL)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │              Users                  │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ email (UNIQUE)                  │ │                                     │
│ │ │ password                        │ │                                     │
│ │ │ firstName                       │ │                                     │
│ │ │ lastName                        │ │                                     │
│ │ │ role (hr/candidate)             │ │                                     │
│ │ │ phone                           │ │                                     │
│ │ │ location                        │ │                                     │
│ │ │ profilePicture                  │ │                                     │
│ │ │ bio                             │ │                                     │
│ │ │ company                         │ │                                     │
│ │ │ department                      │ │                                     │
│ │ │ jobTitle                        │ │                                     │
│ │ │ linkedIn                        │ │                                     │
│ │ │ website                         │ │                                     │
│ │ │ skills                          │ │                                     │
│ │ │ experience                      │ │                                     │
│ │ │ education                       │ │                                     │
│ │ │ portfolio                       │ │                                     │
│ │ │ createdAt                       │ │                                     │
│ │ │ updatedAt                       │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               │ 1:N                                                         │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │            Jobs                     │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ title                           │ │                                     │
│ │ │ description                     │ │                                     │
│ │ │ requirements                    │ │                                     │
│ │ │ department                      │ │                                     │
│ │ │ location                        │ │                                     │
│ │ │ salary                          │ │                                     │
│ │ │ employmentType                  │ │                                     │
│ │ │ postedBy (FK -> Users.id)       │ │                                     │
│ │ │ postedAt                        │ │                                     │
│ │ │ closingDate                     │ │                                     │
│ │ │ status                          │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               │ 1:N                                                         │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │         Applications                │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ candidateId (FK -> Users.id)    │ │                                     │
│ │ │ jobId (FK -> Jobs.id)           │ │                                     │
│ │ │ status                          │ │                                     │
│ │ │ aiScore                         │ │                                     │
│ │ │ aiAnalysis                      │ │                                     │
│ │ │ submittedAt                     │ │                                     │
│ │ │ reviewedAt                      │ │                                     │
│ │ │ reviewedBy (FK -> Users.id)     │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │                                                             │
│               │ 1:1                                                         │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          AIRankings                 │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ applicationId (FK ->            │ │                                     │
│ │ │   Applications.id)              │ │                                     │
│ │ │ overallScore                    │ │                                     │
│ │ │ skillsScore                     │ │                                     │
│ │ │ experienceScore                 │ │                                     │
│ │ │ educationScore                  │ │                                     │
│ │ │ personalityScore                │ │                                     │
│ │ │ analysisDetails                 │ │                                     │
│ │ │ strengths                       │ │                                     │
│ │ │ improvements                    │ │                                     │
│ │ │ createdAt                       │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│            Applications                                                     │
│               │ 1:N                                                         │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          Documents                  │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ candidateId (FK -> Users.id)    │ │                                     │
│ │ │ applicationId (FK ->            │ │                                     │
│ │ │   Applications.id)              │ │                                     │
│ │ │ type (resume/cover_letter/      │ │                                     │
│ │ │   portfolio/other)              │ │                                     │
│ │ │ fileName                        │ │                                     │
│ │ │ filePath                        │ │                                     │
│ │ │ fileSize                        │ │                                     │
│ │ │ mimeType                        │ │                                     │
│ │ │ uploadedAt                      │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │        EmailTemplates               │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ name                            │ │                                     │
│ │ │ subject                         │ │                                     │
│ │ │ body                            │ │                                     │
│ │ │ type (interview/rejection/      │ │                                     │
│ │ │   acceptance/follow_up)         │ │                                     │
│ │ │ variables                       │ │                                     │
│ │ │ createdBy (FK -> Users.id)      │ │                                     │
│ │ │ createdAt                       │ │                                     │
│ │ │ updatedAt                       │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────┬───────────────────────┘                                     │
│               │ 1:N                                                         │
│               ▼                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │          EmailLogs                  │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ fromEmail                       │ │                                     │
│ │ │ toEmail                         │ │                                     │
│ │ │ subject                         │ │                                     │
│ │ │ body                            │ │                                     │
│ │ │ templateId (FK ->               │ │                                     │
│ │ │   EmailTemplates.id)            │ │                                     │
│ │ │ candidateId (FK -> Users.id)    │ │                                     │
│ │ │ sentBy (FK -> Users.id)         │ │                                     │
│ │ │ sentAt                          │ │                                     │
│ │ │ status (sent/failed/pending)    │ │                                     │
│ │ │ errorMessage                    │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
│ ┌─────────────────────────────────────┐                                     │
│ │        SystemSettings               │                                     │
│ │ ┌─────────────────────────────────┐ │                                     │
│ │ │ id (PK)                         │ │                                     │
│ │ │ settingKey (UNIQUE)             │ │                                     │
│ │ │ settingValue                    │ │                                     │
│ │ │ dataType (string/number/        │ │                                     │
│ │ │   boolean/json)                 │ │                                     │
│ │ │ description                     │ │                                     │
│ │ │ updatedBy (FK -> Users.id)      │ │                                     │
│ │ │ updatedAt                       │ │                                     │
│ │ └─────────────────────────────────┘ │                                     │
│ └─────────────────────────────────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
