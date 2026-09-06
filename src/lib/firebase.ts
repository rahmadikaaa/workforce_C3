import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "teak-proton-470603-c0",
  appId: "1:620658281668:web:2d5841075c98ef6ecbcd91",
  apiKey: "AIzaSyA2t-WJPo-kZ9M1a5Dv1On4th88JCQaBbU",
  authDomain: "teak-proton-470603-c0.firebaseapp.com",
  storageBucket: "teak-proton-470603-c0.firebasestorage.app",
  messagingSenderId: "620658281668"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-reflectai-8c3de6ec-9f49-4b43-b4b3-805c39828427");
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
