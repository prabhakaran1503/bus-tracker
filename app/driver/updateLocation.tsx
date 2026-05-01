import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function DriverLocation() {
  const [busId, setBusId] = useState("bus1");

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      async (position) => {
        const { latitude, longitude } = position.coords;

        const busRef = doc(db, "buses", busId);

        await updateDoc(busRef, {
          latitude,
          longitude,
          updatedAt: new Date(),
        });

        console.log(busId, latitude, longitude);
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Selected Bus: {busId}
      </Text>

      <TouchableOpacity
        onPress={() => setBusId("bus1")}
        style={{ padding: 10, backgroundColor: "gray", marginBottom: 5 }}
      >
        <Text>Bus 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setBusId("bus2")}
        style={{ padding: 10, backgroundColor: "gray", marginBottom: 20 }}
      >
        <Text>Bus 2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={startTracking}
        style={{ backgroundColor: "green", padding: 15 }}
      >
        <Text style={{ color: "white" }}>Start Tracking</Text>
      </TouchableOpacity>

    </View>
  );
}