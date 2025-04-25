// AuthGuard.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-context';


interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated , login, logout} = useAuth();

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      login();
    } else {
      logout();
    }
  }, [login, logout]);

  if (!isAuthenticated && !sessionStorage.getItem('user_id')) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
