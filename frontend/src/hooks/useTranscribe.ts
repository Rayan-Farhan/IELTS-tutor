// Custom hook for transcribing audio files

import { useState, useCallback } from 'react';
import { asrService } from '@/services/asrService';
import { TranscribeResult } from '@/types';

export const useTranscribe = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = useCallback(async (blob: Blob | File): Promise<TranscribeResult | null> => {
    try {
      setIsTranscribing(true);
      setError(null);
      
      const result = await asrService.transcribe(blob);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  return {
    transcribe,
    isTranscribing,
    error,
  };
};
