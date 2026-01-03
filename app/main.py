from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.asr import transcribe_audio
from app.chat import get_response
from app.tts import speak_text
import uuid
import os

app = FastAPI(title="AI IELTS Tutor", version="1.0")

# Configure CORS to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    # Local dev: allow all origins to prevent CORS-related fetch failures.
    # (We are not using cookies/credentials here.)
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("data/output_audio", exist_ok=True)


@app.get("/api/health")
async def health_check():
    return {"ok": True}


@app.post("/api/asr/transcribe")
async def transcribe_api(file: UploadFile):
    text, confidence, timestamps = transcribe_audio(file)
    return {"text": text, "confidence": confidence, "timestamps": timestamps}


@app.post("/api/chat/respond")
async def chat_api(
    user_input: str = Form(...),
    session_id: str = Form(None)
):
    if not session_id:
        session_id = str(uuid.uuid4())

    response_text = get_response(session_id, user_input)

    audio_path = speak_text(response_text, session_id)
    
    # Return just the filename for the audio file
    filename = os.path.basename(audio_path) if audio_path else None

    return {
        "session_id": session_id,
        "response": response_text,
        "audio_file": filename
    }


@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    file_path = f"data/output_audio/{filename}"
    if os.path.exists(file_path):
        if filename.lower().endswith('.mp3'):
            return FileResponse(file_path, media_type="audio/mpeg")
        return FileResponse(file_path, media_type="audio/wav")
    return {"error": "File not found"}