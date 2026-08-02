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

---

### `POST /api/auth/login`
Authenticates credentials and returns a 30-day JWT token.

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

---

## 4. Sprint 2 Endpoints

### `POST /api/quiz/start` (RANS6: Skill Assessment)
Starts a technical skill assessment quiz.

#### Request Body
```json
{
  "skill": "React"
}
```

---

### `POST /api/quiz/submit` (RANS6: Submit Assessment)
Submits quiz answers, evaluates percentage score, updates profile skill proficiency in MongoDB, and logs `QuizResult`.

#### Request Body
```json
{
  "skill": "React",
  "answers": {
    "q_react_1": ["useEffect"],
    "q_react_2": ["To prevent re-rendering when props have not changed"]
  }
}
```

---

### `GET /api/skill-gap` (RANS7: Skill Gap Analysis)
Analyzes learner's current skills against target career goal benchmarks (`Full-Stack Engineer`, `AI Engineer`, etc.) and categorizes skills into `strongSkills`, `weakSkills`, and `missingSkills`.

---

### `GET /api/recommendations` (RANS8 & RANS9: Explainable AMIE v1 Mentors)
Executes Adaptive Mentoring Inference Engine (AMIE v1.0) weighted matching algorithm and returns top recommended mentors with match percentage scores (`89%`) and human-readable matching reasons.
