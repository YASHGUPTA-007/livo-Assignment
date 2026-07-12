# Livo AI: System Architecture & Data Compliance

## 1. System Architecture

Livo AI operates on a modern, serverless Next.js architecture designed for ultra-low latency audio processing and immediate pronunciation feedback.

### Component Diagram

```mermaid
graph TD
    Client[Client Browser (React/Next.js)]
    AudioRecorder[Audio Recorder Component]
    Backend[Next.js API Routes / Serverless Edge]
    
    subscript_api[GET /api/generate-script]
    analyze_api[POST /api/analyze]
    
    GroqLLM[Groq API: Llama 3.3 70B]
    GroqWhisper[Groq API: Whisper Large V3 Turbo]
    CMUDict[(CMU Pronouncing Dictionary)]
    DiffEngine[Levenshtein Diffing Engine]

    Client <--> |1. Request Practice Script| subscript_api
    subscript_api <--> |Generate targeted text| GroqLLM
    
    Client --> |2. Record & Upload Audio Blob| AudioRecorder
    AudioRecorder --> |3. Send WebM Buffer & Script| analyze_api
    
    analyze_api --> |4. Transcribe| GroqWhisper
    analyze_api --> |5. Align Text| DiffEngine
    analyze_api --> |6. Phoneme Lookup| CMUDict
    analyze_api <--> |7. Batch Generate Feedback| GroqLLM
    
    analyze_api --> |8. Return Score & Diff| Client
```

### Request Flow
1. **Script Generation**: The client requests a practice script. The server calls Groq (Llama 3) to generate a tailored sentence.
2. **Audio Capture**: The user records audio in the browser via the MediaRecorder API.
3. **Transcription**: The raw WebM audio buffer is sent to the `/api/analyze` route and immediately forwarded to Groq's Whisper API for text extraction.
4. **Analysis Pipeline**:
   - The transcript is normalized (punctuation and casing removed).
   - A Levenshtein Dynamic Programming algorithm aligns the spoken transcript against the expected script.
   - For every missed or substituted word, the CMU dictionary retrieves the exact ARPAbet phonemes.
   - A batched LLM prompt is sent to Llama 3 to act as a phonetics coach and provide specific mouth/tongue tips.
5. **Client Rendering**: The server returns the final score and exact word-level diffs to update the UI instantly.

---

## 2. Models and APIs Used

We prioritize absolute minimal latency for a seamless user experience. 

- **Speech-to-Text: Groq API (Whisper-large-v3-turbo)**
  - *Why over alternatives:* Traditional Whisper deployments (OpenAI API or self-hosted) suffer from high latency (often 2-4 seconds for short clips). Groq's LPU architecture runs Whisper in hundreds of milliseconds, making real-time voice interaction viable without maintaining our own expensive GPU clusters.
- **Feedback Generation: Groq API (Llama-3.3-70b-versatile)**
  - *Why over alternatives:* We need deep linguistic understanding to generate phonetic tips (e.g., explaining how to position the tongue for a 'th' sound). Llama 3 70B provides GPT-4 level instruction following, but running it on Groq reduces the TTFT (Time to First Token) to nearly zero. We batch all flagged words into a single prompt to save network round-trips.
- **Phoneme Dictionary: cmu-pronouncing-dictionary (Local Node Module)**
  - *Why over alternatives:* Instead of asking an LLM to guess phonetic breakdowns (which causes hallucinations), we use a deterministic, offline linguistic standard (ARPAbet) embedded directly in the serverless function.

---

## 3. Scoring & Highlight Logic

The system does not rely on opaque "AI black boxes" to score pronunciation. It uses deterministic alignment:

1. **Normalization**: Both the expected script and Whisper's transcript are stripped of punctuation, numbers are converted to words, and everything is lowercased.
2. **Levenshtein Alignment**: A custom Dynamic Programming algorithm maps the transcript to the script, identifying exact matches, *insertions*, *deletions* (missed words), and *substitutions* (mispronounced words).
3. **Highlighting**: Any word flagged as missed or substituted is highlighted in red on the frontend. The exact mismatch index is passed to the client so the UI can draw strike-throughs or highlight specific syllables.
4. **Scoring Math**: The score is a strict percentage of correctly pronounced words. 
   - `penalty = missed_words + substituted_words`
   - `Score = Math.max(0, 100 - (penalty / total_expected_words) * 100)`

---

## 4. DPDP Act (2023) Compliance

Livo AI is engineered with a **"Privacy by Design"** and **"Zero Retention"** architecture, ensuring absolute compliance with India’s Digital Personal Data Protection (DPDP) Act 2023.

### Storage & Retention (Zero Data Footprint)
- **In-Memory Processing**: When a user submits audio, the WebM blob is parsed entirely in server RAM as a `Buffer`. 
- **No Databases**: The audio file is **never written to disk, databases, or cloud buckets (like S3)**. 
- **Immediate Deletion**: The moment the Groq Whisper API returns the transcript, the audio buffer goes out of scope and is destroyed by Node.js garbage collection. There is absolutely no retention of biometric (voice) data post-request.

### Notice, Consent & Transparency
- **Contextual Consent**: Under the DPDP Act, personal data can be processed for the specific purpose for which the Principal (user) voluntarily provided it. By clicking "Hit Record" and allowing microphone access, the user provides explicit, contextual consent for their audio to be evaluated.
- **Transparency (Legal Pages)**: The platform includes dedicated `/privacy` and `/terms` routes linked in the global footer. These pages explicitly outline the zero-retention policy, the use of third-party sub-processors (Groq), and user rights, ensuring the platform fulfills the DPDP Act's requirement for clear, accessible privacy notices.
- **Purpose Limitation**: Data is processed solely for pronunciation scoring. It is not used for model training, analytics, or marketing.

### Data Residency & Sub-processors
- **Cross-Border Transfer**: The DPDP Act allows the transfer of personal data outside India unless restricted by specific government notifications. Livo AI routes audio streams to Groq's highly secure endpoints via encrypted TLS (HTTPS). 
- **Sub-processor Agreements**: Groq operates under strict enterprise compliance, ensuring the transient audio data they process for transcription is not stored or used to train their foundational models.

Because Livo AI acts as an ephemeral passthrough without retaining any PII (Personally Identifiable Information) or biometric data, it fundamentally minimizes the compliance overhead and security risks associated with the DPDP Act.
