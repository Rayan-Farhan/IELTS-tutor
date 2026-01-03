// Audio recorder component with visual feedback

import { Mic, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/useRecorder';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  className?: string;
}

export const AudioRecorder = ({ onRecordingComplete, className }: AudioRecorderProps) => {
  const { state, blob, error, duration, isRecording, start, stop, reset } = useRecorder();

  const handleStop = () => {
    stop();
  };

  const handleReset = () => {
    reset();
  };

  const handleUseRecording = () => {
    if (blob) {
      onRecordingComplete(blob);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-4">
        {!isRecording && !blob && (
          <Button onClick={start} size="lg" className="gap-2">
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button onClick={handleStop} variant="destructive" size="lg" className="gap-2">
            <Square className="h-5 w-5" />
            Stop Recording
          </Button>
        )}

        {blob && !isRecording && (
          <>
            <Button onClick={handleUseRecording} size="lg">
              Use Recording
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
          </div>
          <span className="font-mono text-sm text-muted-foreground">
            Recording: {formatDuration(duration)}
          </span>
        </div>
      )}

      {blob && !isRecording && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Recording complete ({formatDuration(duration)})
          </p>
          <audio src={URL.createObjectURL(blob)} controls className="mt-2 w-full" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please ensure microphone permissions are granted.
          </p>
        </div>
      )}
    </div>
  );
};
