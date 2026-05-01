import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
// The Firebase package exposes this from its React Native build at runtime.
// TypeScript resolves the web declaration file, so this import needs a local shim.
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
  apiKey: "AIzaSyAGsgLw2bHvY2F3ZPwNzeJIq3uN7MjTtbM",
  authDomain: "smartbustracker-63aab.firebaseapp.com",
  projectId: "smartbustracker-63aab",
  storageBucket: "smartbustracker-63aab.appspot.com", // ✅ FIXED (important)
  messagingSenderId: "813475567306",
  appId: "1:813475567306:web:1b0d916c888328dc7f8633"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
