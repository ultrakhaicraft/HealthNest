// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useUserRole } from '../feature/Hooks/AccountHooks';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[]; //Add Role based access control if needed
}

//Return to login if check false
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace
    state={{allowedRoles,attemptedRole: userRole}} />;
  }

  return children;
};