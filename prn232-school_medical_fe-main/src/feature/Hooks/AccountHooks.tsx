//Hooks related to authentication and user role management
export const useIsAuthenticated = () => {
  const token = localStorage.getItem('authToken'); 
  console.log('Auth Token:', token);
  return !!token;
};

export const useUserRole = () => {
  const userRole = localStorage.getItem('userRole'); 
  console.log('User Role:', userRole);
  return userRole;
}