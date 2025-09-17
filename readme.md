Build a web-based AI chat agent with voice input and output that users can interact with directly on a website.

Requirements:

The agent should accept microphone input → convert it to text using Speech-to-Text (STT).

The text query is sent to an AI model API (like OpenAI, Anthropic, or Gemini).

The AI model response should be:

Displayed as text in the chat window.

Converted into speech using Text-to-Speech (TTS) and played back to the user.

Provide a simple chat UI with:

A chat bubble interface (user + agent messages).

A microphone button to start/stop listening.

A fallback text input box for typing.

Must be responsive and embeddable in any website.

Use HTML, Tailwind CSS, and JavaScript (vanilla or small library).

Tech Stack Suggestions:

Speech-to-Text (STT): Web Speech API (for browsers) or external API (e.g., OpenAI Whisper, Google STT).

Text-to-Speech (TTS): Web Speech API’s speechSynthesis or external service like ElevenLabs.

AI Model API: OpenAI GPT-4, GPT-4o-mini, or any LLM of choice.

Deliverables:

index.html → Chat UI with mic + text input.

style.css (or Tailwind inline classes).

script.js → Handles STT, API calls, and TTS playback.

Configurable API key section.

Extra Features (Optional):

Store conversation history.

Add typing animation for AI responses.

Auto-scroll chat window.

Option to mute/unmute voice output.

Example User Flow:

User clicks mic → speaks: “What services do you offer?”

STT transcribes → text query sent to AI API.

AI responds → text shown + spoken aloud.

User can continue via mic or text input.