import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Map from "@/pages/map";
import NotFound from "@/pages/not-found";
import { ReactNode } from "react";

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {!isAuthenticated ? <Login /> : <Redirect to="/" />}
      </Route>

      <Route path="/">
        {isAuthenticated ? (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/map">
        {isAuthenticated ? (
          <AppLayout>
            <Map />
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/analytics">
        {isAuthenticated ? (
          <AppLayout>
            <div className="flex items-center justify-center h-full">
              <h1 className="text-2xl text-gray-600">Analytics coming soon...</h1>
            </div>
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}