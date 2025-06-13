import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth'; // Changed to named import

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;