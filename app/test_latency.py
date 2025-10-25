# app/test_latency.py
import time
from app.asr import transcribe_audio
from app.chat import get_response
from app.tts import speak_text
from app.utils import measure_latency
import uuid
import types

# Mock an audio file input for ASR testing
class DummyFile:
    def __init__(self, path):
        self.file = open(path, "rb")

@measure_latency
def test_asr(audio_path):
    """
    Tests Speech-to-Text (ASR) latency.
    """
    file = DummyFile(audio_path)
    text, confidence, timestamps = transcribe_audio(file)
    file.file.close()
    print(f"🗣️ Transcribed Text: {text}")
    print(f"🎯 Confidence: {confidence}")
    return text

@measure_latency
def test_chat(session_id, text):
    """
    Tests LLM conversation latency.
    """
    response = get_response(session_id, text)
    print(f"💬 Tutor Response: {response}")
    return response

@measure_latency
def test_tts(response_text, session_id):
    """
    Tests Text-to-Speech (TTS) latency.
    """
    path = speak_text(response_text, session_id)
    print(f"🔊 Audio saved at: {path}")
    return path


if __name__ == "__main__":
    print("\n🚀 Starting End-to-End Latency Test...\n")

    session_id = str(uuid.uuid4())
    sample_audio = "data/input_audio/sample.wav"  # Put your test audio here

    start_time = time.time()

    # Test ASR
    text = test_asr(sample_audio)

    # Test Chat (grammar correction + tutor response)
    response = test_chat(session_id, text)

    # Test TTS (generate speech)
    audio_path = test_tts(response, session_id)

    total_time = time.time() - start_time
    print(f"\n⏱️ TOTAL PIPELINE LATENCY: {total_time:.2f} seconds.\n")