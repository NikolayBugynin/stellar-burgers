import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  selectIsAuthenticated,
  selectLoginRequest
} from '../../services/slices/user/slice';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectLoginRequest);
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShouldRender(true);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!shouldRender) {
    return null; // or <Preloader /> during initial render
  }

  // Redirect unauthenticated users away from protected routes
  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  // Redirect authenticated users away from auth-only routes (like login/register)
  if (onlyUnAuth && isAuthChecked) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  // Return children if all checks pass
  return children;
};
