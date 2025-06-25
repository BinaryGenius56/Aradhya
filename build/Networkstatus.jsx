import React from 'react';
import { useTracking } from '../contexts/TrackingContext';

const NetworkStatus = () => {
  const { networkStatus } = useTracking();
  
  const getStatusText = () => {
    switch(networkStatus) {
      case 'critical':
        return 'CRITICAL NETWORK';
      case 'unstable':
        return 'UNSTABLE CONNECTION';
      case 'limited':
        return 'LIMITED SERVICE';
      default:
        return 'NETWORK STABLE';
    }
  };
  
  const getStatusClass = () => {
    switch(networkStatus) {
      case 'critical':
        return 'critical';
      case 'unstable':
        return 'unstable';
      case 'limited':
        return 'limited';
      default:
        return 'stable';
    }
  };
  
  return (
    <div className={`network-status ${getStatusClass()}`}>
      <div className="status-indicator"></div>
      <span>{getStatusText()}</span>
    </div>
  );
};

export default NetworkStatus;