import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { type UserProfile } from "../services/firebase/auth";
import { firebaseDb } from "../services/firebase";

interface UseUserProfileParams {
  uid: string | null;
}

interface UseUserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile({ uid }: UseUserProfileParams): UseUserProfileState {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(uid != null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userDocRef = doc(firebaseDb, "users", uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
        setLoading(false);
      },
      () => {
        setError("Não foi possível carregar os dados do usuário.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [uid]);

  return { profile, loading, error };
}
