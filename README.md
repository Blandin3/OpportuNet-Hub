# OpportuNetHub: HR(Employer) & Candidate(Employee) Management Platform

## Overview

OpportuNetHub is a full-stack opportunity matching platform built to empower **African youth** and **opportunity providers**. It serves as a centralized system that aggregates and organizes:

- Internship listings
- Training programs
- Job fairs and career opportunities

With features such as **smart filtering**, **direct applications**, and personalized dashboards for both employers and candidates, OpportuNet aims to simplify access to opportunities and improve visibility within six months of operation.

Key Features:
- 📌 Post and manage opportunities by employers
- 🎯 View, filter, and apply for roles by youth
- 🧠 Personalized suggestions based on user interests
- 📋 Employer dashboard to manage applicants
- 📬 Notification system for updates and approvals

The platform consists of a **React (Vite, TypeScript) frontend** and a **Flask (Python) backend** with a **MySQL database**. It leverages modern UI libraries, state management, and AI/ML integrations for advanced candidate evaluation.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [AI Scoring & Ranking](#ai-scoring--ranking)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Secure JWT-based login/signup for HR and candidates
- **Job Management**: HR can create, update, and delete job positions
- **Candidate Applications**: Candidates apply for jobs, upload CVs, and manage profiles
- **AI-Powered Scoring**: Automatic candidate-job fit scoring using AI models and custom algorithms
- **Admin Dashboard**: HR can view, filter, and rank candidates and applications
- **Candidate Dashboard**: Candidates track their applications and manage their data
- **PDF/CSV Export**: Download applications and candidate lists
- **Email Communication**: Templated emails for application status and interview invites
- **Audit Logging**: Tracks key actions for compliance

---

## Architecture

```
Frontend (React, Vite, TypeScript)
   |
   |  REST API (JWT Auth, CORS)
   v
Backend (Flask, Python)
   |
   |  MySQL Connector
   v
Database (MySQL)
```

- **Frontend**: Modern SPA with protected routes for HR and candidates, dynamic tables, and AI ranking panels.
- **Backend**: RESTful API with endpoints for authentication, job/candidate management, file uploads, AI scoring, and admin tools.
- **Database**: Relational schema for users, jobs, applications, scores, profiles, and audit logs.

---

## Tech Stack

### Backend
- Python 3.x
- Flask
- flask-cors
- mysql-connector-python
- python-dotenv
- bcrypt, jwt
- fpdf (PDF export)
- Azure AI/DeepSeek/PUTER API (for AI scoring)

### Frontend
- React 18 (Vite, TypeScript)
- React Router DOM
- Zustand (state management)
- @tanstack/react-query (data fetching)
- shadcn/ui (Radix UI components)
- Tailwind CSS
- Lucide React (icons)
- axios

### Database
- MySQL/MariaDB

---

## Setup & Installation

### 1. Backend

#### Prerequisites
- Python 3.8+
- MySQL server

#### Install dependencies
```bash
cd Backend
pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` file in `Backend/` with:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hr_management_system
DB_PORT=3306
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token_for_ai
PUTER_API_KEY=your_puter_api_key
```

#### Run the server
```bash
python server.py
```
The API will be available at `http://localhost:5000/api/`

### 2. Frontend

#### Prerequisites
- Node.js 18+
- npm or bun

#### Install dependencies
```bash
npm install
# or
bun install
```

#### Start the dev server
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

### 3. Database

- Import the schema from `Backend/hr_management_system.sql` into your MySQL server:
```bash
mysql -u <user> -p < hr_management_system.sql
```
- Update your `.env` to match your DB credentials.

---

## Environment Variables
- **Backend**: See above for required variables in `.env`.
- **Frontend**: If you use environment variables, add them to `.env` in the root (see Vite docs).

---

## Usage

- **HR Admins**:
  - Login/signup as HR
  - Create/manage job positions
  - View, filter, and rank candidates
  - Use AI-powered sorting and download reports
  - Manage application statuses and send emails

- **Candidates**:
  - Signup/login as candidate
  - Complete profile, upload CV, apply for jobs
  - Track application status and download application history

---

## AI Scoring & Ranking
- **Backend**: When a candidate applies, the backend calls an AI model (DeepSeek/PUTER) with job and candidate data. The AI returns a fit score (0-100) and explanation, which is stored in the database.
- **Frontend**: Custom algorithms (see `src/lib/aiRanking.ts` and `src/lib/scoring.ts`) allow HR to re-rank candidates by experience, skills, education, and location, with adjustable weights.
- **Manual & AI Scores**: Both manual and AI scores are supported and visible in the admin dashboard.

---

## Project Structure

```
OpportuNetHub/
├── Backend/
│   ├── server.py           # Flask API
│   ├── requirements.txt    # Python dependencies
│   ├── hr_management_system.sql # MySQL schema
│   └── uploads/            # Uploaded files (CVs, etc.)
├── src/
│   ├── App.tsx             # Main React app
│   ├── pages/              # Page components (Landing, Login, Admin, Candidate, etc.)
│   ├── components/         # UI and logic components
│   ├── lib/                # AI ranking, scoring, utils
│   ├── data/               # Sample data
│   └── store/              # Zustand store
├── public/                 # Static assets
├── package.json            # Frontend dependencies/scripts
├── README.md               # This file
└── ...
```

---

## Contributing
Pull requests are welcome! Please open an issue to discuss major changes. For local development, use test accounts and do not commit secrets.

---

## License
This project is for educational and demonstration purposes. For commercial use, please contact the author.
Email: b.iradukund3@alustudent.com
GitHub Username: Blandin3
