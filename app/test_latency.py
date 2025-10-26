import time
import uuid
from app.asr import transcribe_audio
from app.chat import get_response
from app.tts import speak_text

def measure_latency(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} executed in {end - start:.2f} seconds.")
        return result
    return wrapper

class DummyFile:
    def __init__(self, path):
        self.file = open(path, "rb")

@measure_latency
def test_asr(audio_path):
    file = DummyFile(audio_path)
    text, confidence, timestamps = transcribe_audio(file)
    file.file.close()
    print(f"Transcribed Text: {text}")
    print(f"Confidence: {confidence}")
    return text

@measure_latency
def test_chat(session_id, text):
    response = get_response(session_id, text)
    print(f"Tutor Response: {response}")
    return response

@measure_latency
def test_tts(response_text, session_id):
    path = speak_text(response_text, session_id)
    print(f"Audio saved at: {path}")
    return path

if __name__ == "__main__":
    print("\nStarting End-to-End Latency Test...\n")

    session_id = str(uuid.uuid4())
    sample_audio = "data/input_audio/test2.mp3"

    start_time = time.time()

    # Test ASR
    text = test_asr(sample_audio)

    # Test Chat
    response = test_chat(session_id, text)

    # Test TTS
    audio_path = test_tts(response, session_id)

    total_time = time.time() - start_time
    print(f"\nTOTAL PIPELINE LATENCY: {total_time:.2f} seconds.\n")