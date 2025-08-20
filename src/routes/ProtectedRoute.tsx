// src/routes/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

type Role = "admin" | "manager" | "staff";
type ProtectedRouteProps = {
  children: ReactNode;
  /** Si absent -> juste authentification requise */
  allowed?: Role[];
  /** Où rediriger quand le rôle n’est pas autorisé */
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  allowed,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Chargement…</p>;

  // Pas connecté -> vers /login en gardant la destination
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Connecté mais rôle non autorisé
  if (allowed && (!role || !allowed.includes(role))) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
