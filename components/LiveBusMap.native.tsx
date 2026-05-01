import { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { Platform, StyleSheet } from "react-native";
import type { Bus, BusRoute, LatLng } from "../services/tracking";

type Props = {
  activeLocation: LatLng | null;
  bus: Bus | null;
  route: BusRoute | null;
  userLocation: LatLng | null;
};

const DEFAULT_REGION = {
  latitude: 11.1271,
  longitude: 78.6569,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function LiveBusMap({ activeLocation, bus, route, userLocation }: Props) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!activeLocation) return;
    mapRef.current?.animateToRegion(
      { ...activeLocation, latitudeDelta: 0.035, longitudeDelta: 0.035 },
      600
    );
  }, [activeLocation]);

  return (
    <MapView
      ref={mapRef}
      initialRegion={
        activeLocation
          ? { ...activeLocation, latitudeDelta: 0.035, longitudeDelta: 0.035 }
          : DEFAULT_REGION
      }
      mapType={Platform.OS === "android" ? "none" : "standard"}
      style={styles.map}
    >
      <UrlTile
        maximumZ={19}
        tileSize={256}
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {route?.path?.length ? (
        <Polyline
          coordinates={route.path}
          strokeColor={route.color ?? "#2563eb"}
          strokeWidth={5}
        />
      ) : null}

      {route?.stops?.map((stop) => (
        <Marker
          coordinate={stop}
          description={`Stop ${stop.order}`}
          key={stop.id}
          title={stop.name}
        />
      ))}

      {activeLocation ? (
        <Marker coordinate={activeLocation} pinColor="#ef4444" title={bus?.name ?? "Bus"} />
      ) : null}

      {userLocation ? <Marker coordinate={userLocation} pinColor="#2563eb" title="You" /> : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
