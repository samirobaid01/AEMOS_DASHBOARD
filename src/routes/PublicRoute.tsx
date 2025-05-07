import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../state/slices/auth.slice';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = '/dashboard' }: PublicRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute; 