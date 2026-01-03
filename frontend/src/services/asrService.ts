// ASR (Automatic Speech Recognition) service for transcribing audio

import { apiClient } from './apiClient';
import { TranscribeResult } from '@/types';

export const asrService = {
  /**
   * Transcribe audio file using the backend ASR endpoint
   * @param file - Audio file as Blob or File
   * @returns Promise with transcription result
   */
  async transcribe(file: Blob | File): Promise<TranscribeResult> {
    const formData = new FormData();
    formData.append('file', file, 'audio.webm');

    const result = await apiClient.post<TranscribeResult>(
      '/api/asr/transcribe',
      formData
    );

    return result;
  },
};
