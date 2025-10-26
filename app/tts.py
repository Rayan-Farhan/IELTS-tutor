import os
from gtts import gTTS


def speak_text(text: str, session_id: str) -> str:
    os.makedirs("data/output_audio", exist_ok=True)

    filename = f"tutor_reply_{session_id}.mp3"
    output_path = os.path.join("data/output_audio", filename)

    try:
        tts = gTTS(text=text, lang="en")
        tts.save(output_path)
    except Exception as e:
        print(f"TTS Error (gTTS): {e}")
        return ""

    return output_path