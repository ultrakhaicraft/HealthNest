import { useState, useEffect } from "react";
import apiClient from "../../ApiClient";
import { AuthUser } from "../../../models/AccountModel";
import { useAuth } from "../../API/LoginService";

//Hooks related to authentication and user role management
export const useUserRole = () => {
  const userRole = localStorage.getItem('userRole'); 
  console.log('User Role:', userRole);
  return userRole;
}

export const useUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export const useUserName = (): string => {
  return localStorage.getItem('userName') || '';
}


export const useAuthStatus = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {getAuthUserFromCookie} = useAuth();

  useEffect(() => {
    console.log("Running useAuthStatus");
    let cancelled = false;
    getAuthUserFromCookie()
      .then((result)=>{ if (!cancelled) setUser(result); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { user, isAuthenticated: !!user, isLoading };
}


