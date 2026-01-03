// Core types for the IELTS Tutor application

export type Timestamp = {
  word: string;
  start: number;
  end: number;
};

export type TranscribeResult = {
  text: string;
  confidence: number;
  timestamps: Timestamp[];
};

export type ChatResponse = {
  session_id: string;
  response: string;
  audio_file: string;
};

export type MessageRole = 'user' | 'tutor' | 'system';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  audioFile?: string;
  audioBlob?: Blob; // For user-recorded audio
  createdAt: string;
  isLoading?: boolean;
};

export type RecorderState = 'idle' | 'recording' | 'paused' | 'error';

export type AudioPlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
