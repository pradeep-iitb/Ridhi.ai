// Voice recognition and synthesis utilities
class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.inactivityTimer = null;
    this.inactivityCallback = null;
    this.inactivityDelay = 2000; // 2 seconds
    this.lastActivityTime = Date.now();
  }

  // Initialize speech recognition
  initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    return true;
  }

  // Start listening for voice input
  startListening(onResult, onError, onEnd) {
    if (!this.recognition && !this.initRecognition()) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.isListening = true;
    this.lastActivityTime = Date.now();
    this.startInactivityTimer();

    this.recognition.onresult = (event) => {
      this.lastActivityTime = Date.now();
      this.resetInactivityTimer();

      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');
      
      const isFinal = results[results.length - 1].isFinal;

      onResult?.(transcript, isFinal);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Automatically restart if still in listening mode
        this.recognition.start();
      } else {
        onEnd?.();
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError?.(error.message);
    }
  }

  // Stop listening
  stopListening() {
    this.isListening = false;
    this.clearInactivityTimer();
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  // Speak text using synthesis
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'en-US';

      // Try to use a female voice if available
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis && this.synthesis.speaking;
  }

  // Set inactivity callback - called when user is inactive for specified time
  setInactivityCallback(callback, delay = 2000) {
    this.inactivityCallback = callback;
    this.inactivityDelay = delay;
  }

  // Start inactivity timer
  startInactivityTimer() {
    this.clearInactivityTimer();
    
    this.inactivityTimer = setInterval(() => {
      const timeSinceLastActivity = Date.now() - this.lastActivityTime;
      
      if (timeSinceLastActivity >= this.inactivityDelay && this.inactivityCallback) {
        // User has been inactive for the specified time
        this.inactivityCallback();
        // Reset to avoid repeated calls
        this.lastActivityTime = Date.now();
      }
    }, 500); // Check every 500ms
  }

  // Reset inactivity timer
  resetInactivityTimer() {
    this.lastActivityTime = Date.now();
  }

  // Clear inactivity timer
  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearInterval(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // Update activity (call this on user interaction)
  updateActivity() {
    this.lastActivityTime = Date.now();
  }

  // Clean up
  destroy() {
    this.stopListening();
    this.stopSpeaking();
    this.clearInactivityTimer();
  }
}

// Create singleton instance
let voiceManagerInstance = null;

export const getVoiceManager = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!voiceManagerInstance) {
    voiceManagerInstance = new VoiceManager();
  }

  return voiceManagerInstance;
};

// Utility functions
export const canUseSpeechRecognition = () => {
  return typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const canUseSpeechSynthesis = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export default VoiceManager;
