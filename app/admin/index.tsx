import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { seedDemoData } from "../../services/tracking";

export default function Admin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin tools</Text>
      <Text style={styles.subtitle}>
        The full dashboard lives in ../admin-panel. Use this mobile shortcut for
        quick demo setup.
      </Text>
      <TouchableOpacity onPress={() => seedDemoData()} style={styles.button}>
        <Text style={styles.buttonText}>Seed demo bus and route</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/user/TrackerBus")} style={styles.secondary}>
        <Text style={styles.secondaryText}>View live map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8fafc", flex: 1, justifyContent: "center", padding: 24 },
  title: { color: "#0f172a", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "#475569", fontSize: 16, lineHeight: 24, marginBottom: 24, marginTop: 10 },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, padding: 16 },
  buttonText: { color: "#ffffff", fontWeight: "900" },
  secondary: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  secondaryText: { color: "#0f172a", fontWeight: "900" },
});
