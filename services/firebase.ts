import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// ✅ YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAGsgLw2bHvY2F3ZPwNzeJIq3uN7MjTtbM",
  authDomain: "smartbustracker-63aab.firebaseapp.com",
  projectId: "smartbustracker-63aab",
  storageBucket: "smartbustracker-63aab.firebasestorage.app",
  messagingSenderId: "813475567306",
  appId: "1:813475567306:web:1b0d916c888328dc7f8633",
  measurementId: "G-WQT4QG80TG"
};


// ✅ SAFE INIT (IMPORTANT FIX)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ AUTH SAFE INIT (NO DOUBLE INIT ERROR)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);