# Sprint 3 Folder Structure

```
Sprint_3/
├── client/                     # React Frontend Application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── BookingModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── pages/              # Sprint Pages & Views
│   │   │   ├── RecommendedMentorsPage.jsx
│   │   │   ├── MentorProfilePage.jsx
│   │   │   ├── SessionsPage.jsx
│   │   │   ├── LearnerDashboard.jsx
│   │   │   └── MentorDashboard.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/           # Frontend API Clients
│   │   │   ├── sessionService.js
│   │   │   ├── notificationService.js
│   │   │   └── ...
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                     # Node.js / Express Backend Server
│   ├── controllers/            # Route Controllers
│   │   ├── sessionController.js
│   │   ├── notificationController.js
│   │   └── ...
│   ├── models/                 # Mongoose Schemas & Models
│   │   ├── Session.js
│   │   ├── Notification.js
│   │   └── ...
│   ├── routes/                 # Express API Routes
│   │   ├── sessionRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── ...
│   ├── services/               # Core Business Logic Services
│   │   ├── sessionService.js
│   │   └── notificationService.js
│   ├── index.js
│   └── package.json
│
├── docs/                       # Comprehensive Architecture & System Docs
│   ├── API.md
│   ├── Architecture.md
│   ├── Installation.md
│   └── FolderStructure.md
│
├── BuildReport.md              # Full Technical Verification & Audit Report
└── README.md                   # Sprint 3 Overview & Execution Guide
```
