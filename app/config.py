# app/config.py
import torch

# Configuration constants
class Config:
    # Model choices
    ASR_MODEL = "small" if torch.cuda.is_available() else "tiny"  # Whisper
    LLM_MODEL = "mistral:7b-instruct"  # or "phi3:mini"
    TTS_MODEL = "tts_models/en/ljspeech/tacotron2-DDC"

    # File paths
    OUTPUT_DIR = "data/output_audio"
    INPUT_DIR = "data/input_audio"

    # Performance
    MAX_CONTEXT_TURNS = 6  # keep last 3 pairs of conversation