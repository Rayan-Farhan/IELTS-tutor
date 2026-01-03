// Audio service for handling audio file URLs

import { apiClient } from './apiClient';

export const audioService = {
  /**
   * Convert audio file name or Blob to a playable URL
   * @param source - Filename like "tutor_reply_<uuid>.mp3" or Blob object
   * @returns URL for accessing the audio
   */
  getAudioUrl(source: string | Blob): string {
    // If it's a Blob, create an object URL
    if (source instanceof Blob) {
      return URL.createObjectURL(source);
    }
    
    // If it's a filename, construct API URL
    return `${apiClient.baseUrl}/api/audio/${source}`;
  },

  /**
   * Preload audio file to check if it's accessible
   * @param url - Audio file URL
   * @returns Promise that resolves when audio is loaded
   */
  async preloadAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadeddata = () => resolve();
      audio.onerror = () => reject(new Error('Failed to load audio'));
      audio.src = url;
    });
  },
};
