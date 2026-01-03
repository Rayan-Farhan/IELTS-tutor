// Session control buttons for managing chat sessions

import { Download, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types';

interface SessionControlsProps {
  messages: ChatMessage[];
  sessionId: string | null;
  autoplayEnabled: boolean;
  onReset: () => void;
  onToggleAutoplay: () => void;
}

export const SessionControls = ({
  messages,
  sessionId,
  autoplayEnabled,
  onReset,
  onToggleAutoplay,
}: SessionControlsProps) => {
  const exportAsJSON = () => {
    const data = {
      session_id: sessionId,
      messages: messages.map((msg) => ({
        role: msg.role,
        text: msg.text,
        audioFile: msg.audioFile,
        createdAt: msg.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-session-${sessionId || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = messages
      .map((msg) => {
        const timestamp = new Date(msg.createdAt).toLocaleString();
        return `[${timestamp}] ${msg.role.toUpperCase()}: ${msg.text}`;
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-session-${sessionId || 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={onToggleAutoplay} className="gap-2">
        {autoplayEnabled ? (
          <>
            <Volume2 className="h-4 w-4" />
            Autoplay On
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4" />
            Autoplay Off
          </>
        )}
      </Button>

      {messages.length > 0 && (
        <>
          <Button variant="outline" size="sm" onClick={exportAsJSON} className="gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </Button>

          <Button variant="outline" size="sm" onClick={exportAsText} className="gap-2">
            <Download className="h-4 w-4" />
            Export Text
          </Button>

          <Button variant="destructive" size="sm" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Session
          </Button>
        </>
      )}
    </div>
  );
};
