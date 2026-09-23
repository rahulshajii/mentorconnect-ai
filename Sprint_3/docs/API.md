# Sprint 3 API Documentation

## Overview
Sprint 3 expands the MentorConnect AI platform by introducing session scheduling, booking management, mentor profile viewing, and real-time notification endpoints. All endpoints require JWT authorization unless stated otherwise.

---

## 1. Mentor Discovery & Profile Endpoints

### GET `/api/amie/recommendations`
- **Description**: Returns recommended mentors filtered by user domain, skill gaps, minimum experience, minimum rating, and maximum price per session.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `minExperience` (optional number)
  - `minRating` (optional number)
  - `maxPrice` (optional number)
  - `search` (optional string)
- **Response**: `200 OK`
  ```json
  [
    {
      "mentorId": "64f1...",
      "user": { "name": "Jane Doe", "email": "jane@example.com", "avatar": "..." },
      "title": "Senior Staff Engineer",
      "company": "Tech Corp",
      "experienceYears": 10,
      "rating": 4.9,
      "reviewCount": 34,
      "hourlyRate": 80,
      "skills": ["React", "Node.js", "System Design"],
      "matchScore": 94
    }
  ]
  ```

### GET `/api/amie/mentor/:id`
- **Description**: Retrieves full mentor profile details including stats, active schedule, bio, and AMIE recommendation score.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## 2. Session Booking Endpoints

### POST `/api/sessions/book`
- **Description**: Books a mentoring session with a specific mentor. Validates against past dates and existing time slot collisions.
- **Headers**: `Authorization: Bearer <token>`
- **Role**: `learner`
- **Request Body**:
  ```json
  {
    "mentorId": "64f1...",
    "date": "2026-10-15",
    "startTime": "10:00 AM",
    "endTime": "11:00 AM",
    "topic": "System Design & Architecture Review",
    "notes": "Discussing scalable microservices pattern for Sprint 3"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "session": {
      "_id": "65a2...",
      "learnerId": "64e0...",
      "mentorId": "64f1...",
      "date": "2026-10-15T00:00:00.000Z",
      "startTime": "10:00 AM",
      "endTime": "11:00 AM",
      "topic": "System Design & Architecture Review",
      "notes": "Discussing scalable microservices pattern for Sprint 3",
      "status": "pending",
      "createdAt": "2026-09-23T22:00:00.000Z"
    }
  }
  ```

### GET `/api/sessions/my-sessions`
- **Description**: Fetches all sessions for the authenticated user (learners see booked sessions, mentors see received requests/bookings).
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `status` (optional: `pending`, `confirmed`, `completed`, `cancelled`)
- **Response**: `200 OK`

### PUT `/api/sessions/:id/status`
- **Description**: Updates session status (`confirmed`, `cancelled`, `completed`).
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Response**: `200 OK`

---

## 3. Notification Endpoints

### GET `/api/notifications`
- **Description**: Fetches recent in-app notifications for the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### PUT `/api/notifications/:id/read`
- **Description**: Marks a specific notification as read.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### PUT `/api/notifications/read-all`
- **Description**: Marks all unread notifications for the user as read.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
