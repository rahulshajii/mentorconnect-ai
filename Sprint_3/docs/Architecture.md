# Sprint 3 Architecture & System Design

## Architecture Diagram

```
+-----------------------------------------------------------------------+
|                          React Frontend (Client)                       |
|  +-------------------+  +--------------------+  +------------------+  |
|  | RecommendedMentors|  | MentorProfilePage  |  |   BookingModal   |  |
|  +-------------------+  +--------------------+  +------------------+  |
|  +-------------------+  +--------------------+                        |
|  |   SessionsPage    |  |  Navbar (Badge)    |                        |
|  +-------------------+  +--------------------+                        |
+-----------------------------------||----------------------------------+
                                    || HTTP REST (JWT Auth Header)
+-----------------------------------\/----------------------------------+
|                           Node.js / Express Server                     |
|  +--------------------+   +-------------------+   +----------------+  |
|  |  sessionRoutes     |   | notificationRoutes|   | amieRoutes     |  |
|  +--------------------+   +-------------------+   +----------------+  |
|  +--------------------+   +-------------------+                       |
|  |  sessionService    |   |notificationService|                       |
|  +--------------------+   +-------------------+                       |
+-----------------------------------||----------------------------------+
                                    || Mongoose ODM
+-----------------------------------\/----------------------------------+
|                            MongoDB Database                           |
|  +--------------------+   +-------------------+   +----------------+  |
|  | sessions           |   | notifications     |   | users/profiles |  |
|  +--------------------+   +-------------------+   +----------------+  |
+-----------------------------------------------------------------------+
```

## Key Modules & Responsibilities

1. **Session Service (`server/services/sessionService.js`)**:
   - Handles session booking creation with validation rules:
     - Date validation: Prevents booking sessions in the past.
     - Slot collision check: Queries existing sessions for `mentorId`, `date`, `startTime` matching non-cancelled statuses.
   - Status transitions (`pending` -> `confirmed` / `cancelled` / `completed`).
   - Generates automatic system notifications on booking and status changes via `notificationService`.

2. **Notification Service (`server/services/notificationService.js`)**:
   - Manages creation, retrieval, and status tracking (`isRead`) of user notifications.
   - Real-time badge integration in frontend Navbar popover.

3. **Frontend Components**:
   - `BookingModal.jsx`: Interactive booking flow with date selection, availability slot chips, topic input, validation, and error display.
   - `MentorProfilePage.jsx`: Full mentor profile viewer with stats, bio, experience, pricing, and AMIE match score.
   - `SessionsPage.jsx`: Central booking management hub supporting filtering by tab (All, Upcoming, Pending, Past, Cancelled) with action buttons (Confirm, Cancel, Complete).
   - `Navbar.jsx`: Enhanced navbar with unread notification counter badge and instant dropdown drawer.
