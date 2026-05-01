import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const updateBusLocation = async (
  busId: string,
  latitude: number,
  longitude: number
) => {
  const location = { latitude, longitude };

  await setDoc(
    doc(db, "locations", busId),
    {
      ...location,
      busId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await updateDoc(doc(db, "buses", busId), {
    currentLocation: location,
    status: "moving",
    updatedAt: serverTimestamp(),
  });
};
