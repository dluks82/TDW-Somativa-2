import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "./index";

interface RegisterUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface RegisterUserResult {
  uid: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResult {
  uid: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  displayName: string;
}

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
  birthDate,
}: RegisterUserInput): Promise<RegisterUserResult> {
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const { user } = userCredential;
  const uid = user.uid;

  const displayName = `${firstName} ${lastName}`.trim();

  if (displayName.length > 1) {
    await updateProfile(user, { displayName });
  }

  const userDocRef = doc(firebaseDb, "users", uid);

  await setDoc(userDocRef, {
    uid,
    email,
    firstName,
    lastName,
    birthDate,
    displayName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { uid };
}

export async function loginUser({ email, password }: LoginUserInput): Promise<LoginUserResult> {
  const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);

  return { uid: user.uid };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(firebaseDb, "users", uid);
  const snapshot = await getDoc(userDocRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}
