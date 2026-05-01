import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", credential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: credential.user.email,
          role: "user",
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        router.replace("/user/TrackerBus");
        return;
      }

      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      const role = userSnap.data().role;
      router.replace(role === "driver" ? "/driver" : "/user/TrackerBus");
    } catch {
      Alert.alert("Login failed", "Check your Firebase setup and credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in as a user or driver.</Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      <TouchableOpacity disabled={loading} onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  title: { color: "#0f172a", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "#64748b", fontSize: 16, marginBottom: 24, marginTop: 8 },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    marginBottom: 12,
    padding: 14,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    marginTop: 8,
    padding: 16,
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  link: { color: "#0f766e", fontSize: 15, fontWeight: "800", marginTop: 18, textAlign: "center" },
});
