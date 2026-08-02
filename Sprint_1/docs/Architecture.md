# MentorConnect AI — System Architecture Specification

## Overview

MentorConnect AI is built following clean 3-tier enterprise web application architecture principles:

```
[ Client Tier ]               [ API Tier ]                 [ Data Tier ]
React.js (v19)       <--->   Express.js REST API    <--->   MongoDB & Mongoose
Material UI Theme            JWT Middleware                 User Collections
Axios & Bearer Interceptor    bcrypt Hashing                 Learner / Mentor Profiles
```

---

## Tier Definitions

### 1. Presentation Tier (`/client`)
- **Framework**: React 19 with functional components & custom hooks.
- **Routing**: `react-router-dom` (v6) enforcing public and role-based `ProtectedRoute` components.
- **State Management**: `AuthContext` providing persistent JWT token verification (`localStorage`), user state, and `react-hot-toast` notifications.
- **Design System**: Customized Material UI (`@mui/material`) theme defining brand palette (`#0A66C2` primary, `#2563EB` secondary, `#14B8A6` accent, `#F8FAFC` background).

### 2. Application & API Tier (`/server`)
- **Runtime**: Node.js & Express framework.
- **Middleware**:
  - `authMiddleware.js`: Verifies stateless JWT Bearer tokens and enforces role access rules (`authorizeRoles`).
  - `errorMiddleware.js`: Handles uncaught operational errors cleanly.
- **Services & Controllers**: MVC pattern separating route handling (`controllers/`) from business logic (`services/`).

### 3. Data Tier (MongoDB)
- **Database**: MongoDB instance (`mongodb://localhost:27017/mentorconnect`).
- **Schemas**:
  - `User`: Base user identity with bcrypt-encrypted passwords.
  - `LearnerProfile`: Educational background, career goals, and structured skill proficiency arrays `[{ name, level }]`.
  - `MentorProfile`: Mentoring experience, session pricing (`sessionPrice`), availability schedule, and structured expertise arrays `[{ name, experience }]`.
