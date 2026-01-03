// Audio player component with play/pause controls

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { AudioPlayerState } from '@/types';

interface AudioPlayerProps {
  url: string;
  autoplay?: boolean;
  className?: string;
  onError?: () => void;
}

export const AudioPlayer = ({ url, autoplay = false, className, onError }: AudioPlayerProps) => {
  const [state, setState] = useState<AudioPlayerState>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setState('idle');
      if (autoplay) {
        audio.play().catch(() => {
          setState('error');
          onError?.();
        });
      }
    };

    const handleCanPlay = () => {
      if (state === 'loading') {
        setState('idle');
      }
    };

    const handlePlay = () => setState('playing');
    const handlePause = () => setState('paused');
    const handleEnded = () => setState('idle');
    const handleError = () => {
      setState('error');
      onError?.();
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [url, autoplay, onError, state]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === 'playing') {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setState('error');
        onError?.();
      });
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (state === 'error') {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3', className)}>
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Failed to load audio</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-border bg-card p-3', className)}>
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        disabled={state === 'loading'}
        className="shrink-0"
      >
        {state === 'playing' ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-1 items-center gap-2">
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={state === 'loading'}
          className="flex-1"
        />
      </div>

      <span className="shrink-0 font-mono text-xs text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};
