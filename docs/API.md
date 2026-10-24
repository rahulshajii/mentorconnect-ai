# Sprint 6 API Documentation — MentorConnect AI

## Overview
Sprint 6 delivers an enterprise-grade learning management and credentialing extension to MentorConnect AI. This includes full course cataloging, demo simulated payments with idempotency controls, server-verified course progress and completion rules, automated PDF certificate generation and cryptographic public verification, audit-logged email notifications, and administrative dashboards.

All endpoints require JWT authorization (`Bearer <token>`) unless explicitly designated as public.

---

## 1. Course Management Endpoints

### GET `/api/courses` (Public / Authenticated)
- **Description**: Returns all published courses matching search and filter queries.
- **Query Parameters**:
  - `search` (string): Search course titles and descriptions.
  - `category` (string): Filter by category (e.g. `Full-Stack Development`, `Artificial Intelligence`, `Cloud & DevOps`).
  - `level` (string): `Beginner`, `Intermediate`, `Advanced`, `All Levels`.
  - `isFree` (boolean): `true` for free courses, `false` for paid courses.
  - `minPrice` / `maxPrice` (numbers): Price boundaries.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "courses": [
      {
        "_id": "67b8...",
        "title": "Full-Stack Web Engineering with React & Node.js",
        "category": "Full-Stack Development",
        "level": "Intermediate",
        "price": 49.99,
        "currency": "USD",
        "isFree": false,
        "duration": "14 hours",
        "curriculum": [ ... ],
        "completionRequirements": {
          "requiredLessonsCount": 3,
          "requireAssessment": true,
          "passingGrade": 70
        }
      }
    ]
  }
  ```

### GET `/api/courses/:id` (Public / Authenticated)
- **Description**: Retrieves detailed course information including instructor details, learning objectives, prerequisites, curriculum structure, and if authenticated, the user's enrollment and completion status.
- **Response**: `200 OK`

### POST `/api/courses/:id/enroll` (Learner Only)
- **Description**: Enrolls an authenticated learner in a free course. For paid courses, returns `402 Payment Required` with redirection guidance to `/api/payments/demo/create`.
- **Response**: `201 Created` / `200 OK` (if already enrolled)

### GET `/api/courses/my` (Learner Only)
- **Description**: Retrieves all courses enrolled by the authenticated learner, including completion progress, completed lesson IDs, certificate ID, and payment status.
- **Response**: `200 OK`

### GET `/api/courses/:id/progress` (Learner Only)
- **Description**: Returns the active learner's granular progress, completed lesson identifiers, completion percentage, and certificate status.
- **Response**: `200 OK`

### PUT `/api/courses/:id/lessons/:lessonId/progress` (Learner Only)
- **Description**: Toggles or updates lesson completion. Recalculates progress percentage on the server.
- **Request Body**:
  ```json
  {
    "completed": true
  }
  ```
- **Response**: `200 OK`

### POST `/api/courses/:id/complete` (Learner Only)
- **Description**: Submits final assessment answers and requests course completion verification. Validates on the backend that all required lessons have been completed and assessment answers achieve `>= passingGrade`. Automatically issues a unique certificate, records completion date, and dispatches automated completion & certificate emails.
- **Request Body**:
  ```json
  {
    "assessmentAnswers": [1, 2, 0]
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Congratulations! You completed the course.",
    "enrollment": { "status": "completed", "progress": 100 },
    "certificate": {
      "certificateId": "MC-CERT-D7F8A1B2C3D4",
      "verificationUrl": "http://localhost:3000/verify/MC-CERT-D7F8A1B2C3D4"
    }
  }
  ```

---

## 2. Simulated Demo Payment Endpoints

### POST `/api/payments/demo/create` (Learner Only)
- **Description**: Initializes an order for a paid course. The price is strictly retrieved from the course database record (never trusting client-supplied values). Generates an idempotency key and unique order reference.
- **Request Body**:
  ```json
  {
    "courseId": "67b8..."
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "order": {
      "orderId": "MC-ORD-1740236100000-8F92",
      "courseId": "67b8...",
      "amount": 49.99,
      "currency": "USD",
      "paymentType": "DEMO",
      "status": "pending",
      "idempotencyKey": "MC-ORD-1740236100000-8F92-IDEMP"
    }
  }
  ```

### POST `/api/payments/demo/confirm` (Learner Only)
- **Description**: Executes the simulated payment confirmation. Idempotent: repeated calls with the same `orderId` or `idempotencyKey` return the existing transaction record without duplicate processing or duplicate enrollment. Grants paid course enrollment, records transaction reference, dispatches receipt email, and sends an in-app notification.
- **Request Body**:
  ```json
  {
    "orderId": "MC-ORD-1740236100000-8F92",
    "idempotencyKey": "MC-ORD-1740236100000-8F92-IDEMP"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Simulated payment processed successfully.",
    "payment": {
      "orderId": "MC-ORD-1740236100000-8F92",
      "status": "succeeded",
      "transactionReference": "TXN-DEMO-A1B2C3D4E5F6",
      "amount": 49.99,
      "currency": "USD",
      "paymentType": "DEMO"
    },
    "enrollment": {
      "courseId": "67b8...",
      "status": "active",
      "paymentStatus": "paid"
    }
  }
  ```

### GET `/api/payments/my` (Learner Only)
- **Description**: Returns all simulated payment transaction records for the authenticated learner.

### GET `/api/payments/order/:orderId` (Learner Only)
- **Description**: Fetches the status and breakdown for a specific order owned by the authenticated learner.

---

## 3. Certificate Generation & Verification Endpoints

### GET `/api/certificates/my` (Learner Only)
- **Description**: Returns all certificates earned by the authenticated learner with course information and verification metadata.

### GET `/api/certificates/verify/:id` (Public)
- **Description**: Verifies a certificate by its unique `certificateId` (e.g. `MC-CERT-XXXXXXXXXXXX`). Publicly accessible for employers and academic institutions. Does not leak sensitive learner private information (such as passwords, email, or billing history).
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "valid": true,
    "certificate": {
      "certificateId": "MC-CERT-D7F8A1B2C3D4",
      "recipientName": "Rahul Shaji",
      "courseTitle": "Full-Stack Web Engineering with React & Node.js",
      "instructorName": "Dr. Sarah Chen",
      "issuedAt": "2026-10-22T14:40:00.000Z",
      "completionDate": "2026-10-22T14:40:00.000Z",
      "score": 100,
      "status": "issued"
    }
  }
  ```

