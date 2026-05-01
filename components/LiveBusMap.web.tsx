import { StyleSheet, Text, View } from "react-native";
import type { Bus, BusRoute, LatLng } from "../services/tracking";

type Props = {
  activeLocation: LatLng | null;
  bus: Bus | null;
  route: BusRoute | null;
  userLocation: LatLng | null;
};

export default function LiveBusMap({ activeLocation, bus, route, userLocation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web map is in the admin panel</Text>
      <Text style={styles.text}>
        Mobile uses the native OpenStreetMap view. On web, use the React admin
        dashboard at http://127.0.0.1:5173 for Leaflet live tracking.
      </Text>
      <Text style={styles.meta}>Bus: {bus?.number ?? "--"}</Text>
      <Text style={styles.meta}>Route: {route?.name ?? "--"}</Text>
      <Text style={styles.meta}>
        Location: {activeLocation ? `${activeLocation.latitude}, ${activeLocation.longitude}` : "--"}
      </Text>
      <Text style={styles.meta}>
        User: {userLocation ? `${userLocation.latitude}, ${userLocation.longitude}` : "--"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#020617",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "900", textAlign: "center" },
  text: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    marginTop: 12,
    maxWidth: 560,
    textAlign: "center",
  },
  meta: { color: "#94a3b8", fontWeight: "800", marginTop: 6 },
});
