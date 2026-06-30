// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

//Auth check
const useAuth = () => {
  const token = localStorage.getItem('authToken'); // Ensure this matches your login logic
  return !!token;
};

//Return to login if check false
export const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};