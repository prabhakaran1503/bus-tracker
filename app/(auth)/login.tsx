import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      const uid = userCred.user.uid;

      // GET ROLE FROM FIREBASE
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "admin") {
          router.replace("/admin");
        } else if (role === "driver") {
          router.replace("/driver");
        } else {
          router.replace("/user");
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1 }} />

      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "blue", padding: 15, marginTop: 20 }}>
        <Text style={{ color: "white" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}