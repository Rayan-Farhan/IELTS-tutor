# AI IELTS Tutor (FastAPI)

A local-first FastAPI service that provides:
- Speech-to-Text (ASR) using Whisper
- Conversational English tutor using a local LLM via Ollama
- Text-to-Speech (TTS) using gTTS (MP3 output)

This project is designed to help students practice spoken English for exams like IELTS/TOEFL by transcribing their speech, providing corrected feedback, and speaking the tutor’s response back.


## Features
- REST APIs
  - POST /api/asr/transcribe — transcribe an audio file to text
  - POST /api/chat/respond — return an English-tutor response and generate MP3 audio
  - GET /api/audio/{filename} — download generated audio replies
- Session memory for multi-turn conversation
- Deterministic English ASR settings for short clips (CPU-friendly)
- Small LLM option (phi3:mini) to minimize disk usage


## Architecture Summary
- FastAPI app in `app/main.py`
- ASR in `app/asr.py` (OpenAI Whisper via `openai-whisper`)
- Chat in `app/chat.py` (runs a local model through Ollama CLI; default: `phi3:mini`)
- TTS in `app/tts.py` (uses `gTTS` to produce MP3 files)
- Benchmark harness in `app/test_latency.py`

Generated audio files are saved under `data/output_audio/`.


## Requirements
- Python 3.10+ recommended
- pip packages (from `requirements.txt`):
  - fastapi
  - uvicorn
  - openai-whisper
  - torch
  - gTTS
- Also required:
  - `python-multipart` (for FastAPI file uploads)
  - `ffmpeg` (binary on PATH, required by Whisper)
  - `Ollama` with a pulled local model (default: `phi3:mini`)

Install extra Python deps:
```powershell
pip install python-multipart
```

### Install ffmpeg (Windows)
- Install and ensure `ffmpeg` is on your PATH. After installation, open a new PowerShell and verify:
```powershell
ffmpeg -version
```
If not found, add the ffmpeg `bin` directory to your user PATH and restart the shell.

### Install Ollama + pull a model
- Install Ollama for Windows from the official site.
- Pull a small model to save disk space:
```powershell
ollama pull phi3:mini
```
Verify and test:
```powershell
ollama run phi3:mini "Hello"
```


## Run the server
From the project root (where the `app/` folder is):
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Open the interactive docs:
- http://127.0.0.1:8000/docs


## API Usage

### 1) POST /api/asr/transcribe
Transcribe an audio file. Supported formats depend on ffmpeg (wav/mp3/m4a, etc.).

Request (multipart/form-data):
- file: audio file to transcribe

PowerShell example:
```powershell
curl -X POST "http://127.0.0.1:8000/api/asr/transcribe" ^
  -H "accept: application/json" ^
  -H "Content-Type: multipart/form-data" ^
  -F "file=@data\input_audio\test.mp3"
```

Response (JSON):
```json
{
  "text": "Hello, my name is ABC.",
  "confidence": -0.12,
  "timestamps": [
    { "word": "Hello, my name is ABC.", "start": 0.0, "end": 2.6 }
  ]
}
```
Notes:
- ASR is configured for English with deterministic decoding to improve short-clip accuracy.
- If you see an ffmpeg error, ensure ffmpeg is installed and on PATH.


### 2) POST /api/chat/respond
Generate an English-tutor response and synthesize it to MP3.

Request (application/x-www-form-urlencoded):
- user_input: string (student message)
- session_id: optional string (UUID); if omitted a new session is created

PowerShell example:
```powershell
curl -X POST "http://127.0.0.1:8000/api/chat/respond" ^
  -H "accept: application/json" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "user_input=My name ABC studying in XYZ University Karachi" -d "session_id="
```

Response (JSON):
```json
{
  "session_id": "<uuid>",
  "response": "Corrected: \"My name is ABC, and I study at XYZ University in Karachi.\"\nExplanation: Keep the proper noun capitalization and add the correct verb form for clarity.\nContinue: \"What field are you studying, and why did you choose it?\"",
  "audio_file": "data/output_audio/tutor_reply_<uuid>.mp3"
}
```
Notes:
- This uses the local Ollama CLI. If Ollama or the model is missing, you will receive a clear error message string in `response`.
- The default model is `phi3:mini` to minimize disk usage.


### 3) GET /api/audio/{filename}
Download a generated audio reply.

Example:
```powershell
curl "http://127.0.0.1:8000/api/audio/tutor_reply_<uuid>.mp3" --output reply.mp3
```


## Integration Guide
This section outlines a typical client flow (web or mobile) to integrate with the APIs.

1) Record or pick an audio clip
- Prefer mono, 16 kHz PCM WAV for best accuracy (ffmpeg handles conversion automatically when reading). Short clips of 2–5 seconds produce better results than very short phrases.

2) Transcribe
- Send the audio to `/api/asr/transcribe`.
- Use the `text` from the response as the student’s message.

3) Get tutor feedback + audio
- POST the student text to `/api/chat/respond` with an optional `session_id` to maintain context.
- Save the returned `audio_file` path; fetch it via `/api/audio/{filename}` to play back the tutor’s voice.


## Testing and Benchmarking
A quick end-to-end latency test is provided. From project root:
```powershell
python -m app.test_latency
```
Make sure `data/input_audio/test.mp3` (or your custom path in the script) exists.

On CPU, Whisper `small` can take ~10–30 seconds depending on hardware. If latency is too high for your machine, switch to a smaller model (`tiny`/`base`) in `app/asr.py` or consider migrating to `faster-whisper` for significant CPU speedups.


## Troubleshooting
- ffmpeg not found
  - Ensure ffmpeg is installed and on PATH. Verify with `ffmpeg -version` in a new PowerShell.
- Ollama not found or model missing
  - Install Ollama and run `ollama pull phi3:mini`. Verify with `ollama run phi3:mini "Hello"`.
- gTTS errors
  - gTTS requires internet access. If you need offline TTS, swap `app/tts.py` to a local engine (e.g., Piper or pyttsx3).
- Slow ASR
  - Use a smaller Whisper model or `faster-whisper` for CPU.


## Configuration Notes
This project intentionally avoids `.env` for simplicity. Model choices are hard-coded:
- Chat model: `phi3:mini` in `app/chat.py` (Ollama CLI)
- ASR model size: `small` in `app/asr.py` (set to `tiny` if your CPU is slow)
- TTS: gTTS in `app/tts.py` (outputs MP3 to `data/output_audio/`)

Adjust these in-code as needed for your environment.


## Project Structure
```
requirements.txt
app/
  __init__.py
  asr.py          # Whisper ASR wrapper
  chat.py         # LLM via Ollama (phi3:mini by default)
  main.py         # FastAPI endpoints
  test_latency.py # E2E latency test harness
  tts.py          # gTTS wrapper (MP3 output)
```