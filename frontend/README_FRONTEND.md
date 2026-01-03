# AI IELTS Tutor Frontend

A modern React + TypeScript frontend for IELTS speaking practice with AI-powered tutoring, real-time transcription, and interactive feedback.

## Features

- 🎤 **Audio Recording**: Browser-based audio capture with visual feedback
- 📝 **Real-time Transcription**: Powered by Whisper AI with confidence scores and word timestamps
- 🤖 **AI Tutoring**: Personalized feedback on grammar, vocabulary, and fluency
- 🔊 **Voice Responses**: Text-to-speech tutor responses for natural conversation
- 💾 **Session Management**: Export practice sessions as JSON or text files
- ⚡ **Fast Processing**: Optimized for local processing with Ollama

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom glacier theme
- **shadcn/ui** for beautiful, accessible components
- **React Router** for navigation
- **Custom Hooks** for audio recording, transcription, and chat

## Prerequisites

Before running the frontend, ensure you have:

1. **Node.js** (v18 or higher) and npm installed
2. **Backend running** at `http://127.0.0.1:8000` (or configure custom URL)
   - FastAPI server with ASR and chat endpoints
   - Whisper model for transcription
   - Ollama with a language model (e.g., llama2, mistral)
   - gTTS for text-to-speech

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the project root (or copy `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` if your backend is not running on the default URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AudioPlayer.tsx
│   ├── AudioRecorder.tsx
│   ├── ChatMessage.tsx
│   ├── Loader.tsx
│   ├── SessionControls.tsx
│   └── TranscriptViewer.tsx
├── hooks/              # Custom React hooks
│   ├── useAutoplay.ts
│   ├── useChatSession.ts
│   ├── useRecorder.ts
│   └── useTranscribe.ts
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page
│   ├── Transcribe.tsx  # Transcription page
│   ├── Session.tsx     # Practice session
│   ├── Settings.tsx    # Settings & config
│   └── NotFound.tsx    # 404 page
├── services/           # API services
│   ├── apiClient.ts
│   ├── asrService.ts
│   ├── chatService.ts
│   └── audioService.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles & design system
```

## Usage Guide

### Recording Audio

1. Navigate to **Try Transcription** or start a **Practice Session**
2. Click the microphone button to start recording
3. Speak clearly (2-5 seconds recommended for fast processing)
4. Click stop when finished
5. Review the audio and use it for transcription or send to tutor

### Transcription Page

- Record or upload audio files
- View transcription with confidence scores
- Edit transcript if needed
- See word-level timestamps
- Send to tutor for feedback

### Practice Session

- Type messages or use voice recording
- Get AI feedback on grammar and fluency
- Hear tutor responses (autoplay configurable)
- Export session history
- Reset and start new sessions

### Settings

- Toggle autoplay for tutor audio responses
- Test backend connectivity
- View performance optimization tips

## Backend API Endpoints

The frontend expects these endpoints from your FastAPI backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/asr/transcribe` | POST | Transcribe audio file (multipart/form-data) |
| `/api/chat/respond` | POST | Get tutor response (form-urlencoded) |
| `/api/audio/{filename}` | GET | Stream audio files (MP3) |

### Request Formats

**Transcribe Audio:**
```
POST /api/asr/transcribe
Content-Type: multipart/form-data

file: <audio blob/file>
```

**Chat Response:**
```
POST /api/chat/respond
Content-Type: application/x-www-form-urlencoded

user_input: <text>
session_id: <optional session id>
```

## Customization

### Change Backend Model

The backend uses Ollama for language generation. To use a different model:

1. Update your backend configuration (not the frontend)
2. Ensure the model is installed: `ollama pull <model-name>`

### Modify Theme

The glacier theme is defined in `src/index.css`. All colors use HSL format:

```css
:root {
  --primary: 200 98% 39%;
  --secondary: 215 24% 26%;
  /* ... more colors */
}
```

### Extend Components

All components use semantic design tokens. Create variants by:

1. Define new color tokens in `src/index.css`
2. Update component variants to use tokens
3. Never use direct color classes like `text-white`, `bg-blue-500`

## Performance Tips

- **Audio Length**: Keep recordings 2-5 seconds for fastest processing
- **Model Size**: Smaller Ollama models (7B) are faster than larger ones (13B, 70B)
- **GPU Acceleration**: Enable GPU support in backend for Whisper and Ollama
- **Browser**: Chrome/Edge provide best MediaRecorder support

## Troubleshooting

### Microphone Not Working

- Ensure browser has microphone permissions
- Use HTTPS or localhost (required for getUserMedia)
- Check browser console for permission errors

### Backend Connection Failed

- Verify backend is running: `http://127.0.0.1:8000/docs`
- Check VITE_API_BASE_URL in `.env`
- Test connection in Settings page

### Audio Not Playing

- Check audio file paths from backend
- Verify MP3 files are accessible
- Enable autoplay in Settings
- Check browser autoplay policies

### Low Transcription Confidence

- Speak clearly and at moderate pace
- Reduce background noise
- Keep audio between 2-5 seconds
- Re-record if confidence < -1.0

## Browser Support

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (some MediaRecorder limitations)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript strict mode enabled
- ESLint configured with React best practices
- Component-based architecture
- Custom hooks for business logic separation

## Extension Ideas

- **Waveform visualization** using Web Audio API
- **Dark mode** toggle (theme already supports it)
- **Session resume** from localStorage
- **PWA support** for offline capability
- **Grammar highlighting** with diff view
- **Progress tracking** over time

## License

This project is part of the AI IELTS Tutor system. See backend repository for full details.

## Support

For issues or questions:
1. Check the backend is running correctly
2. Review browser console for errors
3. Test API endpoints manually
4. Check this README for common solutions
