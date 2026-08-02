# MentorConnect AI — Folder Structure Reference

```text
mentorconnect-ai/
├── client/                      # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Static assets & theme helpers
│   │   ├── components/          # Reusable UI components (Navbar, Footer, ProtectedRoute, SnackbarAlert)
│   │   ├── context/             # AuthContext state management
│   │   ├── hooks/               # Custom React hooks (useAuth)
│   │   ├── layouts/             # DashboardLayout & MainLayout wrappers
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, LearnerDashboard, MentorDashboard, ProfilePage
│   │   ├── routes/              # AppRoutes React Router configuration
│   │   ├── services/            # Axios API clients (api.js, authService.js, profileService.js)
│   │   ├── theme/               # Material UI custom theme system
│   │   ├── utils/               # Helper utilities
│   │   ├── App.js               # Application root
│   │   └── index.js             # React DOM entry point
│   ├── package.json             # Frontend dependencies
│   └── package-lock.json
│
├── server/                      # Node.js Express Backend API
│   ├── config/                  # MongoDB db.js connection configuration
│   ├── controllers/             # authController.js & profileController.js
│   ├── middleware/              # authMiddleware.js & errorMiddleware.js
│   ├── models/                  # Mongoose models: User.js, LearnerProfile.js, MentorProfile.js
│   ├── routes/                  # Express routes: authRoutes.js, profileRoutes.js, mentorRoutes.js
│   ├── services/                # Business logic: authService.js, profileService.js
│   ├── utils/                   # generateToken.js JWT helper
│   ├── index.js                 # Server entry point
│   └── package.json             # Backend dependencies
│
├── docs/                        # Project Architecture & API Documentation
│   ├── Architecture.md          # 3-Tier System Architecture
│   ├── Installation.md          # Step-by-step Setup Guide
│   ├── API.md                   # REST API Endpoint Reference
│   ├── GitSetup.md              # Repository Git Workflow Guide
│   └── FolderStructure.md       # Directory Structure Reference
│
├── screenshots/                 # Application screenshots & UI previews
│   └── .gitkeep
│
├── BuildReport.md               # Production Build Verification Report
├── README.md                    # Primary GitHub Repository Readme
├── LICENSE                      # Project License (MIT)
└── .gitignore                   # Git Ignore Rules
```
