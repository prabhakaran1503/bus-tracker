import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../../services/firebase";

type Bus = {
  id: string;
  name: string;
  number: string;
  routeId: string;
  status: string;
};

export default function BusList() {
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "buses"), (snapshot) => {
      setBuses(
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

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Buses</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.number}</Text>
            <Text>{item.name}</Text>
            <Text>Route: {item.routeId}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
  },
  name: { fontSize: 18, fontWeight: "bold" },
});
