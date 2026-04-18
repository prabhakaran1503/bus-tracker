import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      Alert.alert("Enter email & password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  const signupUser = async () => {
    if (!email || !password) {
      Alert.alert("Enter email & password");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20
      }}
    >
      <Text style={{ fontSize: 24 }}>Bus Tracker Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginTop: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          marginTop: 10,
          padding: 10
        }}
      />

      <TouchableOpacity
        onPress={loginUser}
        style={{
          backgroundColor: "blue",
          padding: 15,
          marginTop: 20
        }}
      >
        <Text style={{ color: "white" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signupUser}
        style={{
          backgroundColor: "green",
          padding: 15,
          marginTop: 10
        }}
      >
        <Text style={{ color: "white" }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}