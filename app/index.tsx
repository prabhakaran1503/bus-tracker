import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>Smart Bus Tracker</Text>
        <Text style={styles.title}>Live buses, routes, and arrivals.</Text>
        <Text style={styles.subtitle}>
          Track buses in real time with Firebase updates and OpenStreetMap
          tiles, no paid map API required.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={[styles.button, styles.primary]}
        >
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={[styles.button, styles.secondary]}
        >
          <Text style={styles.secondaryText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/user/TrackerBus")}
          style={[styles.button, styles.ghost]}
        >
          <Text style={styles.secondaryText}>Explore demo map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 90,
    backgroundColor: "#f8fafc",
  },
  kicker: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 48,
  },
  subtitle: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
  actions: {
    gap: 12,
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
  },
  primary: {
    backgroundColor: "#0f766e",
  },
  secondary: {
    backgroundColor: "#e0f2fe",
  },
  ghost: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
});
