import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function DriverMap(){

const [location,setLocation] = useState<any>(null)

useEffect(()=>{
(async()=>{

const {status} = await Location.requestForegroundPermissionsAsync()

if(status !== "granted") return

Location.watchPositionAsync(
{ accuracy:6, timeInterval:2000 },
(loc)=>{
setLocation(loc.coords)

setDoc(doc(db,"bus","bus1"),{
latitude:loc.coords.latitude,
longitude:loc.coords.longitude
})
}
)

})()
},[])

if(!location) return null

return(
<MapView
style={{flex:1}}
region={{
latitude:location.latitude,
longitude:location.longitude,
latitudeDelta:0.01,
longitudeDelta:0.01
}}
>
<Marker coordinate={location}/>
</MapView>
)
}