import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import * as mm from "music-metadata";
import { normalize, alignWords } from "@/lib/diffing";
import { dictionary as cmuDict } from "cmu-pronouncing-dictionary";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Prompt 2 — CMUdict phoneme lookup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Look up the ARPAbet phonemes for a word using CMU Pronouncing Dictionary.
 *
 * - Looks up the word in lowercase (primary entry only, not "(2)" variants).
 * - Strips stress-marker digits: "AA1" → "AA", "AH0" → "AH".
 * - Returns null if the word isn't in the dictionary (no throw, no crash).
 *
 * Example:
 *   getPhonemes("croissant") → "KW AA S AA N T"
 *   getPhonemes("hello")     → "HH AH L OW"
 *   getPhonemes("xyz123")    → null
 */
function getPhonemes(word: string): string | null {
  try {
    const key = word.toLowerCase().replace(/[^a-z']/g, "");
    if (!key) return null;

    const raw = cmuDict[key];
    if (!raw || typeof raw !== "string") return null;

    // Strip stress digits (0, 1, 2) from each phoneme token
    return raw
      .split(" ")
      .map((ph) => ph.replace(/[012]/g, ""))
      .join(" ");
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FlaggedEntry {
  expected_word: string;
  phonemes: string | null;
  heard_text: string | null;  // what Whisper heard at this position (null = missed)
  flag_type: "substituted" | "missed";
}

interface FeedbackItem {
  word: string;
  simple_phonetic: string;
  issue: string;
  tip: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt 4 — single batched Groq LLM call
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates pronunciation feedback for ALL flagged words in ONE Groq request.
 *
 * Returns an array of FeedbackItem (one per flagged word, same order).
 * Falls back gracefully if JSON parsing fails.
 */
async function generateBatchFeedback(
  entries: FlaggedEntry[],
  scriptText: string
): Promise<FeedbackItem[]> {
  if (entries.length === 0) return [];

  const entriesJson = JSON.stringify(entries, null, 2);

  // ── Single batched prompt ──────────────────────────────────────────────────
  //
  // Key instructions:
  //  • Act as a phonetics coach — focus on SOUNDS, not spelling.
  //  • Ignore any mismatch that looks like a number/formatting issue (post-
  //    normalization safety net).
  //  • Return a strict JSON ARRAY, one object per word, in the same order.
  //  • Cap issue and tip to ~25 words each.
  const prompt = `You are a phonetics and pronunciation coach helping a student improve their English speaking.

The student read this script aloud:
"${scriptText}"

Below is a JSON array of words they mispronounced or missed, along with:
- "expected_word": the word that should have been spoken
- "phonemes": ARPAbet phoneme sequence from CMU dict (stress markers stripped), or null if unknown
- "heard_text": what was actually transcribed by Whisper at that position, or null if the word was skipped entirely
- "flag_type": "substituted" (wrong word spoken) or "missed" (word skipped)

Flagged words (${entries.length} total):
${entriesJson}

IMPORTANT RULES:
1. Focus exclusively on SOUND differences, not spelling. If "heard_text" and "expected_word" differ only in formatting or numeral representation (e.g. "two" vs "2"), treat it as a match and give a neutral "Great effort!" tip.
2. Use the "phonemes" field (if present) to reference actual mouth/tongue/breath movements.
3. Keep each "issue" and "tip" under 25 words — be concrete and actionable.
4. For "simple_phonetic", give a casual English phonetic respelling (e.g. "kwah-SAHN", "heh-LO"). Use uppercase for the stressed syllable.
5. Return ONLY a raw JSON array — no markdown, no code fences, no explanation text outside the array.

Required output format (one object per flagged word, exact same order as input):
[
  {
    "word": "<expected_word>",
    "simple_phonetic": "<easy phonetic respelling>",
    "issue": "<one sentence: what sound was likely wrong>",
    "tip": "<one sentence: concrete mouth/tongue/breath instruction>"
  },
  ...
]`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      // Note: we do NOT use response_format: json_object here because we want
      // a JSON ARRAY at the top level, and the json_object mode would wrap it.
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // ── Safe JSON parsing ── strip markdown code fences if the model added them
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    let parsed: FeedbackItem[];
    try {
      parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    } catch (parseErr) {
      console.error("LLM JSON parse failed:", parseErr, "\nRaw:", raw.slice(0, 400));
      // Fallback: one generic item per entry
      return entries.map((e) => ({
        word: e.expected_word,
        simple_phonetic: e.expected_word,
        issue: `The word "${e.expected_word}" was ${e.flag_type === "missed" ? "skipped" : "mispronounced"}.`,
        tip: `Try saying "${e.expected_word}" slowly, one syllable at a time.`,
      }));
    }

    // Ensure same length as input (LLM occasionally drops items)
    return entries.map((e, i) => {
      const item = parsed[i];
      if (item && typeof item.word === "string") return item;
      return {
        word: e.expected_word,
        simple_phonetic: e.expected_word,
        issue: `The word "${e.expected_word}" was ${e.flag_type === "missed" ? "skipped" : "mispronounced"}.`,
        tip: `Focus on clearly pronouncing "${e.expected_word}".`,
      };
    });
  } catch (err) {
    console.error("Groq LLM error:", err);
    return entries.map((e) => ({
      word: e.expected_word,
      simple_phonetic: e.expected_word,
      issue: `The word "${e.expected_word}" was ${e.flag_type === "missed" ? "skipped" : "mispronounced"}.`,
      tip: `Focus on clearly pronouncing "${e.expected_word}".`,
    }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob;
    const scriptText = formData.get("scriptText") as string;

    if (!audioBlob || !scriptText) {
      return NextResponse.json(
        { error: "Audio and script are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await audioBlob.arrayBuffer());

    // ── 1. Server-side duration validation ───────────────────────────────────
    try {
      const metadata = await mm.parseBuffer(buffer, audioBlob.type || "audio/webm");
      const duration = metadata.format.duration || 0;
      if (duration < 13 || duration > 125) {
        return NextResponse.json(
          { error: `Audio duration (${Math.round(duration)}s) must be between 15 and 120 seconds.` },
          { status: 400 }
        );
      }
    } catch (err) {
      console.warn("Failed to parse audio duration, proceeding assuming client validation held", err);
    }

    // ── 2. Transcribe with Groq Whisper ──────────────────────────────────────
    const transcription = await groq.audio.transcriptions.create({
      file: new File([buffer], "audio.webm", { type: audioBlob.type || "audio/webm" }),
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
      timestamp_granularities: ["word", "segment"],
      language: "en",
    });

    const transcriptText = transcription.text;

    // ── 3. Normalize BOTH texts before comparison ─────────────────────────────
    const normScript     = normalize(scriptText);
    const normTranscript = normalize(transcriptText);

    // ── 4. Build word arrays ──────────────────────────────────────────────────
    // origExpected must match ResultsView.tsx tokenization exactly so indices
    // map correctly to highlighted positions.
    const origExpected = scriptText.split(/\b/).filter((w) => /\w/.test(w));
    const origActual   = transcriptText.split(/\b/).filter((w) => /\w/.test(w));
    const normExpWords = normScript.split(/\s+/).filter(Boolean);
    const normActWords = normTranscript.split(/\s+/).filter(Boolean);

    // ── 5. Align (Levenshtein DP) ─────────────────────────────────────────────
    const alignment = alignWords(origExpected, origActual, normExpWords, normActWords);

    // ── 6. Build flagged entries ──────────────────────────────────────────────
    // Collect structured data for each mismatch:
    //   • phoneme lookup runs ONLY on flagged words (not every word in the script)
    //   • "heard_text" captures what Whisper actually said at that position
    const flagEntries: (FlaggedEntry & { index: number })[] = [];

    for (const pair of alignment) {
      if (pair.type === "substituted" || pair.type === "missed") {
        // Phoneme lookup — only for flagged words
        const phonemes = getPhonemes(pair.expected!);
        flagEntries.push({
          expected_word: pair.expected!,
          phonemes,
          heard_text: pair.actual ?? null,
          flag_type: pair.type === "substituted" ? "substituted" : "missed",
          index: pair.index,
        });
      }
    }

    // ── 7. Single batched LLM call for all flagged words ─────────────────────
    const feedbackItems = await generateBatchFeedback(
      flagEntries.map(({ index: _idx, ...rest }) => rest), // strip internal index
      scriptText
    );

    // ── 8. Assemble flaggedWords for the API response ─────────────────────────
    // Shape must match FlaggedWord in ResultsView.tsx:
    //   { word, type, feedback, index }
    // We also attach simple_phonetic, issue, tip as bonus fields for the
    // updated feedback panel (ResultsView uses them if present).
    const flaggedWords = flagEntries.map((entry, i) => {
      const fb = feedbackItems[i];
      return {
        word:            entry.expected_word,
        type:            entry.flag_type === "missed" ? ("missing" as const) : ("substituted" as const),
        index:           entry.index,
        phonemes:        entry.phonemes,
        simple_phonetic: fb?.simple_phonetic ?? entry.expected_word,
        issue:           fb?.issue ?? "",
        tip:             fb?.tip  ?? "",
        // Legacy "feedback" field — combine issue + tip for backward compat
        feedback:        fb ? `${fb.issue} ${fb.tip}`.trim() : `Focus on clearly pronouncing "${entry.expected_word}".`,
      };
    });

    // ── 9. Compute score ──────────────────────────────────────────────────────
    const expectedWordCount = normExpWords.length;
    const penalty           = flaggedWords.length;
    const score             = Math.min(100, Math.max(0, 100 - (penalty / expectedWordCount) * 100));

    return NextResponse.json({ score, transcript: transcriptText, flaggedWords });

  } catch (error: any) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
