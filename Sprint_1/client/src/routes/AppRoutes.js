import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LearnerDashboard from '../pages/LearnerDashboard';
import MentorDashboard from '../pages/MentorDashboard';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Learner Routes */}
      <Route element={<ProtectedRoute allowedRoles={['learner']} />}>
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
      </Route>

      {/* Protected Mentor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      </Route>

      {/* Protected Common Routes */}
      <Route element={<ProtectedRoute allowedRoles={['learner', 'mentor']} />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
