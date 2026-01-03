// Component for viewing and editing transcription results

import { TranscribeResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TranscriptViewerProps {
  result: TranscribeResult;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  editable?: boolean;
}

export const TranscriptViewer = ({
  result,
  transcript,
  onTranscriptChange,
  editable = true,
}: TranscriptViewerProps) => {
  const confidenceLevel = result.confidence >= 0 ? 'high' : 'low';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transcription</CardTitle>
            <div className="flex items-center gap-2">
              {confidenceLevel === 'high' ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <Badge variant={confidenceLevel === 'high' ? 'default' : 'destructive'}>
                Confidence: {result.confidence.toFixed(2)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editable ? (
            <Textarea
              value={transcript}
              onChange={(e) => onTranscriptChange(e.target.value)}
              className="min-h-[100px] font-sans"
              placeholder="Your transcribed text will appear here..."
            />
          ) : (
            <p className="rounded-md border border-border bg-muted/50 p-4 text-foreground">
              {transcript}
            </p>
          )}

          {confidenceLevel === 'low' && (
            <p className="text-sm text-muted-foreground">
              Low confidence detected. You may want to re-record or edit the transcript above.
            </p>
          )}
        </CardContent>
      </Card>

      {result.timestamps && result.timestamps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Word Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="pb-2 text-left font-medium">Word</th>
                    <th className="pb-2 text-right font-medium">Start (s)</th>
                    <th className="pb-2 text-right font-medium">End (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.timestamps.map((timestamp, index) => (
                    <tr key={index} className="border-b border-border/50 last:border-0">
                      <td className="py-2">{timestamp.word}</td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {timestamp.start.toFixed(2)}
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {timestamp.end.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
