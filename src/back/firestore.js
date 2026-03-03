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
  setDoc,
  orderBy 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


import { 
  db, 
  storage,
  auth
} from "./firebase";

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
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
  }
}

export const devenirArtiste = async (uid) => {
    const userRef = doc(db, "users", uid);
    return await updateDoc(userRef, {
        role: "artiste"
    });
};

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
      isLiked: false, 
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    throw error;
  }
}

export async function toggleLike(songId, isCurrentlyLiked) {
  const user = auth.currentUser;
  if (!user) throw new Error("Vous devez être connecté pour liker.");

  const likeDocId = `${user.uid}_${songId}`;
  const likeRef = doc(db, "userLikes", likeDocId);

  try {
    if (isCurrentlyLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {
        userId: user.uid,
        songId: songId,
        createdAt: new Date()
      });
    }
  } catch (error) {
    console.error("Erreur lors du toggle like:", error);
    throw error;
  }
}
export async function avoirSongsbyArtist(userId) { 
  try {
    const q = query(SongsCol, where("authorId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur récupération chansons artiste:", error);
    throw error;
  }
}

export async function avoirArticle() {
  try {
    const user = auth.currentUser;

    const q = query(SongsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const allSongs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (!user) {
      return allSongs.map(s => ({ ...s, isLiked: false }));
    }

    const likesQuery = query(collection(db, "userLikes"), where("userId", "==", user.uid));
    const likesSnapshot = await getDocs(likesQuery);
    const likedSongIds = new Set(likesSnapshot.docs.map(doc => doc.data().songId));

    return allSongs.map(song => ({
      ...song,
      isLiked: likedSongIds.has(song.id)
    }));
  } catch (error) {
    console.error("Erreur récupération articles:", error);
    return [];
  }
}

export async function getSongById(id) {
  try {
    const docRef = doc(db, "Songs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Erreur récupération chanson:", error);
    throw error;
  }
}

export async function updateSong(id, updates) {
  try {
    const docRef = doc(db, "Songs", id);
    let finalUpdates = { titleSong: updates.titleSong };

    if (updates.coverFile) {
      const fileExtension = updates.coverFile.name.split('.').pop();
      const storageRef = ref(storage, `Covers/${id}_${Date.now()}.${fileExtension}`);
      
      const snapshot = await uploadBytes(storageRef, updates.coverFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      finalUpdates.coverUrl = downloadURL;
    }

    return await updateDoc(docRef, finalUpdates);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la chanson:", error);
    throw error;
  }
}
export async function deleteSong(id) {
  const docRef = doc(db, "Songs", id);
  return await deleteDoc(docRef);
}