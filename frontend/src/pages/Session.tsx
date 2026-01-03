// Practice session page with chat interface

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/ChatMessage';
import { SessionControls } from '@/components/SessionControls';
import { AudioRecorder } from '@/components/AudioRecorder';
import { useChatSession } from '@/hooks/useChatSession';
import { useAutoplay } from '@/hooks/useAutoplay';
import { useTranscribe } from '@/hooks/useTranscribe';
import { ArrowLeft, Send, Mic, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Session = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, messages, isLoading, sendMessage, reset, addSystemMessage } = useChatSession();
  const { enabled: autoplayEnabled, toggle: toggleAutoplay } = useAutoplay();
  const { transcribe, isTranscribing } = useTranscribe();
  
  const [input, setInput] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const [recorderKey, setRecorderKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial message from transcription page
  useEffect(() => {
    const state = location.state as { initialMessage?: string };
    if (state?.initialMessage) {
      setInput(state.initialMessage);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addSystemMessage(
        'Welcome to your IELTS speaking practice session! You can type your responses or use the microphone button to record audio. The AI tutor will provide feedback on your grammar, vocabulary, and fluency.'
      );
    }
  }, [messages.length, addSystemMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');
    
    // Send text-only message (no audio blob)
    const response = await sendMessage(messageText);
    if (response) {
      toast.success('Tutor response received');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = async (blob: Blob) => {
    // Transcribe the audio
    const result = await transcribe(blob);
    if (result) {
      // Send the transcribed text along with the audio blob
      const response = await sendMessage(result.text, blob);
      if (response) {
        toast.success('Tutor response received');
      }

      // Reset recorder UI for the next turn (continuous conversation)
      setRecorderKey((k) => k + 1);
    } else {
      toast.error('Failed to transcribe audio');
    }
  };

  const handleReset = () => {
    if (messages.length > 1) {
      const confirmed = window.confirm(
        'Are you sure you want to reset this session? All messages will be lost.'
      );
      if (!confirmed) return;
    }
    reset();
    toast.success('Session reset');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold">Practice Session</h1>
              {sessionId && (
                <p className="text-xs text-muted-foreground">ID: {sessionId.slice(0, 8)}</p>
              )}
            </div>
          </div>

          <SessionControls
            messages={messages}
            sessionId={sessionId}
            autoplayEnabled={autoplayEnabled}
            onReset={handleReset}
            onToggleAutoplay={toggleAutoplay}
          />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Start Speaking!</h2>
              <p className="max-w-md text-muted-foreground">
                Type your response or click the microphone to record. 
                The AI tutor will give you feedback on grammar, vocabulary, and fluency.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  autoplayEnabled={autoplayEnabled}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          {showRecorder ? (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Mic className="h-4 w-4 text-primary" />
                    Record Your Response
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRecorder(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <AudioRecorder key={recorderKey} onRecordingComplete={handleRecordingComplete} />
                {isTranscribing && (
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    Transcribing your audio...
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowRecorder(true)}
                disabled={isLoading}
                title="Record audio (R)"
                className="shrink-0"
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response here..."
                className="min-h-[52px] resize-none"
                disabled={isLoading}
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                title="Send message (Enter)"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line • Click mic to record
          </p>
        </div>
      </div>
    </div>
  );
};

export default Session;
