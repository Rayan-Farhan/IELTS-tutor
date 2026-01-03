// Transcription page for recording and transcribing audio

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AudioRecorder } from '@/components/AudioRecorder';
import { TranscriptViewer } from '@/components/TranscriptViewer';
import { Loader } from '@/components/Loader';
import { useTranscribe } from '@/hooks/useTranscribe';
import { TranscribeResult } from '@/types';
import { ArrowLeft, Upload, Send, Mic, X } from 'lucide-react';
import { toast } from 'sonner';

const Transcribe = () => {
  const navigate = useNavigate();
  const { transcribe, isTranscribing, error } = useTranscribe();
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [transcript, setTranscript] = useState('');

  const handleRecordingComplete = async (blob: Blob) => {
    const transcribeResult = await transcribe(blob);
    if (transcribeResult) {
      setResult(transcribeResult);
      setTranscript(transcribeResult.text);
      toast.success('Audio transcribed successfully!');
    } else {
      toast.error(error || 'Failed to transcribe audio');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const transcribeResult = await transcribe(file);
    if (transcribeResult) {
      setResult(transcribeResult);
      setTranscript(transcribeResult.text);
      toast.success('Audio file transcribed successfully!');
    } else {
      toast.error(error || 'Failed to transcribe audio file');
    }
  };

  const handleSendToTutor = () => {
    if (!transcript.trim()) {
      toast.error('Please transcribe some audio first');
      return;
    }
    navigate('/session', { state: { initialMessage: transcript } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-lg font-semibold">Audio Transcription</h1>
            <p className="text-xs text-muted-foreground">Test your pronunciation</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Recording Section */}
        <Card className="mb-6 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Record Your Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or upload a file</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => document.getElementById('audio-upload')?.click()}
                type="button"
              >
                <Upload className="h-4 w-4" />
                Upload Audio File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transcribing State */}
        {isTranscribing && (
          <Card className="border-2 border-primary/20">
            <CardContent className="py-12">
              <Loader text="Transcribing your audio..." />
            </CardContent>
          </Card>
        )}

        {/* Transcription Result */}
        {result && !isTranscribing && (
          <div className="space-y-4">
            <TranscriptViewer
              result={result}
              transcript={transcript}
              onTranscriptChange={setTranscript}
              editable
            />

            <Card className="border-2 border-primary/20">
              <CardContent className="p-4">
                <p className="mb-4 text-sm text-muted-foreground">
                  Review and edit your transcript above, then send it to the AI tutor for feedback.
                </p>
                <Button onClick={handleSendToTutor} size="lg" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Get AI Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && !isTranscribing && (
          <Card className="border-2 border-destructive/50">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-destructive">Transcription Failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Make sure your backend server is running at the configured URL.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!result && !isTranscribing && !error && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Record or upload audio to see your transcript here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transcribe;
