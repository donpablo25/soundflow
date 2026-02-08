import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYbF7F1FiUEmza9CTWp39gzLUWXRSJNsM",
  authDomain: "projettest1-b35df.firebaseapp.com",
  projectId: "projettest1-b35df",
  storageBucket: "projettest1-b35df.firebasestorage.app",
  messagingSenderId: "884342503193",
  appId: "1:884342503193:web:502b71b16245aebe6cf788"
};


const app = initializeApp(firebaseConfig);

export const db =  getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