### GET `/api/certificates/:id/download` (Learner / Admin)
- **Description**: Dynamically streams a high-resolution, landscape A4 PDF certificate generated on the server using PDFKit, complete with official guilloche borders, certification ribbon icon, unique certificate ID, and verification link.
- **Headers**:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="MentorConnect_Certificate_MC-CERT-...pdf"`

---

## 4. Email Notification & Audit Endpoints

### GET `/api/email/status` (Admin Only)
- **Description**: Checks SMTP transporter connectivity and provides a summary count of queued, sent, and failed email deliveries.

### POST `/api/email/:id/retry` (Admin Only)
- **Description**: Re-attempts transmission of a previously failed or simulated email log record.

---

## 5. Administrative Endpoints (Admin Only)

### GET `/api/admin/stats`
- **Description**: Returns high-level platform analytics: total courses, published courses, active enrollments, completed courses, total simulated revenue, total certificates issued, and email audit counts.

### GET `/api/admin/courses`
- **Description**: Returns all courses (both published and draft).

### POST `/api/admin/courses`
- **Description**: Creates a new course with curriculum, pricing, and completion criteria.

### PUT `/api/admin/courses/:id`
- **Description**: Updates an existing course, including price, publication state, and curriculum lessons.

### DELETE `/api/admin/courses/:id`
- **Description**: Deletes an unpublished course or archives an active course.

### GET `/api/admin/enrollments`
- **Description**: Lists all platform enrollments with learner, course, progress, and payment status.

### GET `/api/admin/payments`
- **Description**: Lists all simulated demo payment orders and transactions across the platform.

### GET `/api/admin/certificates`
- **Description**: Lists all issued course certificates.

### GET `/api/admin/email-logs`
- **Description**: Displays the complete server-side audit log of all automated email events (`course_enrollment`, `demo_payment_receipt`, `course_completion`, `certificate_issued`), showing recipient, status (`sent`, `simulated_dev`, `failed`), retry attempts, and sanitized errors.
