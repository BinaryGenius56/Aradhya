// Calculate distance between two points using Haversine formula
export const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c * 1000; // Distance in meters
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Calculate distance between user and device
export const calculateDistance = (user, device) => {
  return haversine(
    user.lat,
    user.lng,
    device.position.lat,
    device.position.lng
  );
};

// Calculate bearing between two points
export const getBearing = (start, end) => {
  const startLat = deg2rad(start.lat);
  const startLng = deg2rad(start.lng);
  const endLat = deg2rad(end.lat);
  const endLng = deg2rad(end.lng);
  
  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  
  let bearing = Math.atan2(y, x);
  bearing = rad2deg(bearing);
  return (bearing + 360) % 360;
};

const rad2deg = (rad) => {
  return rad * (180 / Math.PI);
};

// Check if location is within danger zone
export const inDangerZone = (location, zone) => {
  const distance = haversine(
    location.lat,
    location.lng,
    zone.lat,
    zone.lng
  );
  
  return distance <= zone.radius;
};