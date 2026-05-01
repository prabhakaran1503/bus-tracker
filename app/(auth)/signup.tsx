import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // SAVE ROLE IN FIREBASE
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role,
      });

      Alert.alert("Success", "Account created");
      router.push("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input} />

      {/* ROLE SELECT */}
      <Text style={{ marginTop: 10 }}>Select Role:</Text>

      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <TouchableOpacity onPress={() => setRole("user")} style={styles.roleBtn}>
          <Text>User</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRole("driver")} style={styles.roleBtn}>
          <Text>Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRole("admin")} style={styles.roleBtn}>
          <Text>Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={{ color: "white" }}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },

  button: { backgroundColor: "green", padding: 15, alignItems: "center" },

  roleBtn: {
    padding: 10,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});