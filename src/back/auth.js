import { auth, db } from "./firebase"; 
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
import { doc, getDoc, setDoc, collection, where, query, getDocs  } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();


export const isUsernameTaken = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail(email, password, name, role = "auditeur") {
  try {

    const taken = await isUsernameTaken(name);
    if (taken) {
      throw { code: "auth/username-already-in-use" }; 
    }

    const defaultPfpURL = "https://firebasestorage.googleapis.com/v0/b/projettest1-b35df.firebasestorage.app/o/avatars%2Fj2wBnzuMWHcOU4tnzG568QmsIjc2_nopfp.png?alt=media&token=6f9d9448-d0a5-4daf-b7a7-c26550989ccd"

    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
      photoURL: defaultPfpURL
    });

    await CreateUsers({
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: defaultPfpURL,
      role: role
    });

    return userCredential;
  } catch (error) {
    console.error("Erreur dans registerWithEmail:", error);

    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error("Cet e-mail est déjà utilisé par un autre compte.");
      case 'auth/invalid-email':
        throw new Error("L'adresse e-mail n'est pas valide.");
      case 'auth/weak-password':
        throw new Error("Le mot de passe est trop court (minimum 6 caractères).");
      case 'auth/network-request-failed':
        throw new Error("Problème de connexion réseau. Veuillez réessayer.");
      default:
        throw new Error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    }
  }
}

export const updateUserProfile = async (user, { username, currentPhotoURL, bio }) => {
  try {

  if (username !== user.displayName) {
      const taken = await isUsernameTaken(username); 
      if (taken) {
        throw { code: "auth/username-already-in-use" }; 
      }
    }

    let finalPhotoURL = currentPhotoURL;
 

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { 
      bio: bio,
      displayName: username, 
      photoURL: finalPhotoURL
    }, { merge: true });

    return finalPhotoURL; 
  } catch (error) {
    console.error("Erreur dans updateUserProfile:", error);
    throw error;
  }
};

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await CreateUsers({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "auditeur" 
      });
    }

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
