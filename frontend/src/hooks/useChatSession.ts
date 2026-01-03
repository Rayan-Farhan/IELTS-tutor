// Custom hook for managing chat session with the AI tutor

import { useState, useCallback, useRef } from 'react';
import { chatService } from '@/services/chatService';
import { ChatMessage, ChatResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string, audioBlob?: Blob): Promise<ChatResponse | null> => {
    try {
      setIsLoading(true);

      // Add user message with optional audio blob
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        text,
        audioBlob, // Store the audio blob for playback
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Add loading placeholder for tutor response
      const loadingId = uuidv4();
      const loadingMessage: ChatMessage = {
        id: loadingId,
        role: 'tutor',
        text: '',
        createdAt: new Date().toISOString(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      // Get tutor response
      const response = await chatService.respond(text, sessionId || undefined);

      // Update session ID if this is the first message
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }

      // Replace loading message with actual response
      const tutorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'tutor',
        text: response.response,
        audioFile: response.audio_file,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(tutorMessage));

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get tutor response';
      
      // Add error message
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: 'system',
        text: `Error: ${errorMessage}. Please check your backend connection.`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.filter((m) => !m.isLoading), errorMsg]);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSessionId(null);
    setMessages([]);
    setIsLoading(false);
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    const systemMessage: ChatMessage = {
      id: uuidv4(),
      role: 'system',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, []);

  return {
    sessionId,
    messages,
    isLoading,
    sendMessage,
    reset,
    addSystemMessage,
  };
};
