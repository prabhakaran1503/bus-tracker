export const calculateETA = (
lat1:number,
lon1:number,
lat2:number,
lon2:number
)=>{

const R = 6371

const dLat = (lat2-lat1)
const dLon = (lon2-lon1)

const distance = Math.sqrt(dLat*dLat + dLon*dLon)

const speed = 40

const time = (distance / speed) * 60

return Math.round(time)
}