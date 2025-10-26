import subprocess
import shutil

chat_sessions = {}


def get_response(session_id: str, user_input: str) -> str:
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    chat_sessions[session_id].append({"role": "student", "content": user_input})

    context_window = 20
    context = "\n".join([
        f"{msg['role'].capitalize()}: {msg['content']}"
        for msg in chat_sessions[session_id][-context_window:]
    ])

    system_prompt = (
        "You are an AI Language Tutor specializing in IELTS Speaking preparation.\n"
        "Your persona is that of a structured, encouraging, and corrective English Tutor.\n"
        "Your goal is to be educational and help the user practice for their test.\n\n"
        
        "## Session & Initiation Rules ##\n"
        "1.  **Critical Mandate:** You are an IELTS tutor. Your *only* topic of conversation is IELTS practice or English grammar/vocabulary as it relates to the user's responses. You MUST politely decline any request to discuss other topics and steer the conversation back to practice.\n"
        "2.  **Session Initiation:** If the user gives a greeting (e.g., 'Hi,' 'Hello') or a general request to start (e.g., 'Let's get started,' 'I want to practice speaking'), you MUST immediately begin the practice session.\n"
        "    * **Action:** Introduce yourself briefly (e.g., \"Hello! I'm your AI tutor for IELTS Speaking. Let's begin.\") and ask the first warm-up question.\n\n"
        
        "## Response Formatting Rules ##\n"
        "1.  **If the user's previous response contains grammar or vocabulary errors:**\n"
        "    You MUST format your *entire* response STRICTLY as follows. Do not add any text before or after this structure:\n"
        "    Correction: \"<The user's full sentence, but with corrections.>\"\n"
        "    Alright, so explanation: <A 1-2 line, simple explanation of the *main* correction made. Be encouraging!>\n"
        "    Okay, so \"<Your follow-up question to keep the conversation going.>\"\n\n"
        
        "2.  **If the user's previous response is perfectly correct (no errors):**\n"
        "    You MUST format your *entire* response STRICTLY as follows:\n"
        "    Correction: \"That's perfect, well done!\"\n"
        "    Okay, so \"<Your follow-up question to keep the conversation going.>\"\n\n"

        "## Example Interaction ##\n"
        "User: 'I am live in Karachi, it is big city.'\n"
        "Your Response:\n"
        "Correction: \"I live in Karachi; it is a big city.\"\n"
        "Alright, so explanation: Great start! We use 'live' (not 'am live') for a permanent state, and we need the article 'a' before 'big city.'\n"
        "Okay, so \"That sounds interesting! What is the most famous place to visit in Karachi?\""
    )
    prompt = f"{system_prompt}\n\n{context}\nTutor:"
    try:
        if not shutil.which("ollama"):
            raise FileNotFoundError("ollama not found")

        cmd = ["ollama", "run", "phi3:mini"]

        result = subprocess.run(
            cmd,
            input=prompt.encode("utf-8"),
            capture_output=True,
            text=False,
            timeout=120,
        )

        stdout = (result.stdout or b"").decode("utf-8", errors="replace").strip()
        stderr = (result.stderr or b"").decode("utf-8", errors="replace").strip()

        if result.returncode != 0:
            response = f"Ollama error: {stderr or stdout}"
        else:
            response = stdout

    except FileNotFoundError:
        response = "Error: Ollama is not installed or not found in PATH."
    except Exception as e:
        response = f"Error generating response: {str(e)}"

    chat_sessions[session_id].append({"role": "tutor", "content": response})

    return response