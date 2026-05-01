import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createBus = async (
  busId: string,
  name: string,
  number: string,
  routeId: string,
  driverId?: string
) => {
  await setDoc(
    doc(db, "buses", busId),
    {
      name,
      number,
      routeId,
      driverId: driverId || null,
      status: "offline",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
