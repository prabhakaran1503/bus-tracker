import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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

type Role = "user" | "driver";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || password.length < 6) {
      Alert.alert("Missing details", "Use an email and a password with 6+ characters.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, role === "driver" ? "drivers" : "users", credential.user.uid), {
        email,
        role,
        status: "active",
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", credential.user.uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      });
      router.replace(role === "driver" ? "/driver" : "/user/TrackerBus");
    } catch {
      Alert.alert("Signup failed", "Check Firebase Authentication settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <View style={styles.segment}>
        {(["user", "driver"] as Role[]).map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setRole(item)}
            style={[styles.segmentButton, role === item && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, role === item && styles.segmentTextActive]}>
              {item === "user" ? "User" : "Driver"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      <TouchableOpacity disabled={loading} onPress={signup} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create account"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  title: { color: "#0f172a", fontSize: 34, fontWeight: "900", marginBottom: 22 },
  segment: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    padding: 4,
  },
  segmentButton: { alignItems: "center", borderRadius: 6, flex: 1, padding: 12 },
  segmentActive: { backgroundColor: "#ffffff" },
  segmentText: { color: "#475569", fontWeight: "800" },
  segmentTextActive: { color: "#0f766e" },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    marginBottom: 12,
    padding: 14,
  },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, marginTop: 8, padding: 16 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
});
