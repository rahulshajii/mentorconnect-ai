# MentorConnect AI — Intelligent Mentoring Platform

**An Enterprise-Grade AI-Powered Mentoring Ecosystem with Adaptive Mentoring Inference Engine (AMIE), Interactive Course Catalog, 1-Click Payments, Vector PDF Certificates, and Automated Multi-Stage Email Engine.**

[![Repository](https://img.shields.io/badge/GitHub-rahulshajii%2Fmentorconnect--ai-blue.svg)](https://github.com/rahulshajii/mentorconnect-ai)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19+-61dafb.svg)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen.svg)](https://www.mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-78%2F78%20Passed%20(100%25)-success.svg)](scripts/run-tests.sh)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deploy-Free%20Tier%20Ready-purple.svg)](DEPLOYMENT_GUIDE.md)

---

## 🌟 Executive Summary

**MentorConnect AI** is a full-stack SaaS platform bridging learners and verified industry leaders. By combining an explainable AI recommendation engine (**AMIE**) with end-to-end skill gap diagnostics, dynamic mentor scheduling, course curricula, cryptographic vector PDF certifications, and transactional email automation, the platform delivers a complete production-ready mentoring experience.

---

## 🚀 Key Platform Capabilities

### 1. 🧠 Adaptive Mentoring Inference Engine (AMIE)
- **Multi-Factor Weighted Matching**: Evaluates skill alignment (40%), experience differential (25%), availability overlap (20%), and rating track record (15%).
- **Explainable Match Scores**: Gives learners transparent rationale behind every mentor recommendation.
- **Skill Gap Diagnostics**: Interactive multi-skill quizzes with radar visualization and personalized learning roadmaps.

### 2. 📚 Interactive Course Hub & Curriculum Tracking
- **Rich Course Catalog**: Filter by category (Web Dev, System Design, Data & AI, Cloud & DevOps, Cybersecurity) and pricing (Free / Paid).
- **Curriculum Player**: Structured lesson player with progress tracking and server-enforced prerequisites.
- **Server-Verified Completion**: Requires 100% required lesson attendance and passing evaluation on knowledge checks.

### 3. 💳 1-Click Simulated Demo Payments
- **Deterministic Transaction State**: Idempotent order creation and settlement.
- **Visual Delight**: High-converting checkout modal with micro-animated success checkmark and zero external gateway setup needed.
- **Zero-Friction Access**: Instant un-gating of premium courses upon completion.

### 4. 🏆 Cryptographic Landscape PDF Certificates
- **Vector Graphics Generation**: Generates high-resolution landscape PDF credentials via PDFKit.
- **Public Verification Engine**: Anyone can verify credentials at `/verify-certificate/:certificateId` without authentication.
- **Embedded Security**: Unique certificate hash, QR code, issue date, recipient credentials, and assessment grade.

### 5. 📧 Automated Transactional Email Engine
- **4-Stage Automated Lifecycle**:
  1. `enrollment_confirmation`: Sent upon joining any course.
  2. `payment_receipt`: Sent upon initial demo order confirmation.
  3. `course_completion`: Sent upon completing all lessons and passing the assessment.
  4. `payment_completion`: Sent upon course completion confirming 100% settlement with zero balance due and certificate link.
  5. `certificate_issued`: Sent with certificate identifier and public verification link.
- **Dual-Mode Engine**: Operates in Live SMTP mode when credentials are provided, or safe **Simulated Dev Mode** logging events to MongoDB with zero runtime errors.

### 6. 📊 Admin Intelligence Dashboard
- Real-time platform metrics: active learners, verified mentors, courses, and bookings.
- Course publishing and catalog management.
- Email delivery inspector with full subject, recipient, body preview, status, and one-click delivery retry.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MentorConnect AI Frontend                       │
│              (React 19, Material-UI 9, Framer Motion, Axios)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / JWT
┌───────────────────────────────────▼────────────────────────────────────┐
│                        MentorConnect AI Backend                        │
│                  (Node.js 18+, Express 4.21, Mongoose 8)               │
├─────────────────┬───────────────────┬──────────────────┬───────────────┤
│   Auth & RBAC   │    AMIE Engine    │ Course & Payment │ Cert & PDFKit │
└────────┬────────┴─────────┬─────────┴────────┬─────────┴───────┬───────┘
         │                  │                  │                 │
         ▼                  ▼                  ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ ┌──────────────┐
│  MongoDB Atlas  │ │ Email Engine    │ │ In-App Alerts │ │ PDF Engine   │
│  (Database M0)  │ │ (Nodemailer/Log)│ │ (Real-Time)   │ │ (Vector)     │
└─────────────────┘ └─────────────────┘ └───────────────┘ └──────────────┘
```

---

## 📁 Repository Structure

```text
mentorconnect-ai/
├── client/              # React 19 Frontend Application
│   ├── public/          # Static assets & _redirects for SPA routing
│   ├── src/
│   │   ├── components/  # Reusable UI components & animations
│   │   ├── pages/       # Dashboard, Courses, Certificates, Admin, etc.
│   │   ├── services/    # Axios API client integrations
│   │   └── theme/       # Material UI design system
│   ├── package.json
│   └── vercel.json      # Vercel deployment configuration
├── server/              # Node.js Express REST API
│   ├── config/          # MongoDB connection & environment settings
│   ├── controllers/     # Route business logic handlers
│   ├── models/          # Mongoose schemas (User, Course, Cert, Email, etc.)
│   ├── routes/          # API endpoint declarations
│   ├── seeds/           # Automatic baseline database seeding
│   ├── services/        # AMIE Engine, PDF generator, Email service
│   ├── test.js          # Automated 78-point verification test suite
│   └── package.json
├── docs/                # Comprehensive Architecture & API Documentation
├── scripts/             # Startup, seeding, and test execution scripts
├── tests/               # Integration verification suite
├── certificates/        # Certificate storage directory
├── render.yaml          # 1-Click Render Blueprint configuration
├── DEPLOYMENT_GUIDE.md  # Step-by-step 100% FREE Hosting Guide
├── package.json         # Root monorepo script runner
├── .env.example         # Environment template
└── README.md            # Platform Documentation
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com) (Running locally on `127.0.0.1:27017` or a MongoDB Atlas URI)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rahulshajii/mentorconnect-ai.git
cd mentorconnect-ai

# Install backend & frontend dependencies
npm run install:all
```

### 2. Configure Environment (Optional)
```bash
cp .env.example server/.env
```
*(Default settings run out-of-the-box with local MongoDB and simulated email delivery).*

### 3. Launch Development Servers
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
npm run start:server
# Running on http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
npm run start:client
# Running on http://localhost:3000
```

### 4. Default Seed Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@mentorconnect.ai` | `adminpassword123` |
| **Featured Mentor** | `alex.rivera@mentorconnect.ai` | `Mentor@123` |
| **Featured Mentor** | `sarah.jenkins@mentorconnect.ai` | `Mentor@123` |
| **Featured Mentor** | `marcus.vance@mentorconnect.ai` | `Mentor@123` |

---

## 🧪 Automated Verification Suite

MentorConnect AI includes a comprehensive end-to-end integration test suite covering Authentication, AMIE recommendations, course progress enforcement, payment idempotency, vector PDF generation, and transactional email dispatching.

To execute the test suite:
```bash
npm test
# Or run the script directly:
./scripts/run-tests.sh
```

**Test Results:**
```text
================================================================
 🎉 ALL 78/78 TESTS PASSED CLEANLY (100% SUCCESS RATE)!
================================================================
```

---

## 🌐 100% Free Hosting & Deployment

MentorConnect AI is pre-configured for free cloud deployment:
- **Backend API**: Free on [Render](https://render.com) using the included `render.yaml` Blueprint.
- **Frontend App**: Free on [Vercel](https://vercel.com) using the included `client/vercel.json` SPA configuration.
- **Database**: Free on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 Cluster.

👉 **Follow the full guide in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for 5-minute setup instructions.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
