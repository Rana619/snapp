
import { ReactNode } from "react";
import { useLocation } from "wouter";
import LoginPage from "@/pages/login";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.type";

interface RouteGuardProps {
  children: ReactNode;
  requiresAuth: boolean;
  roles?: string[];
}

export function RouteGuard({ children, requiresAuth, roles }: RouteGuardProps) {
  const [location, navigate] = useLocation();
  const isLoginPage = location === "/login";

  const authToken = useSelector((state:RootState)=> state.user)?.authToken;
  const userData = useSelector((state:RootState)=> state.user)?.user;
  const userRoles = userData ? userData.roles || ["user"] : [];

  const isAuthenticated = !!authToken;

  // If route requires auth but user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    navigate("/login")
  }

  // If user is authenticated but on login page, redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    window.history.pushState({}, "", "/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
    return null;
  }

  // Check role-based access
  if (requiresAuth && roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
