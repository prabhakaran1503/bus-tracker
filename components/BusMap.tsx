import { Platform, View, Text } from "react-native";

let MapView: any;
let Marker: any;
let Polyline: any;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
}

import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { BUS_STOPS } from "../data/stops";

export default function BusMap() {
  const [bus, setBus] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "bus", "bus1"), (snap) => {
      const data = snap.data();
      if (data) setBus(data);
    });

    return () => unsub();
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={{ flex:1,justifyContent:"center",alignItems:"center" }}>
        <Text>Map works on mobile only</Text>
      </View>
    );
  }

  if (!bus) return null;

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        latitude: bus.latitude,
        longitude: bus.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }}
    >
      <Marker coordinate={bus} title="Bus" />

      {BUS_STOPS.map((stop:any) => (
        <Marker key={stop.id} coordinate={stop} title={stop.name} />
      ))}

      <Polyline coordinates={BUS_STOPS} strokeWidth={4} />
    </MapView>
  );
}