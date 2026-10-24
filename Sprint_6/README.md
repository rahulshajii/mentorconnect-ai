# MentorConnect AI — Sprint 6 Final Release

**An Intelligent Mentoring Platform with Adaptive Mentoring Inference Engine (AMIE), Learning Management, Simulated Demo Payments, and Verified Credentialing.**

---

## 🚀 1. Project Overview

**MentorConnect AI** is an enterprise-grade AI-powered mentoring and continuous learning platform. Sprint 6 delivers the final capstone modules, providing a comprehensive, self-contained, and tested system encompassing:
- **Intelligent Mentoring Ecosystem**: AMIE skill-gap inference engine, multi-parameter mentor discovery, schedule booking, session management, and in-app notifications.
- **Course Management & Catalog**: Searchable and filterable course catalog with tiered difficulty, rich curricula, and progress tracking.
- **Simulated Demo Payment Workflow**: Seamless academic payment simulation with server-calculated pricing, idempotency controls, and smooth animated green checkmark confirmation.
- **Automated Lifecycle Email System**: Server-side transactional emails (Nodemailer) for enrollment confirmation, demo payment receipts, course completion, and certificate issuance, equipped with a resilient local development fallback.
- **Cryptographic Certificate Generation & Verification**: High-resolution landscape PDF certificates generated via PDFKit with verifiable authenticity hashes and public verification links.
- **Administrative Intelligence Hub**: Oversight and analytics dashboard for managing courses, enrollments, simulated transactions, certificates, and email delivery audits with retry capabilities.

---

## ✨ 2. Key Features

| Module | Features & Capabilities |
| :--- | :--- |
| **Authentication & Profiles** | JWT authentication, bcryptjs encryption, role-based access control (`learner`, `mentor`, `admin`), profile completion steppers, skill and expertise normalization. |
| **AMIE Inference Engine** | Rule-based and weighted skill gap analysis, benchmark-based radar visualizations, matching score algorithms based on domain, experience, and learner goals. |
| **Session Booking Hub** | Live mentor scheduling, collision-checked booking slots, topic agendas, booking status tracking, and in-app alert notifications. |
| **Course Catalog** | Full catalog search, category filtering, level indicators (`Beginner`, `Intermediate`, `Advanced`), price tags (Free vs Paid), curriculum view, and learning outcomes. |
| **Demo Payment Flow** | Academic payment simulation with clear transparency disclosures, server-side price lookup, idempotent confirmation, and animated success screen. |
| **Learning & Progress Tracker**| Modular curriculum drawer, video and reading lesson viewer, progress persistence, assessment quiz submission with automated grading, and instant certificate issuance. |
| **Certificate Engine** | Server-side PDFKit vector graphics generator, tamper-resistant unique certificate IDs (`MC-CERT-...`), direct PDF downloads, and public verification portal. |
| **Transactional Email Hub** | Nodemailer integration with 4 dedicated HTML/Text email templates, local dev mode event simulation, and admin audit retry capabilities. |
| **Admin Operations** | Course authoring/editing, publication toggles, enrollment oversight, transaction inspection, certificate auditing, and email log monitoring. |

---

## 🏗️ 3. Architecture & Tech Stack

