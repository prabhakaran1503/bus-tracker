// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAGsgLw2bHvY2F3ZPwNzeJIq3uN7MjTtbM",
  authDomain: "smartbustracker-63aab.firebaseapp.com",
  projectId: "smartbustracker-63aab",
  storageBucket: "smartbustracker-63aab.appspot.com", // ✅ FIXED (important)
  messagingSenderId: "813475567306",
  appId: "1:813475567306:web:1b0d916c888328dc7f8633"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
