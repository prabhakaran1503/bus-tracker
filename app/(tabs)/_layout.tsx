import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="user" options={{ title: "User" }} />
      <Tabs.Screen name="driver" options={{ title: "Driver" }} />
    </Tabs>
  );
}