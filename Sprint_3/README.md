# Sprint 3: Mentor Discovery, Booking System & In-App Notifications

MentorConnect AI — An Intelligent Mentoring Platform with Adaptive Mentoring Inference Engine (AMIE).

## Overview

Sprint 3 builds upon the foundational authentication, user profile management (Sprint 1), and AMIE Skill Gap Analysis & Matching Engine (Sprint 2) by delivering the full lifecycle of mentor discovery, interactive session scheduling, request/booking management, and real-time in-app notifications.

---

## Deliverables & Features

### 1. Task R31: Mentor Discovery & Profile Viewing
- **Recommended Mentors Page (`/recommended-mentors`)**:
  - Interactive search bar (by mentor name, title, or skills).
  - Multi-parameter filters: Minimum Experience, Minimum Rating, and Maximum Price.
  - Integration with AMIE Engine match scores.
  - "View Profile" navigation button leading directly to individual mentor profiles.
- **Dedicated Mentor Profile Page (`/mentor/:id`)**:
  - Displays avatar, name, title, bio, company, experience years, hourly rate, and rating stats.
  - AMIE match score breakdown customized to the logged-in learner's skill gap profile.
  - Direct "Book Session" interactive call to action.

### 2. Task R32: Session Booking & Booking Management
- **Interactive Booking Modal (`BookingModal.jsx`)**:
  - Date selection with automatic past-date blocking.
  - Dynamic slot selection (chips) for start and end times.
  - Topic and optional meeting notes input fields.
  - Real-time client-side validation and immediate visual feedback.
- **Backend Session Service (`server/services/sessionService.js`)**:
  - Double-booking / time slot collision detection for non-cancelled status.
  - Strict past-date validation.
  - Full CRUD operations with role-based access control.
- **Booking Management Hub (`/sessions`)**:
  - Unified view for both Learners and Mentors.
  - Filter tabs: All, Upcoming, Pending, Completed, Cancelled.
  - Interactive status controls: Mentors can Confirm or Cancel requests; Learners/Mentors can mark completed.

### 3. In-App Notifications Module
- **Notification Service & Controller**:
  - Mongoose notification schema storing recipient, title, message, type, link, and read status (`isRead`).
  - Automatic notification triggers dispatched whenever a session is created or its status changes.
- **Navbar Integration**:
  - Notification bell icon with real-time unread badge counter.
  - Dropdown popover displaying recent notifications with "Mark as Read" and "Mark All as Read" actions.

---

## Verification & Testing
- Unit and integration tests cover slot collision prevention, past date rejection, status transition enforcement, and notification dispatches.
- Build verified with 0 errors across frontend and backend environments.
