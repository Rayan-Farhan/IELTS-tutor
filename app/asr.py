import tempfile
import os
from typing import Tuple, List

import torch
import whisper

_model = None


def _get_model():
    global _model
    if _model is None:
        model_name = "small"
        print(f"Loading Whisper model: {model_name} ...")
        _model = whisper.load_model(model_name)
        print("Whisper model loaded.")
    return _model


def transcribe_audio(file) -> Tuple[str, float, List[dict]]:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(file.file.read())
        temp_path = temp_audio.name

    try:
        model = _get_model()

        result = model.transcribe(
            temp_path,
            language="en",
            task="transcribe",
            fp16=torch.cuda.is_available(),
            temperature=0.0,
            beam_size=5,
        )

        text = (result.get("text") or "").strip()
        segments = result.get("segments", []) or []
        confidence = (
            sum(seg.get("avg_logprob", 0.0) for seg in segments) / max(1, len(segments))
            if segments
            else 0.0
        )

        # Segment-level timestamps (word-level requires extra alignment)
        timestamps = [
            {
                "word": (seg.get("text") or "").strip(),
                "start": seg.get("start", 0.0),
                "end": seg.get("end", 0.0),
            }
            for seg in segments
        ]

        return text, round(float(confidence), 2), timestamps
    except FileNotFoundError as e:
        # Likely ffmpeg missing
        print(f"ASR Error (ffmpeg missing?): {e}")
        return "", 0.0, []
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass