// Settings and configuration page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAutoplay } from '@/hooks/useAutoplay';
import { apiClient } from '@/services/apiClient';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { enabled: autoplayEnabled, toggle: toggleAutoplay } = useAutoplay();
  const [backendUrl, setBackendUrl] = useState(apiClient.baseUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Try to fetch from a basic endpoint
      const response = await fetch(`${backendUrl}/docs`);
      if (response.ok) {
        setTestResult('success');
        toast.success('Backend connection successful!');
      } else {
        setTestResult('error');
        toast.error('Backend responded with an error');
      }
    } catch (error) {
      setTestResult('error');
      toast.error('Failed to connect to backend');
    } finally {
      setTesting(false);
    }
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
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-xs text-muted-foreground">Configure your experience</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Audio Settings */}
        <Card className="mb-6 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Audio Settings</CardTitle>
            <CardDescription>
              Control how audio responses are played
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoplay">Autoplay Tutor Responses</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play audio when the tutor responds
                </p>
              </div>
              <Switch
                id="autoplay"
                checked={autoplayEnabled}
                onCheckedChange={toggleAutoplay}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backend Configuration */}
        <Card className="mb-6 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Backend Connection</CardTitle>
            <CardDescription>
              Configure your FastAPI backend URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backend-url">Backend URL</Label>
              <Input
                id="backend-url"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000"
              />
              <p className="text-xs text-muted-foreground">
                Changes require a page reload to take effect.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleTestConnection}
                disabled={testing || !backendUrl}
                variant="outline"
                className="gap-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              {testResult === 'success' && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              )}

              {testResult === 'error' && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Failed</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">IELTS Speaking Tips</CardTitle>
            <CardDescription>
              Make the most of your practice sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Keep recordings 15-30 seconds</p>
                  <p className="text-muted-foreground">
                    This mirrors real exam timing and helps the AI give better feedback.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Practice in a quiet environment</p>
                  <p className="text-muted-foreground">
                    Background noise can affect transcription accuracy.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Review AI corrections carefully</p>
                  <p className="text-muted-foreground">
                    Understanding why something is wrong helps you remember the fix.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Export and review sessions</p>
                  <p className="text-muted-foreground">
                    Track your progress over time to see improvement patterns.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
