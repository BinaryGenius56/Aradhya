// Triggers audible alerts based on threat level
export const triggerAudibleAlert = (type) => {
  // In a real implementation, this would play actual sounds
  console.log(`AUDIBLE ALERT: ${type.toUpperCase()}`);
  
  // Create Web Audio context for browser alerts
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'siren':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        break;
      case 'warning':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'notice':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        break;
      default:
        return;
    }
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 2000);
  } catch (e) {
    console.warn("Web Audio API not supported:", e);
  }
};

// Triggers visual alert
export const triggerVisualAlert = (level) => {
  // In a real app, this would flash the screen or UI elements
  document.documentElement.style.setProperty('--alert-color', level > 7 ? '#ff0000' : '#ff6600');
  
  setTimeout(() => {
    document.documentElement.style.removeProperty('--alert-color');
  }, 1000);
};