// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus, useUserRole } from '../feature/Hooks/Account/AccountHooks';
import { FullPageSpinner } from '../components/spinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[]; //Add Role based access control if needed
}

//Return to login if check false
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const userRole = useUserRole();

  if(isLoading) return <FullPageSpinner/>

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace
    state={{allowedRoles,attemptedRole: userRole}} />;
  }

  return children;
};