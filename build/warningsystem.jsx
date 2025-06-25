import React, { useEffect } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { triggerAudibleAlert } from '../utils/alertSystem';

const WarningSystem = () => {
  const { warningLevel, emergencyMode } = useTracking();
  const [lastLevel, setLastLevel] = React.useState(0);
  
  useEffect(() => {
    if (warningLevel > lastLevel) {
      // Escalating threat
      triggerAlert(warningLevel);
    }
    setLastLevel(warningLevel);
  }, [warningLevel]);
  
  const triggerAlert = (level) => {
    switch(true) {
      case (level >= 8):
        triggerAudibleAlert('siren');
        break;
      case (level >= 5):
        triggerAudibleAlert('warning');
        break;
      case (level >= 3):
        triggerAudibleAlert('notice');
        break;
      default:
        // No alert
    }
  };
  
  const getWarningMessage = () => {
    if (emergencyMode) return "EMERGENCY MODE ACTIVATED!";
    
    if (warningLevel >= 8) 
      return "CRITICAL DANGER! Evacuate immediately!";
    if (warningLevel >= 5) 
      return "HIGH THREAT! Proceed with extreme caution!";
    if (warningLevel >= 3) 
      return "CAUTION: Potential threat nearby";
    
    return "All clear";
  };
  
  const getWarningClass = () => {
    if (emergencyMode) return 'emergency-critical';
    
    if (warningLevel >= 8) return 'critical';
    if (warningLevel >= 5) return 'high';
    if (warningLevel >= 3) return 'medium';
    
    return 'normal';
  };
  
  return (
    <div className={`warning-system ${getWarningClass()}`}>
      <div className="warning-header">
        <h2>Threat Status</h2>
        <div className="warning-level">Level: {warningLevel}/10</div>
      </div>
      
      <div className="warning-message">
        {getWarningMessage()}
      </div>
      
      <div className="warning-meter">
        <div 
          className="warning-indicator" 
          style={{ width: `${warningLevel * 10}%` }}
        />
      </div>
      
      {emergencyMode && (
        <div className="emergency-protocol">
          <p>Emergency protocols activated. Location tracking at maximum frequency.</p>
          <p>Black message protocol enabled for cellular positioning.</p>
        </div>
      )}
    </div>
  );
};

export default WarningSystem;