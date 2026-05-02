import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export function withAuthGuard(Component, options = {}) {
  const { requiredRole } = options;

  return function ProtectedRoute(props) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
      return <LoadingSpinner message="Checking authentication..." />;
    }

    if (!isAuthenticated) {
      // Redirect to the login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  };
}

export default withAuthGuard;
