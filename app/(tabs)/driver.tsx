import { View, Text } from "react-native";
import { useEffect } from "react";

import * as Location from "expo-location";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function Driver() {
  useEffect(() => {
    start();
  }, []);

  const start = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      async (loc) => {
        const { latitude, longitude } = loc.coords;

        await setDoc(doc(db, "bus", "bus1"), {
          latitude,
          longitude,
          time: Date.now()
        });
      }
    );
  };

  return (
    <View>
      <Text>Driver sending GPS...</Text>
    </View>
  );
}