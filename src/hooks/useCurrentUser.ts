import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth } from "../services/firebase";

interface UseCurrentUserState {
  user: User | null;
  loading: boolean;
}

export function useCurrentUser(): UseCurrentUserState {
  const [user, setUser] = useState<User | null>(() => firebaseAuth.currentUser);
  const [loading, setLoading] = useState(() => firebaseAuth.currentUser == null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
