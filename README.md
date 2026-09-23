# MentorConnect AI

**An Intelligent Mentoring Platform with Adaptive Mentoring Inference Engine (AMIE)**

[![Repository](https://img.shields.io/badge/GitHub-rahulshajii%2Fmentorconnect--ai-blue.svg)](https://github.com/rahulshajii/mentorconnect-ai)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19+-61dafb.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Project Overview

MentorConnect AI is an AI-powered SaaS mentoring platform connecting learners with domain experts. The platform features role-differentiated onboarding, structured skill gap analysis via the Adaptive Mentoring Inference Engine (AMIE), interactive mentor discovery, multi-parameter filtering, session booking management, and real-time in-app notifications.

---

## 📁 Repository Structure

```text
mentorconnect-ai/
├── client/          # React.js Frontend Application
├── server/          # Node.js & Express API Backend
├── Sprint_1/        # Sprint 1 Codebase & Documentation (Auth & Profiles)
├── Sprint_2/        # Sprint 2 Codebase & Documentation (Quiz & AMIE Engine)
├── Sprint_3/        # Sprint 3 Codebase & Documentation (Discovery, Booking & Notifications)
├── DATASET/         # Sample Data & Benchmark Assets
├── README.md        # Repository Overview
└── .gitignore       # Git Exclusions
```

---

## 💻 Tech Stack

- **Frontend**: React.js, Material UI (`@mui/material`), React Router DOM, Axios, React Hook Form, Yup, Framer Motion, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT & bcryptjs password encryption
- **AI Inference Engine**: AMIE Skill Gap Analysis & Mentor Matching Algorithm

---

## 🏁 Sprints Summary

- **Sprint 1**: Core Authentication, Role-based Onboarding (Learner / Mentor), Stepper Profiles, JWT Auth.
- **Sprint 2**: Skill Gap Assessment Quiz, Dynamic Radar Visualization, AMIE Matching Engine.
- **Sprint 3**: Mentor Discovery (`/recommended-mentors`), Dedicated Mentor Profiles (`/mentor/:id`), Session Booking Modal (`BookingModal.jsx`), Booking Management Hub (`/sessions`), Real-time In-App Notifications.

---

## 🛠️ Quick Start

### 1. Backend Setup
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd Sprint_3/client
npm install
npm start
```
*Frontend runs on `http://localhost:3000`.*

---

## 📚 Sprint Documentation Links

- **[Sprint 1 Documentation](Sprint_1/README.md)**
- **[Sprint 2 Documentation](Sprint_2/README.md)**
- **[Sprint 3 README](Sprint_3/README.md)** | **[Build Report](Sprint_3/BuildReport.md)** | **[API Docs](Sprint_3/docs/API.md)** | **[Architecture](Sprint_3/docs/Architecture.md)**

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
