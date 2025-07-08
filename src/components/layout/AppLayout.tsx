import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchLayout } from "@/api";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.type";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const isLoginPage = location === "/login";
  const isAuthenticated = !!useSelector((state:RootState)=> state.user).authToken;

  const {
    data: layout,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/layout"],
    queryFn: fetchLayout,
    retry: 2,
    retryDelay: 1000,
    enabled: !isLoginPage && isAuthenticated,
  });

  if (isLoading && !isLoginPage && isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" id="hh" >
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
  }

  if (error && !isLoginPage && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Failed to Load Layout
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Unable to fetch the application layout configuration.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-background transition-colors"
      style={{
        fontFamily: layout?.theme?.font || "Inter, system-ui, sans-serif",
      }}
      id="subMain"
    >
      {isAuthenticated && layout && <Header header={layout.header} />}
      <main className={`flex-1 bg-[#E8E8E8] dark:bg-[#081028] ${isAuthenticated&& "py-3"}`}>
        {children}
      </main>
      {isAuthenticated && layout && <Footer footer={layout.footer} />}
    </div>
  );
}
