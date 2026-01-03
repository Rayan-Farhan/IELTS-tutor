// Chat message component with role-based styling

import { ChatMessage as ChatMessageType } from '@/types';
import { AudioPlayer } from './AudioPlayer';
import { Loader } from './Loader';
import { audioService } from '@/services/audioService';
import { Bot, User, AlertCircle, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  autoplayEnabled?: boolean;
}

export const ChatMessage = ({ message, autoplayEnabled = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const isTutor = message.role === 'tutor';
  const isSystem = message.role === 'system';

  // Handle both audioFile (for tutor) and audioBlob (for user recordings)
  const audioUrl = message.audioFile 
    ? audioService.getAudioUrl(message.audioFile) 
    : message.audioBlob 
    ? audioService.getAudioUrl(message.audioBlob)
    : undefined;

  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border p-4 transition-colors',
        isUser && 'border-primary/20 bg-primary/5',
        isTutor && 'border-secondary/20 bg-card',
        isSystem && 'border-border bg-muted/50'
      )}
    >
      <div className="shrink-0">
        {isUser && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {isTutor && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Bot className="h-4 w-4 text-secondary-foreground" />
          </div>
        )}
        {isSystem && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser && 'You'}
            {isTutor && 'AI Tutor'}
            {isSystem && 'Info'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {message.isLoading ? (
          <Loader text="Generating response..." className="py-2" />
        ) : (
          <>
            <div className="space-y-2">
              {/* Show audio indicator for user messages with audio */}
              {isUser && message.audioBlob && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mic className="h-3 w-3" />
                  <span>Voice message (transcribed below)</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
            </div>
            {audioUrl && <AudioPlayer url={audioUrl} autoplay={autoplayEnabled} />}
          </>
        )}
      </div>
    </div>
  );
};