```text
                                  ┌───────────────────────────┐
                                  │      React 19 Client      │
                                  │ (MUI 7, Framer Motion)    │
                                  └─────────────┬─────────────┘
                                                │ REST API (Axios + JWT)
                                                ▼
                                  ┌───────────────────────────┐
                                  │    Express.js Backend     │
                                  │  (Port 5000 / Auth & RBAC)│
                                  └───┬───────┬───────┬───────┘
                                      │       │       │
             ┌────────────────────────┘       │       └────────────────────────┐
             ▼                                ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│     MongoDB 8.0+        │      │    Nodemailer Service   │      │   PDFKit Engine         │
│ (Users, Courses, Orders,│      │ (SMTP / Dev Simulation  │      │ (Landscape A4 Vectors,  │
│  Certs, Logs, Sessions) │      │  Audit Logs & Retries)  │      │  Hashes, Verification)  │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

- **Frontend**: React 19, Material-UI 7 (`@mui/material`, `@mui/icons-material`), React Router DOM 7, Axios, Framer Motion, React Hot Toast.
- **Backend**: Node.js, Express.js (v4.19), JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), PDF Generation (`pdfkit`), Email Transport (`nodemailer`), CORS, Dotenv.
- **Database**: MongoDB & Mongoose ODM (v8.1.1).

---

## 📁 4. Folder Structure (Isolated Sprint_6)

```text
Sprint_6/
├── client/                      # React Frontend Application
│   ├── build/                   # Production build output
│   ├── public/                  # Static assets & index.html
│   └── src/
│       ├── components/          # Reusable UI (AnimatedSuccessCheckmark, Navbar, etc.)
│       ├── layouts/             # DashboardLayout with role-differentiated navigation
│       ├── pages/               # Catalog, Payment, Learning, Certificates, Admin, etc.
│       ├── routes/              # AppRoutes with protected route gates
│       ├── services/            # Axios API clients (course, payment, certificate, admin)
│       └── App.js & index.js    # Entry point & theme configuration
├── server/                      # Node.js API Backend
│   ├── controllers/             # Express controllers for courses, payments, certs, admin
│   ├── middleware/              # authMiddleware, roleMiddleware, error handling
│   ├── models/                  # Mongoose models (Course, Enrollment, PaymentOrder, Certificate, etc.)
│   ├── routes/                  # Modular route declarations
│   ├── seeds/                   # Comprehensive seed data for admin, mentors, and 5 courses
│   ├── services/                # Business logic (course, payment, email, certificate)
│   ├── test_sprint6.js          # Automated 77-case integration test suite
│   ├── package.json             # Backend dependencies and scripts
│   └── index.js                 # Server entry point with auto-seeding
├── certificates/                # Cached generated PDF certificate storage
├── docs/                        # In-depth technical documentation (API.md, Architecture.md)
├── scripts/                     # Executable scripts (run-tests.sh, seed-db.sh, start-server.sh)
├── tests/                       # Integration test suite mirror
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git exclusion rules
├── README.md                    # Sprint 6 Comprehensive Guide
└── BuildReport.md               # Final engineering build report & test verification
```

---

## ⚙️ 5. Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20.x` or `v22.x` recommended; tested on `v26.5.0`).
- **NPM**: `v9.0.0` or higher.
- **MongoDB**: Active MongoDB instance on `mongodb://127.0.0.1:27017` (local community server or MongoDB Atlas).

---

## 📦 6. Installation & Environment Setup

### Step 1: Clone and Enter Sprint_6 Directory
```bash
git clone https://github.com/rahulshaji/mentorconnect-ai.git
cd mentorconnect-ai/Sprint_6
```

### Step 2: Configure Server Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Review or modify `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mentorconnect_sprint6
JWT_SECRET=supersecretjwtkey_sprint6_mentorconnect_ai_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000

# Optional SMTP Settings (System auto-falls back to safe dev simulation mode if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="MentorConnect AI <no-reply@mentorconnect.ai>"
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🚦 7. Running the Application

### Option A: Using Helper Scripts
Open two terminal tabs:
```bash
# Tab 1: Start Backend Server
cd Sprint_6
./scripts/start-server.sh

# Tab 2: Start Frontend Client
cd Sprint_6
./scripts/start-client.sh
```

### Option B: Using Standard NPM Commands
```bash
# Tab 1: Start Backend (Port 5000)
cd Sprint_6/server
npm start

# Tab 2: Start Frontend (Port 3000)
cd Sprint_6/client
npm start
```

*The application client will open at `http://localhost:3000` and communicate with the backend at `http://localhost:5000`.*

---

## 🧪 8. Automated Testing

Sprint 6 includes an exhaustive 77-case integration test suite validating every critical subsystem end-to-end:
```bash
cd Sprint_6/server
node test_sprint6.js
```
*Or via the executable script:*
```bash
cd Sprint_6
./scripts/run-tests.sh
```

