# MentorConnect AI — API Reference Documentation

Base API URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Registers a new user (Learner or Mentor) and creates their corresponding MongoDB profile.

#### Request Body
```json
{
  "name": "Rahul Shaji",
  "email": "rahul.learner@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "learner",
  "education": "B.Tech Computer Science",
  "careerGoal": "Full-Stack Engineer",
  "skills": [
    { "name": "React", "level": "Advanced" },
    { "name": "Node.js", "level": "Intermediate" }
  ]
}
```

#### Response (201 Created)
```json
{
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a6ef338b046195a6dabe499",
    "name": "Rahul Shaji",
    "email": "rahul.learner@example.com",
    "role": "learner"
  },
  "profile": {
    "userId": "6a6ef338b046195a6dabe499",
    "education": "B.Tech Computer Science",
    "careerGoal": "Full-Stack Engineer",
    "skills": [
      { "name": "React", "level": "Advanced" },
      { "name": "Node.js", "level": "Intermediate" }
    ]
  }
}
```

---

### `POST /api/auth/login`
Authenticates credentials and returns a 30-day JWT token.

#### Request Body
```json
{
  "email": "rahul.learner@example.com",
  "password": "password123"
}
```

---

### `GET /api/auth/me`
Retrieves current user details for persistent login verification. Requires `Authorization: Bearer <token>`.

---

## 2. Profile Endpoints (`/api/profile`)

### `GET /api/profile`
Fetches authenticated user profile. (Protected)

### `PUT /api/profile`
Updates authenticated user profile fields including structured skills/expertise arrays. (Protected)

---

## 3. Mentors Endpoints (`/api/mentors`)

### `GET /api/mentors`
Retrieves list of registered mentors. (Public)
