# app/main.py
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from app.asr import transcribe_audio
from app.chat import get_response
from app.tts import speak_text
import uuid
import os

app = FastAPI(title="AI IELTS Tutor", version="1.0")

# Create output folders if they don't exist
os.makedirs("data/output_audio", exist_ok=True)


@app.post("/api/asr/transcribe")
async def transcribe_api(file: UploadFile):
    """
    1️⃣ Accepts an audio file (.wav or .mp3)
    2️⃣ Transcribes it using Whisper
    3️⃣ Returns text, confidence, timestamps
    """
    text, confidence, timestamps = transcribe_audio(file)
    return {"text": text, "confidence": confidence, "timestamps": timestamps}


@app.post("/api/chat/respond")
async def chat_api(
    user_input: str = Form(...),
    session_id: str = Form(None)
):
    """
    1️⃣ Takes user's text input
    2️⃣ Gets grammar-corrective response from LLM
    3️⃣ Converts response to speech (TTS)
    4️⃣ Returns both text + audio file
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    # Get corrected + educational response
    response_text = get_response(session_id, user_input)

    # Convert tutor’s reply to voice
    audio_path = speak_text(response_text, session_id)

    return {
        "session_id": session_id,
        "response": response_text,
        "audio_file": audio_path
    }


@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    """
    Endpoint to serve generated audio replies.
    """
    file_path = f"data/output_audio/{filename}"
    if os.path.exists(file_path):
        # Serve MP3 or WAV depending on file extension
        if filename.lower().endswith('.mp3'):
            return FileResponse(file_path, media_type="audio/mpeg")
        return FileResponse(file_path, media_type="audio/wav")
    return {"error": "File not found"}