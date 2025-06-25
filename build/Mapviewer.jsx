import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTracking } from '../contexts/TrackingContext';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapViewer = () => {
  const { userLocation, nearbyDevices, dangerZones, warningLevel } = useTracking();
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [zoomLevel, setZoomLevel] = useState(13);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const getMarkerColor = (threatLevel) => {
    return threatLevel > 1 ? 'red' : threatLevel > 0 ? 'orange' : 'green';
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={mapInstance => {
          mapInstance.on('zoomend', () => {
            setZoomLevel(mapInstance.getZoom());
          });
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={L.icon({
                iconUrl: warningLevel > 5 
                  ? '/emergency-marker.png' 
                  : warningLevel > 2 
                    ? '/warning-marker.png' 
                    : '/user-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
              })}
            >
              <Popup>
                <strong>Your Location</strong><br />
                Accuracy: {Math.round(userLocation.accuracy)}m<br />
                Source: {userLocation.source.replace(/_/g, ' ')}
              </Popup>
            </Marker>
            
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              color="blue"
              fillOpacity={0.1}
            />
          </>
        )}
        
        {nearbyDevices.map(device => (
          <Marker
            key={device.id}
            position={[device.position.lat, device.position.lng]}
            icon={L.divIcon({
              className: `device-marker threat-${device.threatLevel}`,
              html: `<div class="device-icon" style="background-color: ${getMarkerColor(device.threatLevel)}">
                      <span>${device.distance}m</span>
                     </div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            })}
          >
            <Popup>
              <div className="device-info">
                <h4>Nearby Device</h4>
                <p><strong>Phone:</strong> {device.phoneNumber}</p>
                <p><strong>Operator:</strong> {device.simOperator}</p>
                <p><strong>Model:</strong> {device.deviceModel}</p>
                <p><strong>Distance:</strong> {device.distance}m</p>
                <p><strong>Last seen:</strong> {new Date(device.lastSeen).toLocaleTimeString()}</p>
                <p className={`threat-${device.threatLevel}`}>
                  <strong>Threat level:</strong> {device.threatLevel}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {dangerZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            color="red"
            fillColor="#f03"
            fillOpacity={0.2}
          >
            <Tooltip permanent>
              <strong>Danger Zone</strong><br />
              Threat level: {zone.threatLevel}
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
      
      <div className="map-controls">
        <button onClick={() => setZoomLevel(zoomLevel + 1)}>Zoom In</button>
        <button onClick={() => setZoomLevel(zoomLevel - 1)}>Zoom Out</button>
      </div>
    </div>
  );
};

export default MapViewer;