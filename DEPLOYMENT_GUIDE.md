# 🚀 MentorConnect AI — Complete Free Hosting Guide

This guide provides step-by-step instructions to host **MentorConnect AI** (Frontend, Backend, and Database) **100% free** using industry-standard cloud providers:
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 Shared Cluster — forever free, 512MB)
- **Backend API**: [Render](https://render.com) (Free Web Service — Node.js runtime)
- **Frontend App**: [Vercel](https://vercel.com) (Free Hobby Tier — global Edge CDN) OR [Render Static Site](https://render.com) (Free)

---

## 📋 Table of Contents
1. [Step 1: Set Up Free MongoDB Atlas Database](#step-1-set-up-free-mongodb-atlas-database)
2. [Step 2: Deploy Backend to Render (Free Web Service)](#step-2-deploy-backend-to-render-free-web-service)
3. [Step 3: Deploy Frontend to Vercel or Render (Free)](#step-3-deploy-frontend-to-vercel-or-render-free)
4. [Step 4: Connect Frontend to Backend](#step-4-connect-frontend-to-backend)
5. [Step 5: Verify Live Platform Features](#step-5-verify-live-platform-features)
6. [Environment Variables Reference](#environment-variables-reference)

---

## Step 1: Set Up Free MongoDB Atlas Database

1. **Sign Up / Log In**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Free Cluster**:
   - Click **"Create Database"** or **"Build a Database"**.
   - Select the **M0 Free** tier (Shared, $0/month forever).
   - Choose a cloud provider and region closest to you (e.g., AWS / N. Virginia or Frankfurt).
   - Name your cluster (e.g., `Cluster0`) and click **"Create"**.
3. **Configure Database User & Access**:
   - In **Security > Database Access**:
     - Click **"Add New Database User"**.
     - Choose **Password** authentication.
     - Username: `mentoradmin` (or your choice).
     - Password: Click **"Autogenerate Secure Password"** and **COPY IT**.
     - Role: **"Read and write to any database"**.
     - Click **"Add User"**.
   - In **Security > Network Access**:
     - Click **"Add IP Address"**.
     - Select **"Allow Access from Anywhere"** (`0.0.0.0/0`) so Render can connect.
     - Click **"Confirm"**.
4. **Get Connection String**:
   - In **Databases > Cluster0**, click **"Connect"**.
   - Choose **"Drivers"** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://mentoradmin:<password>@cluster0.xxxxx.mongodb.net/mentorconnect?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password, and ensure database name is `/mentorconnect`.

---

## Step 2: Deploy Backend to Render (Free Web Service)

1. **Sign Up / Log In to Render**:
   - Visit [render.com](https://render.com) and sign in using your GitHub account (`rahulshajii`).
2. **Create Web Service**:
   - In the Render Dashboard, click **"New +"** > **"Web Service"**.
   - Select **"Build and deploy from a Git repository"**.
   - Connect your repository: `rahulshajii/mentorconnect-ai`.
3. **Configure Backend Settings**:
   - **Name**: `mentorconnect-api`
   - **Region**: Choose closest to your MongoDB Atlas region (e.g., Oregon or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **Add Environment Variables**:
   Under **Environment Variables**, click **"Add Environment Variable"**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Render port (handled automatically) |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | *(Generate a 32-character random string)* | Secret key for JWT authentication |
   | `APP_BASE_URL` | `https://your-frontend-url` | (Update after deploying frontend) |
   | `CLIENT_URL` | `https://your-frontend-url` | (Update after deploying frontend) |

5. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will clone the repo, install dependencies, connect to MongoDB, seed baseline courses and admin user, and start the API.
   - Once deployment status is **"Live"**, copy your backend URL:
     `https://mentorconnect-api.onrender.com`
   - Test it in your browser: `https://mentorconnect-api.onrender.com/api/stats`
     *(Should return JSON with `success: true` and active counts).*

---

## Step 3: Deploy Frontend to Vercel or Render (Free)

### Option A: Vercel (Recommended — Ultra Fast)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Import `rahulshajii/mentorconnect-ai`.
4. In **Project Configuration**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click "Edit" and choose `client`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. In **Environment Variables**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://mentorconnect-api.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **"Deploy"**.
7. In ~60 seconds, your site is live at: `https://mentorconnect-ai.vercel.app`!
   *(The included `client/vercel.json` automatically ensures all client-side routes like `/courses` and `/verify-certificate/:id` resolve without 404 errors).*

### Option B: Render Static Site (Free)
1. In Render Dashboard, click **"New +"** > **"Static Site"**.
2. Select `rahulshajii/mentorconnect-ai`.
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. In **Environment Variables**:
   - `REACT_APP_API_URL`: `https://mentorconnect-api.onrender.com/api`
5. In **Redirects / Rewrites**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite` *(Pre-configured in `public/_redirects`)*
6. Click **"Create Static Site"**.

---

## Step 4: Connect Frontend to Backend

1. In your Render Backend (`mentorconnect-api`) **Environment Variables**:
   - Set `APP_BASE_URL` = `https://your-frontend.vercel.app`
   - Set `CLIENT_URL` = `https://your-frontend.vercel.app`
2. Save changes (Render will trigger a zero-downtime quick restart).

---

## Step 5: Verify Live Platform Features

Once deployed, visit your live frontend URL and test all key workflows:
1. **Browse Courses**: Navigate to `/courses`, filter by Category and Free/Paid.
2. **Admin Dashboard**:
   - Sign in with default admin credentials:
     - **Email**: `admin@mentorconnect.ai`
     - **Password**: `adminpassword123`
   - Access `/admin` to inspect real-time platform metrics, course catalogs, enrollment records, and live transactional email logs.
3. **Learner Course Completion & Automated Emails**:
   - Register or log in as a learner.
   - Enroll in a course (free or via 1-click simulated demo payment).
   - Complete lessons and take the assessment.
   - Upon completion, the system automatically:
     - Mints a cryptographically signed landscape PDF Certificate.
     - Logs the **Course Completion Email** and **Payment Settlement Email** with 100% balance settlement confirmation.
4. **Certificate Public Verification**:
   - Navigate to `/verify-certificate/<CERTIFICATE_ID>` to verify authentic credential status publicly without login.

---

## 🛠️ Automated Render Blueprint Deployment (`render.yaml`)

This repository includes a pre-configured `render.yaml` file at the root.
To deploy both the Backend API and Frontend in one single click:
1. In Render, go to **"Blueprints"** > **"New Blueprint Instance"**.
2. Connect `rahulshajii/mentorconnect-ai`.
3. Enter your `MONGODB_URI`.
4. Click **"Apply"** — Render will automatically build and link both services!

---

## 📞 Support & Troubleshooting

- **Cold Starts on Free Tier**: Render free web services spin down after 15 minutes of inactivity. The first request after idle may take ~30-40 seconds to wake up.
- **CORS Issues**: Ensure `REACT_APP_API_URL` includes `/api` at the end (e.g., `https://mentorconnect-api.onrender.com/api`).
- **Database Connectivity**: Ensure IP `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access.
