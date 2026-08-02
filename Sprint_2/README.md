# MentorConnect AI

**An Intelligent Mentoring Platform with Adaptive Mentoring Inference Engine (AMIE)**

[![Repository](https://img.shields.io/badge/GitHub-rahulshajii%2Fmentorconnect--ai-blue.svg)](https://github.com/rahulshajii/mentorconnect-ai)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19+-61dafb.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Project Overview

MentorConnect AI is a SaaS mentoring platform connecting learners with domain experts. The platform features role-differentiated onboarding, 5-step stepper registration, structured skill level assessments, and stateless JSON Web Token (JWT) authentication backed by Express and MongoDB.

---

## 📁 Repository Structure

```text
mentorconnect-ai/
├── client/          # React.js Frontend Application
├── server/          # Node.js & Express API Backend
├── docs/            # Architecture, API, Installation, Git & Folder Structure Docs
├── screenshots/     # UI Previews & Screenshots
├── BuildReport.md   # Production Build & PR Review Report
├── README.md        # GitHub Repository Overview
├── LICENSE          # MIT License
└── .gitignore       # Git Exclusions
```

---

## 💻 Tech Stack

- **Frontend**: React.js, Material UI (`@mui/material`), React Router DOM, Axios, React Hook Form, Yup, Framer Motion, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT & bcryptjs password encryption

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
cd client
npm install --legacy-peer-deps
npm start
```
*Frontend runs on `http://localhost:3000`.*

---

## 📚 Documentation Links

- **[System Architecture](docs/Architecture.md)**
- **[Installation Guide](docs/Installation.md)**
- **[API Reference](docs/API.md)**
- **[Git Workflow](docs/GitSetup.md)**
- **[Folder Structure](docs/FolderStructure.md)**
- **[Build & Verification Report](BuildReport.md)**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
