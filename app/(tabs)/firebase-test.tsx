import { View, Text } from "react-native";
import { auth } from "../../services/firebase";

export default function Test() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Firebase Connected ✔</Text>
      <Text>
        {auth.currentUser ? auth.currentUser.email : "No user logged in"}
      </Text>
    </View>
  );
}