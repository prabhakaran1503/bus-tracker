import * as Location from "expo-location";

export const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") return null;

  const location = await Location.getCurrentPositionAsync({});

  return location.coords;
};