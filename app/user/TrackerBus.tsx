import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getDistance } from "geolib";
import LiveBusMap from "../../components/LiveBusMap";
import {
  type Bus,
  type BusRoute,
  type LatLng,
  seedDemoData,
  subscribeBus,
  subscribeBusLocation,
  subscribeBuses,
  subscribeRoute,
} from "../../services/tracking";

export default function TrackBus() {
  const fade = useRef(new Animated.Value(0)).current;
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [busLocation, setBusLocation] = useState<LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [query, setQuery] = useState("");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeBuses((items) => {
      setBuses(items);
      if (!selectedBusId && items[0]) {
        setSelectedBusId(items[0].id);
      }
    });

    seedDemoData().catch(() => undefined);
    return unsubscribe;
  }, [selectedBusId]);

  useEffect(() => {
    if (!selectedBusId) return;

    const unsubscribeBus = subscribeBus(selectedBusId, (bus) => {
      setSelectedBus(bus);
      setOffline(false);
    });
    const unsubscribeLocation = subscribeBusLocation(selectedBusId, (location) => {
      setBusLocation(location);
      Animated.sequence([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    });

    return () => {
      unsubscribeBus();
      unsubscribeLocation();
    };
  }, [fade, selectedBusId]);

  useEffect(() => {
    const unsubscribe = subscribeRoute(selectedBus?.routeId, setRoute);
    return unsubscribe;
  }, [selectedBus?.routeId]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") return;
        return Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 8000, distanceInterval: 10 },
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        );
      })
      .then((watcher) => {
        subscription = watcher;
      })
      .catch(() => setOffline(true));

    return () => subscription?.remove();
  }, []);

  const activeLocation = busLocation ?? selectedBus?.currentLocation ?? null;

  const filteredBuses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return buses;
    return buses.filter((bus) =>
      `${bus.name} ${bus.number}`.toLowerCase().includes(normalized)
    );
  }, [buses, query]);

  const eta = useMemo(() => {
    if (!activeLocation || !userLocation) return null;
    const meters = getDistance(userLocation, activeLocation);
    const minutes = Math.max(1, Math.round(meters / 350));
    return { meters, minutes };
  }, [activeLocation, userLocation]);

  return (
    <View style={styles.container}>
      <LiveBusMap
        activeLocation={activeLocation}
        bus={selectedBus}
        route={route}
        userLocation={userLocation}
      />

      <Animated.View style={[styles.pulse, { opacity: fade }]} pointerEvents="none">
        <Text style={styles.pulseText}>Live update received</Text>
      </Animated.View>

      <View style={styles.panel}>
        <TextInput
          placeholder="Search bus number or name"
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />
        <FlatList
          data={filteredBuses}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedBusId(item.id)}
              style={[styles.busCard, selectedBusId === item.id && styles.busCardActive]}
            >
              <Text style={styles.busNumber}>{item.number}</Text>
              <Text style={styles.busName}>{item.name}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <TouchableOpacity onPress={() => seedDemoData().catch(() => Alert.alert("Firebase unavailable"))}>
              <Text style={styles.empty}>No buses yet. Tap to seed demo data.</Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.metrics}>
          <View>
            <Text style={styles.metricLabel}>Route</Text>
            <Text style={styles.metricValue}>{route?.name ?? "Not assigned"}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>ETA</Text>
            <Text style={styles.metricValue}>{eta ? `${eta.minutes} min` : "--"}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{eta ? `${(eta.meters / 1000).toFixed(1)} km` : "--"}</Text>
          </View>
        </View>

        {offline ? <Text style={styles.offline}>Showing last known data while offline.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#020617", flex: 1 },
  pulse: {
    alignSelf: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    top: 54,
  },
  pulseText: { color: "#ffffff", fontSize: 12, fontWeight: "800" },
  panel: {
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    bottom: 0,
    gap: 12,
    left: 0,
    padding: 14,
    position: "absolute",
    right: 0,
  },
  search: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    padding: 12,
  },
  busCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 150,
    padding: 12,
  },
  busCardActive: { borderColor: "#0f766e", borderWidth: 2 },
  busNumber: { color: "#0f172a", fontSize: 16, fontWeight: "900" },
  busName: { color: "#475569", marginTop: 4 },
  status: { color: "#0f766e", fontSize: 12, fontWeight: "800", marginTop: 8, textTransform: "uppercase" },
  empty: { color: "#0f766e", fontWeight: "800", padding: 12 },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricLabel: { color: "#64748b", fontSize: 12, fontWeight: "700" },
  metricValue: { color: "#0f172a", fontSize: 16, fontWeight: "900", marginTop: 4 },
  offline: { color: "#b45309", fontWeight: "700" },
});
