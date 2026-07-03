import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Guide from '../pages/Guide';
import LoginPage from '../pages/auth/LoginPage';
import UserDashboard from '../pages/user/UserDashboard';
import VotingPage from '../pages/user/VotingPage';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Route guard component for authentication protection
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Voter Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="voter">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/vote"
        element={
          <ProtectedRoute role="voter">
            <VotingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
