import { auth, db } from "./firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail(email, password, name, role="auditeur") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email.trim(),
      role: role,
      avatarUrl: "",
      createdAt: Date.now()
    });

    return userCredential;
  } catch (error) {
    console.error("Erreur dans registerWithEmail:", error);
    throw error;
  }
}

const googleProvider = new GoogleAuthProvider()

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logout() {
  return signOut(auth);
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function fetchUserRole(user) {
  if (!user) return "unknown";
  
  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data().role;
  } else {
    return "auditeur";
  }
}