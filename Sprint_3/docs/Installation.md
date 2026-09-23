# Sprint 3 Setup & Installation Guide

## Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

## Step-by-Step Installation

### 1. Repository Setup
```bash
git clone https://github.com/rahulshajii/mentorconnect-ai.git
cd mentorconnect-ai
```

### 2. Server Installation & Configuration
```bash
cd server
npm install
```
Create a `.env` file inside `server/` with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentorconnect
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
npm start
# or for development mode:
npm run dev
```

### 3. Client Installation & Configuration
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file inside `client/` if needed:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend application:
```bash
npm start
```
Access the application at `http://localhost:3000`.

---

## Verifying Sprint 3 Features
1. Log in as a **Learner**.
2. Navigate to **Mentor Discovery** (`/recommended-mentors`).
3. Click **View Profile** on any mentor card to access `/mentor/:id`.
4. Click **Book Session** to open the interactive booking modal. Select a date and time slot, enter a topic, and submit.
5. Check the **Navbar Notification Bell** for booking confirmation notifications.
6. Navigate to **My Sessions** (`/sessions`) to view and manage upcoming sessions.
7. Log in as a **Mentor** to review incoming booking requests, accept/confirm them, or decline.
