// Landing page for the AI IELTS Tutor - targeting students struggling with IELTS preparation

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MessageSquare, 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Headphones,
  FileText,
  Users,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">IELTS Tutor</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/session">Start Practice</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered IELTS Speaking Practice
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Struggling with IELTS Speaking?
            <span className="mt-2 block text-primary">We've Got You Covered</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Practice anytime, get instant feedback on your grammar and fluency, 
            and build the confidence you need to ace Band 7+
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link to="/session">
                Start Free Practice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/transcribe">Test Your Pronunciation</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No signup required • Practice unlimited • Runs locally on your device
          </p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-16">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            Sound Familiar?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Most IELTS students face these challenges. You're not alone.
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">"I freeze under pressure"</h3>
              <p className="text-sm text-muted-foreground">
                Blanking out during the exam because you haven't practiced enough real conversations
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <MessageSquare className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">"No one to practice with"</h3>
              <p className="text-sm text-muted-foreground">
                Finding a practice partner who can give proper feedback is nearly impossible
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">"Stuck at Band 5.5-6"</h3>
              <p className="text-sm text-muted-foreground">
                Making the same grammar mistakes repeatedly without knowing how to improve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Your Personal AI Speaking Coach
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get the feedback you need to improve, available 24/7 without judgment
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Speak Naturally</h3>
                <p className="mb-4 text-muted-foreground">
                  Record your responses just like in the real exam. Our AI transcribes 
                  every word using advanced speech recognition.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Browser-based recording, no app needed
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Accurate transcription with confidence scores
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Get Instant Corrections</h3>
                <p className="mb-4 text-muted-foreground">
                  Our AI tutor identifies grammar mistakes, suggests better vocabulary, 
                  and helps you sound more fluent.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Detailed grammar explanations
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Band score improvement tips
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Listen & Learn</h3>
                <p className="mb-4 text-muted-foreground">
                  Hear how your corrected sentences should sound. Train your ear 
                  while improving your speaking.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Audio playback of tutor responses
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Natural conversation flow
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Track Your Progress</h3>
                <p className="mb-4 text-muted-foreground">
                  Export your practice sessions and review your improvements over time. 
                  See how far you've come.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Export as JSON or text
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Review past corrections
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
              Start Practicing in 3 Steps
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              No complicated setup. Just click and start speaking.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">Hit Record</h3>
                  <p className="text-muted-foreground">
                    Click the microphone and speak your answer. Try to keep it 15-30 seconds 
                    like in the real IELTS speaking test.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">Review Your Transcript</h3>
                  <p className="text-muted-foreground">
                    See exactly what you said, word for word. Notice filler words, 
                    incomplete sentences, or pronunciation issues.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">Get AI Feedback</h3>
                  <p className="text-muted-foreground">
                    Receive instant corrections with explanations. Learn the right way to 
                    express your ideas and build better speaking habits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="mb-6 text-xl font-medium md:text-2xl">
            "I was stuck at Band 6 for months. After practicing with AI feedback every day, 
            I finally understood my grammar mistakes and got Band 7.5!"
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Users className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold">IELTS Test Taker</p>
              <p className="text-sm text-muted-foreground">Improved from 6.0 to 7.5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Before You Start</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Ensure your backend server is running (default: http://127.0.0.1:8000)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Use Chrome, Firefox, Edge, or Safari for best microphone support</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Find a quiet place to practice for accurate transcription</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Break Through Your IELTS Speaking Barrier?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Every minute you wait is a minute you could be improving. Start now.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/session">
                Start Practicing Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>AI IELTS Tutor • Practice speaking with confidence</p>
            <div className="flex gap-4">
              <Link to="/settings" className="hover:text-foreground">Settings</Link>
              <Link to="/transcribe" className="hover:text-foreground">Transcription</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
