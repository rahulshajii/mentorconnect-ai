import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LearnerDashboard from '../pages/LearnerDashboard';
import MentorDashboard from '../pages/MentorDashboard';
import ProfilePage from '../pages/ProfilePage';
import QuizPage from '../pages/QuizPage';
import SkillGapPage from '../pages/SkillGapPage';
import RecommendedMentorsPage from '../pages/RecommendedMentorsPage';
import MentorProfilePage from '../pages/MentorProfilePage';
import SessionsPage from '../pages/SessionsPage';
import CourseCatalogPage from '../pages/CourseCatalogPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import PaymentPage from '../pages/PaymentPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import CourseLearningPage from '../pages/CourseLearningPage';
import CertificatesPage from '../pages/CertificatesPage';
import CertificateVerifyPage from '../pages/CertificateVerifyPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CourseCatalogPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/verify-certificate/:certificateId" element={<CertificateVerifyPage />} />

      {/* Protected Learner Routes */}
      <Route element={<ProtectedRoute allowedRoles={['learner']} />}>
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/skill-gap" element={<SkillGapPage />} />
        <Route path="/recommendations" element={<RecommendedMentorsPage />} />
        <Route path="/mentor/:id" element={<MentorProfilePage />} />
        <Route path="/payment/:courseId" element={<PaymentPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/courses/:id/learn" element={<CourseLearningPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Route>

      {/* Protected Mentor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Protected Common Routes */}
      <Route element={<ProtectedRoute allowedRoles={['learner', 'mentor', 'admin']} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
