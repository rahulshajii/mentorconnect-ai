# MentorConnect AI — Installation & Setup Guide

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017`

---

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/rahulshajii/mentorconnect-ai.git
cd mentorconnect-ai
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentorconnect
JWT_SECRET=mentorconnect_jwt_secret_key_2026
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```
*Backend runs on `http://localhost:5000`.*

---

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install --legacy-peer-deps
npm start
```
*Frontend runs on `http://localhost:3000`.*

---

## Production Build Verification
To verify production optimization and compilation:
```bash
cd client
npm run build
```
*Produces optimized bundle in `client/build/`.*
