import { 
  collection, 
  addDoc, 
  updateDoc,
  getDocs, 
  query, 
  where, 
  doc, 
  deleteDoc, 
  getDoc,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const SongsCol = collection(db, "Songs");
const UsersCol = collection(db, "users");

export async function CreateUsers(user) {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Utilisateur",
        email: user.email,
        photoURL: user.photoURL || "",
        role: "auditeur",
        createdAt: new Date()
      });
      console.log("Utilisateur créé dans Firestore");
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
  }
}

export async function ajouter(titleSong, coverFile, audioFile, artistName, authorId) {
  try {
    let coverUrl = "";
    let audioUrl = "";

    if (coverFile) {
      const coverRef = ref(storage, `Covers/${Date.now()}_${coverFile.name}`);
      await uploadBytes(coverRef, coverFile);
      coverUrl = await getDownloadURL(coverRef);
    }

    if (audioFile) {
      const audioRef = ref(storage, `Songs/${Date.now()}_${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      audioUrl = await getDownloadURL(audioRef);
    }

    return await addDoc(SongsCol, {
      titleSong,
      coverUrl,
      audioUrl, 
      artistName,
      authorId: authorId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    throw error;
  }
}

export const devenirArtiste = async (uid) => {
    const userRef = doc(db, "users", uid);
    return await updateDoc(userRef, {
        role: "artiste"
    });
};

export async function avoirSongsbyArtist(userId) { 
  try {
    const q = query(SongsCol, where("authorId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des chansons:", error);
    throw error;
  }
}

export async function getAllArtist() {
  try {
    const q = query(UsersCol, where("role", "==", "artiste"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return [];
  }
}

export async function avoirArticle() {
  const snapshot = await getDocs(SongsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getSongById(id) {
  const docRef = doc(db, "Songs", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateSong(id, updates) {
  const docRef = doc(db, "Songs", id);
  return await updateDoc(docRef, updates);
}

export async function deleteSong(id) {
  const docRef = doc(db, "Songs", id);
  return await deleteDoc(docRef);
}