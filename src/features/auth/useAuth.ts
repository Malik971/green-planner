// src/features/auth/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import type { User } from "firebase/auth"; // ✅ version typée
import { auth } from "../../services/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Observer : dès que le user change (connexion / déconnexion)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (err) {
          console.error("Erreur auth anonyme :", err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}
