# AI IELTS Tutor - Full-Stack Application

A local-first web app for practicing spoken English. Features a React frontend with real-time audio recording and a FastAPI backend powered by AI models (Whisper ASR + Ollama LLM + gTTS).

**Tech Stack:** React 18 • TypeScript • Vite • Tailwind • FastAPI • OpenAI Whisper • Ollama (phi3:mini) • gTTS

**Features:** Browser audio recording • Speech-to-text transcription • AI tutor feedback • TTS responses • Session management • Standalone transcription tool

<img width="1892" height="842" alt="image" src="https://github.com/user-attachments/assets/d8864d80-f45e-4c15-a8eb-452b656b07f4" />

<img width="1894" height="848" alt="image" src="https://github.com/user-attachments/assets/819750b9-4ae0-46fd-aca8-b34f5f52fa37" />


## Requirements

**Backend:** Python 3.10+ • ffmpeg (on PATH) • Ollama (with phi3:mini model)  
**Frontend:** Node.js 18+ • Modern browser (Chrome 49+, Firefox 29+, Safari 14.1+, Edge 79+)

Install dependencies from `requirements.txt` (fastapi, uvicorn, openai-whisper, torch, gTTS, python-multipart).


## Quick Start

### 1. Setup Backend
```powershell
# Install Python dependencies
pip install -r requirements.txt

# Install ffmpeg (ensure it's on PATH)
ffmpeg -version

# Install Ollama and pull model
ollama pull phi3:mini

# Run FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend runs at http://127.0.0.1:8000 (docs at /docs)

### 2. Setup Frontend
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

Configure backend URL in Settings page if needed (default: http://127.0.0.1:8000).


## API Endpoints

**GET /api/health** - Health check  
**POST /api/asr/transcribe** - Transcribe audio (multipart/form-data: file)  
**POST /api/chat/respond** - Get tutor response (form: user_input, session_id)  
**GET /api/audio/{filename}** - Stream audio file

Example transcribe:
```powershell
curl -X POST "http://127.0.0.1:8000/api/asr/transcribe" -F "file=@test.mp3"
```

Example chat:
```powershell
curl -X POST "http://127.0.0.1:8000/api/chat/respond" -d "user_input=Hello" -d "session_id="
```

See http://127.0.0.1:8000/docs for interactive API documentation.


## How It Works

1. **Record/Type** → User records audio or types message in Session page
2. **Transcribe** → Audio sent to ASR, converted to text
3. **Tutor Response** → Text sent to LLM with session context, gets feedback + MP3
4. **Playback** → MP3 automatically played (if autoplay enabled)

**Alternative:** Use Transcribe page for standalone audio→text conversion with word-level timestamps.


## Troubleshooting

**ffmpeg not found** → Install ffmpeg and add to PATH  
**Ollama errors** → Run `ollama pull phi3:mini` and verify with `ollama run phi3:mini "test"`  
**Slow ASR** → Use smaller Whisper model (`tiny`/`base`) in [app/asr.py](app/asr.py)  
**CORS errors** → Ensure backend is running, check backend URL in Settings  
**Microphone denied** → Grant browser permissions (HTTPS required for non-localhost)  
**Can't connect** → Verify backend at http://127.0.0.1:8000/api/health


## Configuration

Models are hard-coded for simplicity (no .env):
- **LLM:** `phi3:mini` in [app/chat.py](app/chat.py)
- **ASR:** `small` model in [app/asr.py](app/asr.py)
- **TTS:** gTTS (requires internet) in [app/tts.py](app/tts.py)
- **Audio output:** `data/output_audio/`


## Project Structure
```
app/                    # Backend (FastAPI)
  main.py               # API endpoints + CORS
  asr.py                # Whisper ASR (model: small)
  chat.py               # Ollama LLM (phi3:mini)
  tts.py                # gTTS for MP3 output
  test_latency.py       # E2E benchmarking

frontend/               # Frontend (React + TypeScript)
  src/
    pages/              # Index, Session, Transcribe, Settings
    components/         # AudioRecorder, AudioPlayer, ChatMessage, etc.
    services/           # API client, ASR, chat, audio services
    hooks/              # useChatSession, useRecorder, useTranscribe
    types/              # TypeScript definitions

data/output_audio/      # Generated MP3 files
```

**Pages:**  
• **Index** - Landing page with IELTS marketing  
• **Session** - Practice chat with audio recording  
• **Transcribe** - Standalone transcription tool  
• **Settings** - Backend URL & autoplay config
