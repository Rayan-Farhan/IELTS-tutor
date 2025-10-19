# app/asr.py
import whisper
import tempfile
import os
import torch
from typing import Tuple, List

print("Loading Whisper model.")
model = whisper.load_model("small" if torch.cuda.is_available() else "tiny")
print("Whisper model loaded.")


def transcribe_audio(file) -> Tuple[str, float, List[dict]]:
    """
    Converts speech to text using Whisper.
    Returns transcribed text, average confidence, and word timestamps.
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(file.file.read())
        temp_path = temp_audio.name

    result = model.transcribe(temp_path)

    text = result["text"].strip()
    segments = result.get("segments", [])
    confidence = (
        sum([seg.get("avg_logprob", 0) for seg in segments]) / len(segments)
        if segments
        else 0
    )

    timestamps = [
        {"word": seg["text"].strip(), "start": seg["start"], "end": seg["end"]}
        for seg in segments
    ]

    os.remove(temp_path)

    return text, round(confidence, 2), timestamps