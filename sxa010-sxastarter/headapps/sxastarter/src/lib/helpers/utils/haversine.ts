export const calculateDistanceBetweenTwoPoints = (lat1Input: number, lon1Input: number, lat2Input: number, lon2Input: number): number => {
  const R = 6371; // km
  const dLat = toRad(lat2Input - lat1Input);
  const dLon = toRad(lon2Input - lon1Input);
  const lat1 = toRad(lat1Input);
  const lat2 = toRad(lat2Input);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

// Converts numeric degrees to radians
function toRad(value: number) {
  return (value * Math.PI) / 180;
}