### Test Coverage Highlights:
- **Authentication & RBAC**: Registration, login, invalid credentials, protected route rejections.
- **Course Catalog & Details**: Public listing, category filters, difficulty filters, price constraints, individual course lookup.
- **Enrollment Mechanics**: Free course instant enrollment, duplicate enrollment prevention, unpaid course rejection.
- **Simulated Demo Payment**: Server-side price calculation, unique order ID generation, idempotent confirmation, double-billing prevention, order ownership checks.
- **Course Progress Tracking**: Granular lesson progress toggling, progress percentage recalculation, unauthorized progress update rejection.
- **Course Completion Rules**: Assessment evaluation, score calculation, rejection when required lessons or passing grade are unmet.
- **Certificate Engine**: PDF generation verification, unique certificate ID matching, public authenticity check, direct PDF download streaming.
- **Email Engine**: Triggering of all 4 lifecycle email events, safe dev fallback logging, admin retry endpoints.
- **Administrative Operations**: Catalog oversight, payment auditing, certificate auditing, email log verification.
- **Regression Testing**: AMIE recommendation engine, quiz assessments, session booking, and in-app notification dispatching.

**Verification Result: 77/77 tests passed (100% pass rate).**

---

## 💳 9. Demo Payment Workflow Explanation

1. **Course Catalog** (`/courses`): Learner selects a paid course.
2. **Course Detail** (`/courses/:id`): Clicking **"Enroll in Course"** checks authentication and navigates the learner to the simulated payment portal.
3. **Simulated Payment Page** (`/payment/:courseId`):
   - The page requests an order creation from `POST /api/payments/demo/create`.
   - The backend looks up the course in MongoDB and calculates the amount on the server (preventing price tampering).
   - Clear academic disclosure is displayed: *"Demo Payment — No real money will be charged."*
4. **One-Click Confirmation**: Clicking **"Pay with Demo Payment"** calls `POST /api/payments/demo/confirm` with an idempotency key.
5. **Animated Success Screen**: Upon receiving confirmed `succeeded` status from the backend, an SVG green checkmark animates smoothly on the screen displaying the simulated order reference, payment amount, and direct navigation links to **"Go to My Courses"**.
6. **Background Automation**: The backend activates the learner's enrollment, records transaction history, and fires off the receipt email.

---

## 🎓 10. Course Completion & Certification Flow

1. **Lesson Progression**: Learner watches lectures and reads modules inside `/learning/:courseId`. Clicking "Mark Completed" updates server-side progress.
2. **Comprehensive Assessment**: When all required lessons are completed, the learner can initiate the final assessment quiz.
3. **Server-Side Grading**: The backend compares answers against the encrypted answer key, calculates the score, and enforces `passingGrade` (typically 70%).
4. **Certificate Issuance**: If the score meets or exceeds the threshold, the server marks the enrollment as `completed`, creates a unique `Certificate` record (`MC-CERT-XXXXXXXXXXXX`), and initiates PDF rendering.
5. **Download & Public Verification**:
   - Learners can immediately download the A4 landscape PDF from `/certificates`.
   - Employers and third parties can verify authenticity via `/verify/:id`.

---

## 🔑 11. Pre-Seeded Demonstration Accounts

The database seeder automatically provisions test accounts upon server boot:

| Role | Email Address | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mentorconnect.ai` | `Admin123!` | Course authoring, transaction audits, email log monitoring, cert review |
| **Learner** | `learner@example.com` | `Learner123!` | Course browsing, demo payment, lesson completion, quiz assessment, certs |
| **Mentor** | `mentor@example.com` | `Mentor123!` | Profile showcase, schedule availability, AMIE recommendations |

---

## ⚠️ 12. Known Limitations & Development Fallbacks

1. **Academic Payment Simulation**: The payment system uses `paymentType: "DEMO"` and simulated transaction tokens. It does not integrate live banking gateways (e.g. Stripe/Razorpay) and does not store or process real credit cards.
2. **Email Delivery Fallback**: If valid external SMTP credentials are not supplied in `server/.env`, the system automatically routes all outgoing emails to **simulated dev mode**. Delivery events are saved to the `EmailLog` database collection and displayed on the Admin Portal without interrupting the user experience.
3. **Video Content**: Seeded video lesson links point to standard public educational streams (YouTube / Vimeo embed format).
