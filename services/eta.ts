export const calculateETA = (
  busLat: number,
  busLng: number,
  stopLat: number,
  stopLng: number
) => {
  const R = 6371;

  const dLat = (stopLat - busLat) * Math.PI / 180;
  const dLng = (stopLng - busLng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(busLat * Math.PI / 180) *
    Math.cos(stopLat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  const speed = 30;

  return Math.round((distance / speed) * 60);
};