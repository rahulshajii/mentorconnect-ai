# Sprint 6 Architecture & Technical Design — MentorConnect AI

## 1. Architectural Philosophy & Isolation

MentorConnect AI Sprint 6 is designed as an independent, fully encapsulated, production-grade module while retaining seamless compatibility with previous sprint features (AMIE engine, skill-gap quiz assessment, session booking, and notifications).

```
Sprint_6/
├── client/              # React 19 SPA with Material-UI 7 & Framer Motion
│   ├── src/
│   │   ├── components/  # Animated checkmarks, navbars, modals
│   │   ├── pages/       # Catalog, Details, Payment, Learning, Certificates, Admin
│   │   ├── services/    # Axios client services (course, payment, certificate, admin)
│   │   └── routes/      # Public and protected role-based routing
├── server/              # Node.js + Express REST API Backend
│   ├── controllers/     # HTTP Request orchestrators
│   ├── middleware/      # JWT auth, role validation, error handlers
│   ├── models/          # Mongoose Schemas with compound indexes
│   ├── routes/          # Express route definitions
│   ├── seeds/           # Initial catalog, admin, and mentor seeders
│   └── services/        # Business logic: course, payment, email, certificate
├── certificates/        # Server-side generated PDF storage cache
├── docs/                # Architecture and API documentation
├── scripts/             # Execution, seeding, and test runners
└── tests/               # 77-case automated integration test suite
```

---

## 2. Core Subsystems

### A. Course Management Subsystem
- **Curriculum Architecture**: Courses are structured with nested lesson subdocuments comprising titles, video/reading content URLs, duration, and order.
- **Completion Criteria**: Configurable per course:
  - `requiredLessonsCount`: minimum completed lessons.
  - `requireAssessment`: boolean flag requiring a post-course evaluation.
  - `passingGrade`: minimum score percentage (default 70%).
  - `assessmentQuestions`: array of questions with multiple-choice options, correct option index, and explanations.
- **Server-Side Enforcement**: Progress updates recalculate the completion percentage server-side based on actual completed lessons array size relative to total lessons.

### B. Academic Demo Payment Engine
- **Zero Financial Risk**: The system explicitly identifies all transactions as `DEMO` payments for academic evaluation. No credit card or banking information is ever collected or processed.
- **Server Price Derivation**: Client requests cannot alter or specify course prices. The backend retrieves the authorized price directly from MongoDB via `Course.findById()`.
- **Idempotency Guarantee**: Every demo payment order creates an `orderId` (`MC-ORD-<timestamp>-<hash>`) and associated `idempotencyKey`. Repeated payment confirmations with the same order reference return the existing successful transaction rather than double-billing or duplicating enrollments.
- **State Machine**:
  ```
  [Unenrolled]
       │
       ▼
  POST /demo/create ──► [Order: Pending]
                             │
                             ▼
  POST /demo/confirm ─► [Order: Succeeded] ──► [Enrollment: Active / Paid]
                                                      │
                                                      ├─► [Payment Receipt Email]
                                                      └─► [In-App Notification]
  ```

### C. Automated Email Engine & Reliability
- **Architecture**: Decoupled service layer (`emailService.js`) using `nodemailer` and custom HTML/Text template generators (`emailTemplates.js`).
- **Resilience & Development Mode**:
  - If SMTP credentials are valid, messages are transmitted directly to the configured mail server.
  - If SMTP credentials are not configured or unreachable, the system automatically falls back to **simulated dev mode** without failing the user transaction. It persists an `EmailLog` record with status `simulated_dev` and logs the event safely without exposing passwords.
- **Event Workflows**:
  1. `course_enrollment`: Welcome and course navigation instructions.
  2. `demo_payment_receipt`: Simulated order reference, course name, and demo amount.
  3. `course_completion`: Celebration of learning milestones and quiz scores.
  4. `certificate_issued`: Verification URL, certificate ID, and download links.
- **Auditability**: Administrative endpoints allow inspecting all sent, simulated, and failed emails with an atomic `/retry` action.

### D. Cryptographic Certificate Subsystem
- **Engine**: Pure Node.js server-side streaming PDF generator using `pdfkit`.
- **Visual Design**: Professional landscape layout (A4), dual-tone border accents, official badge emblems, issue and completion dates, student and instructor names, and unique verification stamp.
- **Unforgeable Verification**: Each certificate receives a unique, unpredictable ID (`MC-CERT-<12-character-crypto-hex>`). The public verification endpoint (`GET /api/certificates/verify/:id`) checks the database and returns authenticity metadata without disclosing confidential user details.
- **Idempotent Issuance**: Multiple completion triggers for the same learner and course resolve to the identical single certificate record.

---

## 3. Security Model

1. **JWT Authentication & RBAC**: Every protected route evaluates `authMiddleware.js`, extracting `req.user` with role authorization checks (`roleMiddleware(['learner'])`, `roleMiddleware(['admin'])`).
2. **Object Ownership**: Learner endpoints verify that `req.user.id` matches `enrollment.learnerId`, `order.learnerId`, or `certificate.learnerId`.
3. **Database Constraints**:
   - `Enrollment`: Unique compound index on `{ learnerId: 1, courseId: 1 }` prevents duplicate records.
   - `PaymentOrder`: Unique compound index on `{ orderId: 1 }` and `{ idempotencyKey: 1 }`.
   - `Certificate`: Unique index on `{ certificateId: 1 }`.
4. **Data Sanitization**: Skills and expertise subdocuments are automatically sanitized during registration to prevent schema CastErrors.
