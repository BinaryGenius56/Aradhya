// Advanced triangulation algorithms
export const trilaterate = (towers) => {
  if (towers.length < 3) {
    throw new Error('At least 3 towers required for trilateration');
  }
  
  // Convert to Cartesian coordinates
  const cartesianTowers = towers.map(tower => ({
    x: tower.lng * 111000 * Math.cos(tower.lat * Math.PI/180),
    y: tower.lat * 111000,
    r: tower.signalStrength / 10  // Simplified distance estimation
  }));
  
  // Use least squares method for position estimation
  let A = 0, B = 0, C = 0, D = 0, E = 0, F = 0;
  
  for (let i = 0; i < cartesianTowers.length; i++) {
    const { x, y, r } = cartesianTowers[i];
    const x2 = x * x;
    const y2 = y * y;
    const r2 = r * r;
    
    A += 2 * x;
    B += 2 * y;
    C += 1;
    D += x2 + y2 - r2;
    E += x;
    F += y;
  }
  
  const denominator = A * A + B * B - 4 * C * (E + F);
  if (Math.abs(denominator) < 1e-10) {
    throw new Error('No solution found for trilateration');
  }
  
  const x = (A * D - 2 * C * E) / denominator;
  const y = (B * D - 2 * C * F) / denominator;
  
  // Convert back to geographic coordinates
  return {
    lat: y / 111000,
    lng: x / (111000 * Math.cos(y * Math.PI/180))
  };
};

export const calculateAccuracy = (towers, estimatedPoint) => {
  // Calculate accuracy based on tower distances
  const distances = towers.map(tower => {
    const dx = tower.lng - estimatedPoint.lng;
    const dy = tower.lat - estimatedPoint.lat;
    return Math.sqrt(dx * dx + dy * dy) * 111000;
  });
  
  const meanDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  return meanDistance;
};

export const weightedTrilateration = (towers) => {
  // Apply signal strength weighting
  const totalStrength = towers.reduce((sum, t) => sum + t.signalStrength, 0);
  
  let weightedLat = 0;
  let weightedLng = 0;
  
  towers.forEach(tower => {
    const weight = tower.signalStrength / totalStrength;
    weightedLat += tower.lat * weight;
    weightedLng += tower.lng * weight;
  });
  
  return {
    lat: weightedLat,
    lng: weightedLng,
    accuracy: calculateAccuracy(towers, { lat: weightedLat, lng: weightedLng })
  };
};

export const hybridPositioning = (gpsData, cellularData) => {
  // Combine GPS and cellular data for better accuracy
  if (!gpsData) return cellularData;
  
  const gpsWeight = 0.7;
  const cellularWeight = 0.3;
  
  return {
    lat: gpsData.lat * gpsWeight + cellularData.lat * cellularWeight,
    lng: gpsData.lng * gpsWeight + cellularData.lng * cellularWeight,
    accuracy: gpsData.accuracy * gpsWeight + cellularData.accuracy * cellularWeight,
    source: 'hybrid',
    timestamp: new Date().toISOString()
  };
};