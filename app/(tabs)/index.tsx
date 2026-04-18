import { View, Text } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text style={{ fontSize: 22 }}>🚍 Bus Tracker</Text>
      <Text>Select User or Driver tab</Text>
    </View>
  );
}