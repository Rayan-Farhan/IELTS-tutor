// Chat service for interacting with the AI tutor

import { apiClient } from './apiClient';
import { ChatResponse } from '@/types';

export const chatService = {
  /**
   * Send user input to the tutor and get a response
   * @param userInput - User's text message
   * @param sessionId - Optional session ID for continuing conversation
   * @returns Promise with tutor response
   */
  async respond(userInput: string, sessionId?: string): Promise<ChatResponse> {
    const formData = new URLSearchParams();
    formData.append('user_input', userInput);
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const result = await apiClient.post<ChatResponse>(
      '/api/chat/respond',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return result;
  },
};
