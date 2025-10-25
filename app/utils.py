# app/utils.py
import time
import os

def measure_latency(func):
    """
    Decorator to measure function execution time (for benchmarking).
    """
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"⏱️ {func.__name__} executed in {end - start:.2f} seconds.")
        return result
    return wrapper


def ensure_dir(path: str):
    """
    Ensures directory exists before saving files.
    """
    os.makedirs(path, exist_ok=True)
