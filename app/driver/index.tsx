import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase";
import { type Bus, getAssignedBuses, seedDemoData, startDriverTrip } from "../../services/tracking";

type ActiveTrip = {
  tripId: string;
  stop: () => Promise<void>;
};

export default function Driver() {
  const activeTrip = useRef<ActiveTrip | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const id = user?.uid ?? "demo-driver";
      setDriverId(id);
      const assigned = await getAssignedBuses(id);
      const list = assigned.length ? assigned : [];
      setBuses(list);
      setSelectedBus(list[0] ?? null);
    });
    return unsubscribe;
  }, []);

  const startTrip = async () => {
    if (!driverId) return;
    if (!selectedBus) {
      Alert.alert("No bus selected", "Ask admin to assign a bus or seed demo data.");
      return;
    }

    setLoading(true);
    try {
      activeTrip.current = await startDriverTrip(selectedBus, driverId);
      setStatus(`Sharing GPS for ${selectedBus.number}`);
    } catch (error) {
      Alert.alert("Unable to start trip", error instanceof Error ? error.message : "Try again.");
      setStatus("Location permission needed");
    } finally {
      setLoading(false);
    }
  };

  const stopTrip = async () => {
    setLoading(true);
    try {
      await activeTrip.current?.stop();
      activeTrip.current = null;
      setStatus("Stopped");
    } finally {
      setLoading(false);
    }
  };

  const seedAndRefresh = async () => {
    await seedDemoData();
    setStatus("Demo bus created. Assign it to this driver in admin.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Console</Text>
      <Text style={styles.subtitle}>{status}</Text>

      <Text style={styles.sectionTitle}>Assigned buses</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedBus(item)}
            style={[styles.busCard, selectedBus?.id === item.id && styles.busCardActive]}
          >
            <Text style={styles.busNumber}>{item.number}</Text>
            <Text style={styles.busName}>{item.name}</Text>
            <Text style={styles.busRoute}>Route: {item.routeId}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <TouchableOpacity onPress={seedAndRefresh} style={styles.emptyCard}>
            <Text style={styles.emptyText}>No assigned buses. Tap to create demo data.</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.actions}>
        <TouchableOpacity
          disabled={loading || !!activeTrip.current}
          onPress={startTrip}
          style={[styles.button, styles.startButton]}
        >
          <Text style={styles.buttonText}>{loading ? "Starting..." : "Start trip"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading || !activeTrip.current}
          onPress={stopTrip}
          style={[styles.button, styles.stopButton]}
        >
          <Text style={styles.buttonText}>Stop trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8fafc", flex: 1, padding: 20, paddingTop: 64 },
  title: { color: "#0f172a", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "#0f766e", fontSize: 16, fontWeight: "800", marginBottom: 28, marginTop: 8 },
  sectionTitle: { color: "#475569", fontSize: 13, fontWeight: "900", marginBottom: 10, textTransform: "uppercase" },
  busCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  busCardActive: { borderColor: "#0f766e", borderWidth: 2 },
  busNumber: { color: "#0f172a", fontSize: 20, fontWeight: "900" },
  busName: { color: "#475569", fontSize: 15, marginTop: 4 },
  busRoute: { color: "#64748b", fontSize: 13, marginTop: 8 },
  emptyCard: { backgroundColor: "#ecfeff", borderRadius: 8, padding: 16 },
  emptyText: { color: "#0f766e", fontWeight: "800" },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  button: { alignItems: "center", borderRadius: 8, flex: 1, padding: 16 },
  startButton: { backgroundColor: "#0f766e" },
  stopButton: { backgroundColor: "#dc2626" },
  buttonText: { color: "#ffffff", fontWeight: "900" },
});
