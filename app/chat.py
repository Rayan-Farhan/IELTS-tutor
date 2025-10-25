# app/chat.py
import subprocess
import uuid

chat_sessions = {}


def get_response(session_id: str, user_input: str) -> str:
    """
    Handles multi-turn conversation and grammar correction.
    Returns the tutor's reply text.
    """

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    chat_sessions[session_id].append({"role": "student", "content": user_input})

    # context:  last 20 exchanges max
    context_window = 20
    context = "\n".join([
        f"{msg['role'].capitalize()}: {msg['content']}"
        for msg in chat_sessions[session_id][-context_window:]
    ])

    system_prompt = """
        You are an IELTS English Tutor.
        Your job:
        1. Correct the student's grammar and vocabulary mistakes.
        2. Explain briefly why the correction was made (1–2 lines).
        3. Continue the conversation naturally about IELTS or daily topics.
        4. Keep tone polite, encouraging, and educational.
        Example format:
        Corrected: "<correct sentence>"
        Explanation: "<short explanation>"
        Continue: "<next question or comment>"
    """

    prompt = f"{system_prompt}\n\n{context}\nTutor:"

    print("🧠 Running Ollama command...")
    print(["ollama", "run", "phi3:mini", prompt])

    # Ollama Phi-3-mini
    try:
        result = subprocess.run(
            ["ollama", "run", "phi3:mini", prompt],
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode != 0:
            response = f"Ollama error: {result.stderr.strip() or result.stdout.strip()}"
        else:
            response = result.stdout.strip()

    except FileNotFoundError:
        response = (
            "Error: Ollama is not installed or not found in PATH. "
        )
    except Exception as e:
        response = f"Error generating response: {str(e)}"

    chat_sessions[session_id].append({"role": "tutor", "content": response})

    return response