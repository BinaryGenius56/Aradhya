// Simulates cellular network operations
export const monitorNetworkStatus = async () => {
  // Simulate network status with 85% chance of stable connection
  const status = Math.random();
  
  if (status < 0.05) return 'critical';
  if (status < 0.15) return 'unstable';
  if (status < 0.25) return 'limited';
  return 'stable';
};

export const getCellTowerInfo = async () => {
  // Simulate fetching tower information
  return {
    mcc: '310',
    mnc: '260',
    tac: '1234',
    ci: '56789',
    signalStrength: -75 + Math.floor(Math.random() * 20),
    timingAdvance: Math.floor(Math.random() * 64),
  };
};

export const getNetworkType = async () => {
  const types = ['4G', '5G', '3G', '2G'];
  return types[Math.floor(Math.random() * types.length)];
};

export const getSignalQuality = async () => {
  // Returns signal quality in percentage (0-100)
  return 20 + Math.floor(Math.random() * 80);
};

export const getEmergencyContacts = async () => {
  // Simulates fetching emergency contacts from device
  return [
    { name: 'Emergency Services', number: '112' },
    { name: 'Security HQ', number: '+1-555-123-4567' },
    { name: 'Local Police', number: '+1-555-987-6543' },
  ];
};
