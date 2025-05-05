import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/project";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

// Root layout with navbar that will wrap all routes
const RootLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

// Define the router with the new object-based configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "signup",
        element: <SignupPage />
      },
      {
        path: "projects",
        element: <ProjectsPage />
      },
      {
        path: "project/:projectId",
        element: <ProjectDetailPage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
