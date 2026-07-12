import { toWords, toOrdinal } from "to-words";

// ─────────────────────────────────────────────────────────────────────────────
// normalize
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a text string so that two semantically identical strings compare
 * as equal regardless of capitalisation, punctuation, or how numbers are
 * written.
 *
 * Steps (applied in this exact order):
 *  1. Convert ordinal suffixes  →  "1st" → "first", "21st" → "twenty first"
 *  2. Convert remaining digit sequences  →  "20" → "twenty", "2026" → "two thousand twenty six"
 *  3. Lowercase
 *  4. Strip punctuation but **preserve apostrophes** so contractions stay intact
 *     ("don't" → "don't", NOT "dont" or "don t")
 *  5. Collapse runs of whitespace and trim
 *
 * @example
 *   normalize("Don't worry about 2026!")
 *   // → "don't worry about two thousand twenty six"
 *
 *   normalize("It's the 1st time.")
 *   // → "it's the first time"
 *
 *   normalize("I scored 100%!")
 *   // → "i scored one hundred"
 */
export function normalize(text: string): string {
  let s = text;

  // 1. Ordinals: "1st" / "2nd" / "3rd" / "21st" / "42nd" etc.
  //    toOrdinal(21, { localeCode: "en-US" }) → "Twenty First"
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)\b/gi, (_, digits) => {
    try {
      return toOrdinal(parseInt(digits, 10), { localeCode: "en-US" });
    } catch {
      return digits; // fallback: keep the raw digits
    }
  });

  // 2. Plain integer sequences: "20" → "Twenty", "2026" → "Two Thousand Twenty Six"
  //    toWords(2026, { localeCode: "en-US" }) → "Two Thousand Twenty Six"
  s = s.replace(/\b\d+\b/g, (match) => {
    try {
      return toWords(parseInt(match, 10), { localeCode: "en-US" });
    } catch {
      return match; // fallback: keep the raw digits
    }
  });

  // 3. Lowercase
  s = s.toLowerCase();

  // 4. Remove every character that is NOT a letter, digit, whitespace, or apostrophe.
  //    This strips periods, commas, exclamation marks, question marks, colons, hyphens,
  //    etc. while keeping apostrophes so "don't" → "don't" (not "dont" or "don t").
  s = s.replace(/[^a-z0-9\s']/g, " ");

  // 5. Collapse whitespace
  s = s.replace(/\s+/g, " ").trim();

  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// alignWords
// ─────────────────────────────────────────────────────────────────────────────

export type AlignType = "match" | "substituted" | "missed" | "inserted";

export interface AlignedPair {
  /**
   * The original word from the expected script at this position.
   * Null only for purely inserted words (no corresponding expected word).
   */
  expected: string | null;
  /**
   * The word the speaker actually said.
   * Null for words the speaker missed entirely.
   */
  actual: string | null;
  /** Alignment classification */
  type: AlignType;
  /**
   * Index of this expected word inside the `origExpected` array that was
   * passed to alignWords().  −1 for "inserted" pairs (no script counterpart).
   *
   * IMPORTANT: callers must pass the same tokenization that ResultsView uses
   * for `script.text`  (i.e. `text.split(/\b/).filter(w => /\w/.test(w))`)
   * so that this index maps correctly to highlight positions in the UI.
   */
  index: number;
}

/**
 * Align an expected and an actual word sequence using Levenshtein edit-distance
 * dynamic programming, then trace back a labelled alignment.
 *
 * The DP comparison runs on the **normalized** forms (`normExpected` /
 * `normActual`) so that e.g. "don't" in the script matches "don't" from
 * Whisper even if the casing differs.  Words stored in the returned
 * `AlignedPair` objects are always taken from the **original** arrays
 * (`origExpected` / `origActual`) so callers can display raw text without
 * any post-processing.
 *
 * ── Why this is correct when a word is skipped mid-sentence ──────────────
 *
 *   Expected:  ["the", "quick", "brown", "fox"]
 *   Actual:    ["the",          "brown", "fox"]   ← "quick" was skipped
 *
 *   Naive index-by-index comparison:
 *     actual[1]="brown" ≠ expected[1]="quick"  → WRONG flag
 *     actual[2]="fox"   ≠ expected[2]="brown"  → WRONG cascade
 *     (actual[3] missing)                       → WRONG cascade
 *
 *   This function (DP + traceback) produces:
 *     { expected:"the",   actual:"the",   type:"match"  , index:0 }
 *     { expected:"quick", actual:null,    type:"missed" , index:1 }
 *     { expected:"brown", actual:"brown", type:"match"  , index:2 }
 *     { expected:"fox",   actual:"fox",   type:"match"  , index:3 }
 *
 *   Only "quick" is flagged; "brown" and "fox" are correctly matched even
 *   though they shifted one position in the actual array.
 *
 * @param origExpected  Display words from the expected script (original casing/punct).
 * @param origActual    Display words from the Whisper transcript.
 * @param normExpected  Normalized forms of `origExpected`, **same length**.
 * @param normActual    Normalized forms of `origActual`, **same length**.
 */
export function alignWords(
  origExpected: string[],
  origActual: string[],
  normExpected: string[],
  normActual: string[]
): AlignedPair[] {
  const n = normExpected.length;
  const m = normActual.length;

  // ── Build the Levenshtein DP cost table ───────────────────────────────────
  // dp[i][j] = min edit distance between normExpected[0..i-1] and normActual[0..j-1]
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );
  for (let i = 0; i <= n; i++) dp[i][0] = i; // delete all expected words
  for (let j = 0; j <= m; j++) dp[0][j] = j; // insert all actual words

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (normExpected[i - 1] === normActual[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // exact match — zero cost
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j],     // deletion  → expected word missed
            dp[i][j - 1],     // insertion → extra word spoken
            dp[i - 1][j - 1]  // substitution → wrong word spoken
          );
      }
    }
  }

  // ── Traceback from dp[n][m] to dp[0][0] ──────────────────────────────────
  const pairs: AlignedPair[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normExpected[i - 1] === normActual[j - 1]) {
      // ── match ─────────────────────────────────────────────────────────────
      pairs.unshift({
        expected: origExpected[i - 1],
        actual: origActual[j - 1],
        type: "match",
        index: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      // ── substitution ──────────────────────────────────────────────────────
      pairs.unshift({
        expected: origExpected[i - 1],
        actual: origActual[j - 1],
        type: "substituted",
        index: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      // ── missed (expected word was skipped by the speaker) ─────────────────
      pairs.unshift({
        expected: origExpected[i - 1],
        actual: null,
        type: "missed",
        index: i - 1,
      });
      i--;
    } else {
      // ── inserted (extra word spoken that isn't in the script) ─────────────
      // Recorded here for completeness/counting but NOT forwarded to LLM
      // coaching because there is no script word to coach against.
      pairs.unshift({
        expected: null,
        actual: origActual[j - 1],
        type: "inserted",
        index: -1,
      });
      j--;
    }
  }

  return pairs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy shim — alignText() kept for any imports that haven't migrated yet.
// New code should call alignWords() directly.
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated — use alignWords() with explicit normalize() calls. */
export interface DiffResult {
  word: string;
  type: "correct" | "missing" | "substituted" | "extra";
  index: number;
}

/** @deprecated — use alignWords() instead. */
export function alignText(
  expectedText: string,
  actualText: string
): DiffResult[] {
  // Tokenize preserving the same boundaries ResultsView uses
  const origExp = expectedText.split(/\b/).filter((w) => /\w/.test(w));
  const origAct = actualText.split(/\b/).filter((w) => /\w/.test(w));
  const normExp = normalize(expectedText).split(/\s+/).filter(Boolean);
  const normAct = normalize(actualText).split(/\s+/).filter(Boolean);

  return alignWords(origExp, origAct, normExp, normAct)
    .filter((p) => p.type !== "inserted")
    .map((p) => ({
      word: p.expected ?? p.actual ?? "",
      type:
        p.type === "match"
          ? ("correct" as const)
          : p.type === "missed"
          ? ("missing" as const)
          : p.type === "substituted"
          ? ("substituted" as const)
          : ("extra" as const),
      index: p.index,
    }));
}
