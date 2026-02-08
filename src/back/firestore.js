import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const SongsCol = collection(db, "Songs");

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

export async function avoirArticle() {
  const snapshot = await getDocs(SongsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateArticle(id, updates) {
  const docRef = doc(db, "Songs", id);
  return await updateDoc(docRef, updates);
}

export async function deleteArticle(id) {
  const docRef = doc(db, "Songs", id);
  return await deleteDoc(docRef);
}


