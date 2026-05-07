import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS LINE

const firebaseConfig = {
  // YOUR EXISTING CONFIG HERE
  apiKey: "AIzaSyDEoZmdN2LLdFakGJNVVFZNmAAALDfLK-w",
  authDomain: "campuscart-7be63.firebaseapp.com",
  projectId: "campuscart-7be63",
  storageBucket: "campuscart-7be63.firebasestorage.app",
  messagingSenderId: "782968283933",
  appId: "1:782968283933:web:f9b2eecb859b2f8d7837f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ ADD THIS LINE