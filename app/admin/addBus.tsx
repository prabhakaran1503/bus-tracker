import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddBus() {
  const [busName, setBusName] = useState<string>("");
  const [busNumber, setBusNumber] = useState<string>("");
  const [route, setRoute] = useState<string>("");

  const handleSaveBus = async () => {
    if (!busName || !busNumber || !route) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "buses"), {
        busName,
        busNumber,
        route,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Bus added successfully");

      setBusName("");
      setBusNumber("");
      setRoute("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Firebase error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Bus</Text>

      <TextInput
        placeholder="Bus Name"
        value={busName}
        onChangeText={setBusName}
        style={styles.input}
      />

      <TextInput
        placeholder="Bus Number"
        value={busNumber}
        onChangeText={setBusNumber}
        style={styles.input}
      />

      <TextInput
        placeholder="Route"
        value={route}
        onChangeText={setRoute}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveBus}>
        <Text style={styles.buttonText}>Save Bus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
  },
});