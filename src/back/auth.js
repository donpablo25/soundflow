import { auth, db, storage } from "./firebase";
import { CreateUsers } from "./firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const googleProvider = new GoogleAuthProvider();

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail(email, password, name, role = "auditeur") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name
    });

    await CreateUsers({
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: "",
      role: role
    });

    return userCredential;
  } catch (error) {
    console.error("Erreur dans registerWithEmail:", error);
    throw error;
  }
}

export const updateUserProfile = async (user, { username, photoFile, currentPhotoURL, bio }) => {
  try {
    let finalPhotoURL = currentPhotoURL;

    if (photoFile) {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, photoFile);
      finalPhotoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, {
      displayName: username,
      photoURL: finalPhotoURL
    });

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { 
      bio: bio,
      displayName: username, 
      photoURL: finalPhotoURL
    }, { merge: true });

  } catch (error) {
    console.error("Erreur dans updateUserProfile:", error);
    throw error;
  }
};

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await CreateUsers(result.user);
    return result;
  } catch (error) {
    console.error("Erreur Google Login:", error);
    throw error;
  }
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