import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import React from "react";

type Role = "admin" | "manager" | "staff" | null;

type AuthState = {
  user: User | null;
  role: Role;
  team: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutApp: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observe la session Firebase
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setRole(null);
      setTeam(null);

      if (!fbUser) {
        setLoading(false);
        return;
      }

      // Observe le doc users/{uid} pour récupérer role/team en temps réel
      const userRef = doc(db, "users", fbUser.uid);
      const unsubUser = onSnapshot(userRef, (snap) => {
        const data = snap.data();
        setRole((data?.role as Role) ?? null);
        setTeam((data?.team as string) ?? null);
        setLoading(false);
      }, () => setLoading(false));

      // nettoie quand l’auth change
      return () => unsubUser();
    });

    return () => unsubAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutApp = async () => {
    await signOut(auth);
  };

  const value: AuthState = { user, role, team, loading, signIn, signOutApp };
  return React.createElement(AuthCtx.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
