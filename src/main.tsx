import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import CalendarPage from "./pages/Calendar";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/index.ts"; // ✅ ton thème perso

const router = createBrowserRouter([
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
        <CalendarPage />
      </Layout>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
