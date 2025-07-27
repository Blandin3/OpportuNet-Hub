-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2025 at 08:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hr_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicationscores`
--

CREATE TABLE `applicationscores` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `type` enum('manual','ai','experience','skills','education') NOT NULL,
  `score` int(11) DEFAULT 0,
  `explanation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `applicationsummaryview`
-- (See below for the actual view)
--
CREATE TABLE `applicationsummaryview` (
`id` int(11)
,`job_position_id` int(11)
,`job_title` varchar(255)
,`candidate_id` int(11)
,`candidate_name` varchar(201)
,`candidate_email` varchar(255)
,`status` enum('submitted','screening','interview','offered','hired','rejected')
,`applied_at` timestamp
,`updated_at` timestamp
,`overall_score` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_key` varchar(255) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidateprofiles`
--

CREATE TABLE `candidateprofiles` (
  `user_id` int(11) NOT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `portfolio_url` varchar(500) DEFAULT NULL,
  `total_experience` int(11) DEFAULT 0,
  `education_level` varchar(100) DEFAULT NULL,
  `current_salary` decimal(10,2) DEFAULT NULL,
  `expected_salary` decimal(10,2) DEFAULT NULL,
  `availability_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidateprofiles`
--

INSERT INTO `candidateprofiles` (`user_id`, `linkedin_url`, `github_url`, `portfolio_url`, `total_experience`, `education_level`, `current_salary`, `expected_salary`, `availability_date`) VALUES
(3, 'https://linkedin.com/in/user3', 'https://github.com/user3', 'https://portfolio.com/user3', 3, 'Bachelor\'s Degree', 1889.90, 1558.19, '0000-00-00'),
(4, 'https://linkedin.com/in/user4', 'https://github.com/user4', 'https://portfolio.com/user4', 1, 'Bachelor\'s Degree', 1943.73, 2028.17, '2025-07-13'),
(5, 'https://linkedin.com/in/user5', 'https://github.com/user5', 'https://portfolio.com/user5', 5, 'Bachelor\'s Degree', 1454.44, 2130.91, '2025-07-12'),
(6, 'https://linkedin.com/in/user6', 'https://github.com/user6', 'https://portfolio.com/user6', 1, 'Bachelor\'s Degree', 1208.98, 1955.24, '2025-07-08'),
(7, 'https://linkedin.com/in/user7', 'https://github.com/user7', 'https://portfolio.com/user7', 1, 'Bachelor\'s Degree', 1521.32, 1864.38, '2025-06-26'),
(8, 'https://linkedin.com/in/user8', 'https://github.com/user8', 'https://portfolio.com/user8', 3, 'Bachelor\'s Degree', 1600.05, 2185.52, '2025-07-07'),
(9, 'https://linkedin.com/in/user9', 'https://github.com/user9', 'https://portfolio.com/user9', 4, 'Bachelor\'s Degree', 1867.85, 1793.45, '2025-07-14'),
(10, 'https://linkedin.com/in/user10', 'https://github.com/user10', 'https://portfolio.com/user10', 1, 'Bachelor\'s Degree', 1951.51, 1907.02, '2025-06-24'),
(11, 'https://linkedin.com/in/user11', 'https://github.com/user11', 'https://portfolio.com/user11', 4, 'Bachelor\'s Degree', 1858.01, 1590.32, '2025-07-15'),
(12, 'https://linkedin.com/in/user12', 'https://github.com/user12', 'https://portfolio.com/user12', 5, 'Bachelor\'s Degree', 1177.12, 1926.82, '2025-07-07'),
(13, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `candidateprofilesview`
-- (See below for the actual view)
--
CREATE TABLE `candidateprofilesview` (
`id` int(11)
,`email` varchar(255)
,`full_name` varchar(201)
,`phone` varchar(20)
,`location` varchar(255)
,`bio` text
,`total_experience` int(11)
,`education_level` varchar(100)
,`linkedin_url` varchar(500)
,`github_url` varchar(500)
,`portfolio_url` varchar(500)
,`created_at` timestamp
,`skills` mediumtext
);

-- --------------------------------------------------------

--
-- Table structure for table `emailcommunications`
--

CREATE TABLE `emailcommunications` (
  `id` int(11) NOT NULL,
  `application_id` int(11) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `template_id` int(11) DEFAULT NULL,
  `subject` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','delivered','failed') DEFAULT 'sent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emailtemplates`
--

CREATE TABLE `emailtemplates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `template_type` enum('application_received','interview_invitation','rejection','offer','custom') NOT NULL,
  `created_by` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hrprofiles`
--

CREATE TABLE `hrprofiles` (
  `user_id` int(11) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hrprofiles`
--

INSERT INTO `hrprofiles` (`user_id`, `company`, `department`, `job_title`) VALUES
(1, 'TechCorp', 'Human Resources', 'Hr Admin'),
(2, 'Innova', 'Talent Acquisition', 'Senior Recruiter');

-- --------------------------------------------------------

--
-- Stand-in structure for view `hrprofilesview`
-- (See below for the actual view)
--
CREATE TABLE `hrprofilesview` (
`id` int(11)
,`email` varchar(255)
,`full_name` varchar(201)
,`phone` varchar(20)
,`location` varchar(255)
,`company` varchar(255)
,`department` varchar(255)
,`job_title` varchar(255)
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `interviewfeedback`
--

CREATE TABLE `interviewfeedback` (
  `id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `technical_rating` int(11) DEFAULT NULL CHECK (`technical_rating` between 1 and 10),
  `communication_rating` int(11) DEFAULT NULL CHECK (`communication_rating` between 1 and 10),
  `culture_fit_rating` int(11) DEFAULT NULL CHECK (`culture_fit_rating` between 1 and 10),
  `overall_rating` int(11) DEFAULT NULL CHECK (`overall_rating` between 1 and 10),
  `strengths` text DEFAULT NULL,
  `weaknesses` text DEFAULT NULL,
  `recommendation` enum('Strong Hire','Hire','Maybe','No Hire') NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interviewschedules`
--

CREATE TABLE `interviewschedules` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `interviewer_id` int(11) NOT NULL,
  `interview_type` enum('phone','video','in-person','technical') NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `duration_minutes` int(11) NOT NULL DEFAULT 60,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled','rescheduled') DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobapplications`
--

CREATE TABLE `jobapplications` (
  `id` int(11) NOT NULL,
  `job_position_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `cv_file` varchar(255) DEFAULT NULL,
  `cover_letter_file` varchar(255) DEFAULT NULL,
  `additional_documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_documents`)),
  `status` enum('submitted','screening','interview','offered','hired','rejected') DEFAULT 'submitted',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ai_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_analysis`)),
  `key_highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`key_highlights`)),
  `application_strength` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobapplications`
--

INSERT INTO `jobapplications` (`id`, `job_position_id`, `candidate_id`, `cover_letter`, `cv_file`, `cover_letter_file`, `additional_documents`, `status`, `applied_at`, `updated_at`, `ai_analysis`, `key_highlights`, `application_strength`) VALUES
(7, 10, 3, 'I am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionI am interested in this positionv', 'uploads\\applications\\23518.docx', 'uploads\\applications\\23518.docx', '{\"portfolio\": \"uploads\\\\applications\\\\23518.docx\", \"reason_for_applying\": \"I am interested in this position\", \"compensation_expectation\": \"100000\", \"available_start_date\": \"2025-06-30\", \"additional_info\": \"I am interested in this position\"}', 'submitted', '2025-06-24 21:47:03', '2025-06-24 21:47:03', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobpositions`
--

CREATE TABLE `jobpositions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `employment_type` enum('full-time','part-time','contract','internship') DEFAULT 'full-time',
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `posted_by` int(11) NOT NULL,
  `status` enum('active','paused','closed') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobpositions`
--

INSERT INTO `jobpositions` (`id`, `title`, `description`, `requirements`, `department`, `location`, `employment_type`, `salary_min`, `salary_max`, `currency`, `posted_by`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Data Analyst', 'Analyze data to support business decisions.', 'SQL, Excel, Python', 'Technology', 'London, UK', 'full-time', 50000.00, 85000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(3, 'DevOps Engineer', 'Manage CI/CD pipelines and cloud infrastructure.', 'AWS, Docker, Jenkins', 'Technology', 'Berlin, Germany', 'full-time', 75000.00, 110000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(4, 'Mobile Developer', 'Develop Android and iOS applications.', 'Kotlin, Swift, Flutter', 'Technology', 'Toronto, Canada', 'full-time', 65000.00, 100000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(5, 'UI/UX Designer', 'Design user-friendly interfaces.', 'Figma, Adobe XD, UX Research', 'Design', 'Remote', 'contract', 40000.00, 70000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(7, 'Front-End Developer', 'Build responsive UI.', 'HTML, CSS, JavaScript', 'Technology', 'Cape Town, South Africa', 'full-time', 55000.00, 95000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(8, 'Back-End Developer', 'Work on server-side logic.', 'PHP, MySQL, Laravel', 'Technology', 'Lagos, Nigeria', 'full-time', 60000.00, 100000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(9, 'Machine Learning Engineer', 'Build ML models and pipelines.', 'Python, TensorFlow, Scikit-learn', 'Technology', 'San Francisco, USA', 'full-time', 90000.00, 140000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(10, 'HR Specialist', 'Manage recruitment and employee relations.', 'HR software, Communication', 'Human Resources', 'Kigali, Rwanda', 'full-time', 40000.00, 70000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(21, 'HR Director', 'Lead the HR department.', 'Leadership, HR experience', 'Human Resources', 'Kigali, Rwanda', 'full-time', 80000.00, 120000.00, 'USD', 1, 'active', '2025-06-24 18:14:30', '2025-06-24 18:14:30'),
(32, 'Data Science', 'We need a good data scientist', 'Python, SQL, Rust', 'Technology', 'Menloo Park, CA', 'full-time', 200000.00, 400000.00, 'USD', 1, 'active', '2025-06-26 16:24:47', '2025-06-26 16:24:47');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

CREATE TABLE `systemsettings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`setting_value`)),
  `description` text DEFAULT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('hr','candidate') NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `skills` varchar(256) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `education` varchar(100) DEFAULT NULL,
  `job_position_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `first_name`, `last_name`, `phone`, `location`, `bio`, `profile_picture`, `is_active`, `email_verified`, `created_at`, `updated_at`, `skills`, `experience`, `education`, `job_position_id`) VALUES
(1, 'max.hr@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'hr', 'Max', 'Patricia', '+0726371003', 'New York, USA', 'HR manager with 10 years of experience.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Human Resources', 12, 'Master degree', 21),
(2, 'bob.hr@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'hr', 'Bob', 'Johnson', '9876543210', 'San Francisco, USA', 'Tech recruiter focused on software talent.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Human Resources', 9, 'Bachelor degree', 21),
(3, 'john.doe@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Makerav', 'Johnson', '+1 (555) 123-4567', 'Kigali, Rwanda', 'Junior frontend developer.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 19:25:06', 'HTML, CSS, JavaScript', 2, 'Bachelor degree', 7),
(4, 'jane.doe@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Jane', 'Doe', '2222222222', 'Nairobi, Kenya', 'Backend developer with Flask and Node.js experience.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Node.js, Flask, MySQL', 4, 'Bachelor degree', 8),
(5, 'm.david@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Manzi', 'David', '0791291003', 'Melbourne, Australia', '', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Swift, Flutter', 3, 'Bachelor degree', 4),
(6, 'michael.brown@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Michael', 'Brown', '4444444444', 'Accra, Ghana', 'Software engineer passionate about DevOps.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Docker, Jenkins, AWS', 5, 'Master degree', 3),
(7, 'susan.lee@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Susan', 'Lee', '5555555555', 'Cape Town, South Africa', 'Junior data scientist.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Python, Pandas, Excel', 2, 'Bachelor degree', 2),
(8, 'david.kimani@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'David', 'Kimani', '6666666666', 'Kampala, Uganda', 'Python backend engineer.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Python, Django', 3, 'Bachelor degree', 8),
(9, 'nora.ali@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Nora', 'Ali', '7777777777', 'Addis Ababa, Ethiopia', 'React frontend engineer.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'React, JavaScript, CSS', 3, 'Bachelor degree', 7),
(10, 'kevin.zhao@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Kevin', 'Zhao', '8888888888', 'Johannesburg, South Africa', 'AI/ML enthusiast.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Python, TensorFlow', 4, 'Master degree', 9),
(11, 'fatou.balde@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Fatou', 'Balde', '9999999999', 'Dakar, Senegal', 'Junior Android developer.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'Java, Android Studio', 2, 'Bachelor degree', 4),
(12, 'paul.ndungu@example.com', 'pbkdf2:sha256:260000$HF57NjLd4YqjVLdX$881d2d8a603a95ef841baf58d859b48d9cc7895e51c809e5672f1a720aa22217', 'candidate', 'Paul', 'Ndungu', '1010101010', 'Dar es Salaam, Tanzania', 'Cloud DevOps engineer.', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:14:30', 'AWS, Kubernetes', 5, 'Master degree', 3),
(13, 'vulanikevin@gmail.com', 'pbkdf2:sha256:260000$cpvmPZRSIK3sJS4R$89a6e148a74b093d00ff58fa6049a93536c4058867fb1a9c9e79a66082c2a237', 'candidate', 'Vulani', 'Kevin', '+2501891739', 'Sao Paulo, Brazil', 'Java Specialist', NULL, 1, 0, '2025-06-24 18:14:30', '2025-06-24 18:16:11', 'HTML, JavaScript, Figma', 1, 'High school diploma', 5);

-- --------------------------------------------------------

--
-- Table structure for table `userskills`
--

CREATE TABLE `userskills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `proficiency_level` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
  `skill_experience` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `applicationsummaryview`
--
DROP TABLE IF EXISTS `applicationsummaryview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applicationsummaryview`  AS SELECT `ja`.`id` AS `id`, `ja`.`job_position_id` AS `job_position_id`, `jp`.`title` AS `job_title`, `ja`.`candidate_id` AS `candidate_id`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `candidate_name`, `u`.`email` AS `candidate_email`, `ja`.`status` AS `status`, `ja`.`applied_at` AS `applied_at`, `ja`.`updated_at` AS `updated_at`, (select sum(`s`.`score`) from `applicationscores` `s` where `s`.`application_id` = `ja`.`id`) AS `overall_score` FROM ((`jobapplications` `ja` join `jobpositions` `jp` on(`ja`.`job_position_id` = `jp`.`id`)) join `users` `u` on(`ja`.`candidate_id` = `u`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `candidateprofilesview`
--
DROP TABLE IF EXISTS `candidateprofilesview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `candidateprofilesview`  AS SELECT `u`.`id` AS `id`, `u`.`email` AS `email`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `full_name`, `u`.`phone` AS `phone`, `u`.`location` AS `location`, `u`.`bio` AS `bio`, `cp`.`total_experience` AS `total_experience`, `cp`.`education_level` AS `education_level`, `cp`.`linkedin_url` AS `linkedin_url`, `cp`.`github_url` AS `github_url`, `cp`.`portfolio_url` AS `portfolio_url`, `u`.`created_at` AS `created_at`, group_concat(`s`.`name` separator ',') AS `skills` FROM (((`users` `u` join `candidateprofiles` `cp` on(`u`.`id` = `cp`.`user_id`)) left join `userskills` `us` on(`u`.`id` = `us`.`user_id`)) left join `skills` `s` on(`us`.`skill_id` = `s`.`id`)) WHERE `u`.`role` = 'candidate' GROUP BY `u`.`id` ;

-- --------------------------------------------------------

--
-- Structure for view `hrprofilesview`
--
DROP TABLE IF EXISTS `hrprofilesview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `hrprofilesview`  AS SELECT `u`.`id` AS `id`, `u`.`email` AS `email`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `full_name`, `u`.`phone` AS `phone`, `u`.`location` AS `location`, `hp`.`company` AS `company`, `hp`.`department` AS `department`, `hp`.`job_title` AS `job_title`, `u`.`created_at` AS `created_at` FROM (`users` `u` join `hrprofiles` `hp` on(`u`.`id` = `hp`.`user_id`)) WHERE `u`.`role` = 'hr' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicationscores`
--
ALTER TABLE `applicationscores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `candidateprofiles`
--
ALTER TABLE `candidateprofiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `emailcommunications`
--
ALTER TABLE `emailcommunications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`),
  ADD KEY `template_id` (`template_id`);

--
-- Indexes for table `emailtemplates`
--
ALTER TABLE `emailtemplates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `hrprofiles`
--
ALTER TABLE `hrprofiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `interviewfeedback`
--
ALTER TABLE `interviewfeedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `interview_id` (`interview_id`);

--
-- Indexes for table `interviewschedules`
--
ALTER TABLE `interviewschedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `interviewer_id` (`interviewer_id`);

--
-- Indexes for table `jobapplications`
--
ALTER TABLE `jobapplications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_application` (`job_position_id`,`candidate_id`),
  ADD KEY `idx_job_position` (`job_position_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_applied_at` (`applied_at`);

--
-- Indexes for table `jobpositions`
--
ALTER TABLE `jobpositions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_posted_by` (`posted_by`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_job_position` (`job_position_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `userskills`
--
ALTER TABLE `userskills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_skill` (`user_id`,`skill_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_skill_id` (`skill_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicationscores`
--
ALTER TABLE `applicationscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidateprofiles`
--
ALTER TABLE `candidateprofiles`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `emailcommunications`
--
ALTER TABLE `emailcommunications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emailtemplates`
--
ALTER TABLE `emailtemplates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hrprofiles`
--
ALTER TABLE `hrprofiles`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `interviewfeedback`
--
ALTER TABLE `interviewfeedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interviewschedules`
--
ALTER TABLE `interviewschedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobapplications`
--
ALTER TABLE `jobapplications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jobpositions`
--
ALTER TABLE `jobpositions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `userskills`
--
ALTER TABLE `userskills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicationscores`
--
ALTER TABLE `applicationscores`
  ADD CONSTRAINT `applicationscores_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `jobapplications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `candidateprofiles`
--
ALTER TABLE `candidateprofiles`
  ADD CONSTRAINT `candidateprofiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `emailcommunications`
--
ALTER TABLE `emailcommunications`
  ADD CONSTRAINT `emailcommunications_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `jobapplications` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `emailcommunications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emailcommunications_ibfk_3` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emailcommunications_ibfk_4` FOREIGN KEY (`template_id`) REFERENCES `emailtemplates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `emailtemplates`
--
ALTER TABLE `emailtemplates`
  ADD CONSTRAINT `emailtemplates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hrprofiles`
--
ALTER TABLE `hrprofiles`
  ADD CONSTRAINT `hrprofiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interviewfeedback`
--
ALTER TABLE `interviewfeedback`
  ADD CONSTRAINT `interviewfeedback_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interviewschedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interviewschedules`
--
ALTER TABLE `interviewschedules`
  ADD CONSTRAINT `interviewschedules_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `jobapplications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interviewschedules_ibfk_2` FOREIGN KEY (`interviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobapplications`
--
ALTER TABLE `jobapplications`
  ADD CONSTRAINT `jobapplications_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobpositions`
--
ALTER TABLE `jobpositions`
  ADD CONSTRAINT `jobpositions_ibfk_1` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD CONSTRAINT `systemsettings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_job_position` FOREIGN KEY (`job_position_id`) REFERENCES `jobpositions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userskills`
--
ALTER TABLE `userskills`
  ADD CONSTRAINT `userskills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `userskills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;