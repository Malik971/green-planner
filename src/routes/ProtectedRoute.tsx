import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";
import { useAuth } from "../features/auth/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center py={20}>
        <Spinner />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  return <>{children}</>;
}
