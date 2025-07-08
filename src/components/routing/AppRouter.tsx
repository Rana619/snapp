import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { RouteGuard } from "./RouteGuard";
import { Skeleton } from "@/components/ui/skeleton";
import ReportsPage from "@/pages/reports";

// Lazy load components
const ListingPage = lazy(() => import("@/pages/listing"));
const DetailsPage = lazy(() => import("@/pages/details"));
const LoginPage = lazy(() => import("@/pages/login"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
import TemplateBuilderPage from "@/pages/template-builder";

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col">
    <div className="bg-white shadow-sm border-b border-gray-200">
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="flex-1 p-6">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  </div>
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/login">
          <RouteGuard requiresAuth={false}>
            <LoginPage />
          </RouteGuard>
        </Route>
        
        <Route path="/">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <DashboardPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/dashboard">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <DashboardPage />
          </RouteGuard>
        </Route>
        
        {/* <Route path="page/accounts">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <ListingPage />
          </RouteGuard>
        </Route> */}
        
        <Route path="page/leads">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <ListingPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/reports">
          <RouteGuard requiresAuth={true} roles={["user","admin"]}>
            <ReportsPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/settings">
          <RouteGuard requiresAuth={true} roles={["admin"]}>
            <ListingPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/template-builder">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <TemplateBuilderPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/:entityType">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <ListingPage />
          </RouteGuard>
        </Route>
        
        <Route path="page/:entityType/:id">
          <RouteGuard requiresAuth={true} roles={["user", "admin"]}>
            <DetailsPage />
          </RouteGuard>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}