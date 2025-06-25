import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentLocation, 
  getNearbyDevices, 
  sendBlackMessage 
} from '../services/locationService';
import { monitorNetworkStatus } from '../services/cellularService';
import { calculateDistance, haversine } from '../utils/geoUtils';

const TrackingContext = createContext();

export const useTracking = () => useContext(TrackingContext);

export const TrackingProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDevices, setNearbyDevices] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('stable');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [warningLevel, setWarningLevel] = useState(0);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [dangerZones, setDangerZones] = useState([
    { id: 1, lat: 40.7128, lng: -74.0060, radius: 500, threatLevel: 5 },
    { id: 2, lat: 34.0522, lng: -118.2437, radius: 300, threatLevel: 3 }
  ]);

  // Main tracking function
  const trackUser = async () => {
    try {
      // Primary location method
      let location = await getCurrentLocation();
      
      // Fallback to cellular triangulation if needed
      if (!location) {
        location = await getCellularLocation();
      }
      
      // Emergency fallback
      if (!location && emergencyMode) {
        await sendBlackMessage();
        location = await getCellularLocation(true);
      }
      
      if (location) {
        setUserLocation(location);
        updateTrackingHistory(location);
        checkDangerZones(location);
        
        // Get nearby devices
        const devices = await getNearbyDevices(location);
        setNearbyDevices(devices);
      }
    } catch (error) {
      console.error("Tracking error:", error);
      handleTrackingFailure();
    }
  };

  // Check network status periodically
  useEffect(() => {
    const networkInterval = setInterval(async () => {
      const status = await monitorNetworkStatus();
      setNetworkStatus(status);
      
      if (status === 'critical') {
        setEmergencyMode(true);
      }
    }, 30000);
    
    return () => clearInterval(networkInterval);
  }, []);

  // Main tracking interval
  useEffect(() => {
    const trackingInterval = setInterval(trackUser, 15000);
    return () => clearInterval(trackingInterval);
  }, [emergencyMode]);

  const checkDangerZones = (location) => {
    let maxThreat = 0;
    
    dangerZones.forEach(zone => {
      const distance = haversine(
        location.lat, 
        location.lng,
        zone.lat,
        zone.lng
      );
      
      if (distance <= zone.radius) {
        const threat = Math.min(10, Math.floor(zone.threatLevel * (1 - distance/zone.radius) + 1));
        if (threat > maxThreat) maxThreat = threat;
      }
    });
    
    setWarningLevel(maxThreat);
  };

  const updateTrackingHistory = (location) => {
    setTrackingHistory(prev => [
      {
        timestamp: new Date().toISOString(),
        coordinates: location,
        warningLevel
      },
      ...prev.slice(0, 49)
    ]);
  };

  const handleTrackingFailure = async () => {
    if (networkStatus === 'critical' || emergencyMode) {
      await sendBlackMessage();
      setTimeout(trackUser, 5000);
    }
  };

  const addDangerZone = (zone) => {
    setDangerZones(prev => [...prev, zone]);
  };

  const value = {
    userLocation,
    nearbyDevices,
    networkStatus,
    emergencyMode,
    warningLevel,
    trackingHistory,
    dangerZones,
    setEmergencyMode,
    addDangerZone,
    refreshLocation: trackUser
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};