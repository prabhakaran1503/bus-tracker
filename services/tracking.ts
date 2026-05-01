import * as Location from "expo-location";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Bus = {
  id: string;
  name: string;
  number: string;
  routeId: string;
  driverId?: string;
  activeTripId?: string | null;
  status: "idle" | "moving" | "stopped" | "offline";
  currentLocation?: LatLng;
  updatedAt?: unknown;
};

export type RouteStop = LatLng & {
  id: string;
  name: string;
  order: number;
};

export type BusRoute = {
  id: string;
  name: string;
  color: string;
  stops: RouteStop[];
  path: LatLng[];
};

export function subscribeBuses(callback: (buses: Bus[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "buses"), (snapshot) => {
    callback(
      snapshot.docs.map((item) => {
        const data = item.data() as Omit<Bus, "id">;
        return {
          id: item.id,
          ...data,
          status: data.status ?? "offline",
        };
      })
    );
  });
}

export function subscribeBus(
  busId: string,
  callback: (bus: Bus | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, "buses", busId), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    const data = snapshot.data() as Omit<Bus, "id">;
    callback({
      id: snapshot.id,
      ...data,
      status: data.status ?? "offline",
    });
  });
}

export function subscribeBusLocation(
  busId: string,
  callback: (location: LatLng | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, "locations", busId), (snapshot) => {
    const data = snapshot.data();
    callback(
      data
        ? ({ latitude: data.latitude, longitude: data.longitude } as LatLng)
        : null
    );
  });
}

export function subscribeRoute(
  routeId: string | undefined,
  callback: (route: BusRoute | null) => void
): Unsubscribe {
  if (!routeId) {
    callback(null);
    return () => undefined;
  }

  return onSnapshot(doc(db, "routes", routeId), (snapshot) => {
    callback(
      snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as BusRoute)
        : null
    );
  });
}

export async function getAssignedBuses(driverId: string): Promise<Bus[]> {
  const assignedQuery = query(
    collection(db, "buses"),
    where("driverId", "==", driverId)
  );
  const snapshot = await getDocs(assignedQuery);
  return snapshot.docs.map((item) => {
    const data = item.data() as Omit<Bus, "id">;
    return {
      id: item.id,
      ...data,
      status: data.status ?? "offline",
    };
  });
}

export async function startDriverTrip(bus: Bus, driverId: string) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission is required to share live bus GPS.");
  }

  const trip = await addDoc(collection(db, "trips"), {
    busId: bus.id,
    driverId,
    routeId: bus.routeId,
    status: "active",
    startedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "buses", bus.id), {
    status: "moving",
    activeTripId: trip.id,
    updatedAt: serverTimestamp(),
  });

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 4000,
      distanceInterval: 5,
    },
    async (position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      await setDoc(
        doc(db, "locations", bus.id),
        {
          ...location,
          heading: position.coords.heading,
          speed: position.coords.speed,
          busId: bus.id,
          driverId,
          tripId: trip.id,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(doc(db, "buses", bus.id), {
        currentLocation: location,
        status: position.coords.speed === 0 ? "stopped" : "moving",
        updatedAt: serverTimestamp(),
      });
    }
  );

  return {
    tripId: trip.id,
    stop: async () => {
      subscription.remove();
      await setDoc(
        doc(db, "trips", trip.id),
        { status: "completed", endedAt: serverTimestamp() },
        { merge: true }
      );
      await updateDoc(doc(db, "buses", bus.id), {
        status: "stopped",
        activeTripId: null,
        updatedAt: serverTimestamp(),
      });
    },
  };
}

export async function seedDemoData() {
  const route: BusRoute = {
    id: "route-central",
    name: "Central Loop",
    color: "#2563eb",
    stops: [
      {
        id: "stop-1",
        name: "Central Depot",
        order: 1,
        latitude: 11.1271,
        longitude: 78.6569,
      },
      {
        id: "stop-2",
        name: "Market Road",
        order: 2,
        latitude: 11.132,
        longitude: 78.6622,
      },
      {
        id: "stop-3",
        name: "College Gate",
        order: 3,
        latitude: 11.139,
        longitude: 78.669,
      },
    ],
    path: [
      { latitude: 11.1271, longitude: 78.6569 },
      { latitude: 11.132, longitude: 78.6622 },
      { latitude: 11.139, longitude: 78.669 },
    ],
  };

  await setDoc(doc(db, "routes", route.id), route, { merge: true });
  await setDoc(
    doc(db, "buses", "bus-101"),
    {
      name: "City Express",
      number: "TN-45-101",
      routeId: route.id,
      status: "offline",
      currentLocation: route.path[0],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
