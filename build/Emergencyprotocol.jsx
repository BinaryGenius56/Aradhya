import React, { useState } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { sendBlackMessage } from '../services/locationService';

const EmergencyProtocol = () => {
  const { emergencyMode, setEmergencyMode, userLocation } = useTracking();
  const [manualMessageSent, setManualMessageSent] = useState(false);
  
  const activateEmergencyMode = () => {
    setEmergencyMode(true);
    triggerEmergencyProtocol();
  };
  
  const triggerEmergencyProtocol = async () => {
    // Send immediate location request
    await sendBlackMessage();
    
    // Increase tracking frequency
    // (Handled in context provider)
    
    // Notify emergency contacts
    // (Would be implemented in a real system)
  };
  
  const sendManualBlackMessage = async () => {
    try {
      await sendBlackMessage();
      setManualMessageSent(true);
      setTimeout(() => setManualMessageSent(false), 5000);
    } catch (error) {
      console.error("Failed to send black message:", error);
    }
  };
  
  return (
    <div className="emergency-protocol">
      <h3>Emergency Controls</h3>
      
      {!emergencyMode ? (
        <div className="emergency-activation">
          <p>Activate emergency protocols for enhanced tracking:</p>
          <button 
            className="emergency-button"
            onClick={activateEmergencyMode}
          >
            ACTIVATE EMERGENCY MODE
          </button>
          <p className="warning-note">
            Warning: This will enable cellular tracking, increase frequency, and may notify authorities.
          </p>
        </div>
      ) : (
        <div className="emergency-active">
          <div className="emergency-status">EMERGENCY MODE ACTIVE</div>
          <button 
            className="black-message-button"
            onClick={sendManualBlackMessage}
            disabled={manualMessageSent}
          >
            {manualMessageSent ? 'MESSAGE SENT' : 'SEND BLACK MESSAGE NOW'}
          </button>
        </div>
      )}
      
      <div className="current-location">
        {userLocation ? (
          <>
            <h4>Current Position:</h4>
            <p>Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}</p>
            <p>Accuracy: ±{Math.round(userLocation.accuracy)} meters</p>
            <p>Source: {userLocation.source.replace(/_/g, ' ')}</p>
            <p>Last update: {new Date(userLocation.timestamp).toLocaleTimeString()}</p>
          </>
        ) : (
          <p>Acquiring location data...</p>
        )}
      </div>
    </div>
  );
};

export default EmergencyProtocol;