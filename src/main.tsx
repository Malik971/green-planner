import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import CalendarPage from "./pages/Calendar";
import PlanningBar from "./pages/PlanningBar";
import LoginPage from "./pages/Login";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/index.ts";
import { AuthProvider } from "./features/auth/useAuth.ts";
import ProtectedRoute from "./routes/ProtectedRoute";
import PlanningAnimation from "./pages/PlanningAnimation";


const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/calendar/:team",
    element: (
      <Layout>
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/calendar/bar",
    element: (
      <Layout>
        <ProtectedRoute allowed={["admin", "manager"]}>
          <PlanningBar />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
  path: "/animations",
  element: (
    <Layout>
      <ProtectedRoute>
        <PlanningAnimation />
      </ProtectedRoute>
    </Layout>
  ),
},
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
