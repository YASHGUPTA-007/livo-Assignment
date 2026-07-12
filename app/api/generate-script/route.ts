import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Approximate words per second for normal reading pace
const WORDS_PER_SECOND = 2.2;

export async function POST(req: NextRequest) {
  try {
    const { seconds, genre } = await req.json();

    if (!seconds || typeof seconds !== "number" || seconds < 15 || seconds > 120) {
      return NextResponse.json(
        { error: "seconds must be a number between 15 and 120" },
        { status: 400 }
      );
    }

    const targetWordCount = Math.round(seconds * WORDS_PER_SECOND);
    const genreInstruction = genre
      ? `The story should be a ${genre} story.`
      : "Pick a random genre (adventure, mystery, romance, sci-fi, horror, or comedy).";

    const prompt = `You are a creative storytelling assistant. Generate an engaging, vivid short story for an English pronunciation practice app.

Requirements:
- The story must be exactly around ${targetWordCount} words (±10 words) — do NOT go significantly over or under.
- ${genreInstruction}
- The story should be a single continuous paragraph — no line breaks, no headers, no bullets.
- Use varied vocabulary, good sentence rhythm, and clear pronunciation-friendly language.
- Make it engaging and interesting — the reader should be hooked from the first sentence.
- Do NOT include a title in the story text itself.
- Output ONLY the story paragraph. No preamble, no explanation, no title.

Generate the story now:`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      max_tokens: Math.round(targetWordCount * 2),
    });

    const storyText = completion.choices[0]?.message?.content?.trim();

    if (!storyText) {
      return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }

    // Determine difficulty based on seconds
    let difficulty: "Easy" | "Medium" | "Hard";
    if (seconds <= 30) {
      difficulty = "Easy";
    } else if (seconds <= 60) {
      difficulty = "Medium";
    } else {
      difficulty = "Hard";
    }

    // Generate a short title
    const titleCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give me a short, creative story title (3-5 words max) for this story. Return ONLY the title, nothing else:\n\n"${storyText.substring(0, 250)}..."`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 20,
    });

    const rawTitle = titleCompletion.choices[0]?.message?.content?.trim() || "AI Generated Story";

    return NextResponse.json({
      id: `ai-${Date.now()}`,
      title: rawTitle.replace(/^["']|["']$/g, ""),
      text: storyText,
      difficulty,
      wordCount: storyText.split(/\s+/).length,
      targetSeconds: seconds,
    });
  } catch (error: any) {
    console.error("Generate script error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
