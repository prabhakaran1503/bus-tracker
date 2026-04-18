import { View, Text } from "react-native";

export default function ETABox({ time }: any) {
  return (
    <View
      style={{
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8
      }}
    >
      <Text>Bus arriving in {time} min</Text>
    </View>
  );
}