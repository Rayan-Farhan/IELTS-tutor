# app/tts.py
"""
Lightweight TTS using gTTS (Google Translate TTS).

This replaces the heavy Coqui TTS dependency with gTTS which produces an MP3 file.
Pros: small package, quick integration. Cons: requires network access and uses
Google Translate TTS (suitable for demos and low-volume use).
"""
import os
from gtts import gTTS


def speak_text(text: str, session_id: str) -> str:
    """
    Converts tutor's text response into speech using gTTS and writes an MP3 file.
    Returns path to generated .mp3 file or empty string on error.
    """
    os.makedirs("data/output_audio", exist_ok=True)

    filename = f"tutor_reply_{session_id}.mp3"
    output_path = os.path.join("data/output_audio", filename)

    try:
        tts = gTTS(text=text, lang="en")
        tts.save(output_path)
    except Exception as e:
        print(f"⚠️ TTS Error (gTTS): {e}")
        return ""

    return output_path