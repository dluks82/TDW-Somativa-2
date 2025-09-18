import { useEffect, useState } from "react";
import { getUserProfile, type UserProfile } from "../services/firebase/auth";

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

    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const userProfile = await getUserProfile(uid);

        if (!cancelled) {
          setProfile(userProfile);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Não foi possível carregar os dados do usuário.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { profile, loading, error };
}
