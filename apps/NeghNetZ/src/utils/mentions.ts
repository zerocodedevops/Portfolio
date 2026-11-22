/**
 * Utilities for @mention support in the community board (Tablón de Avisos).
 *
 * All helpers are pure functions with no side-effects so they are easily testable
 * and can be used both in rendering and in the form submission flow.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Normalise a string for accent/case-insensitive comparison (preserving letters/numbers). */
export function normalise(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}

/**
 * Common words that should not be absorbed into an unquoted mention name
 * when followed by another word (conjunctions, prepositions, articles, punctuation, etc.).
 */
const STOP_WORDS = new Set([
  'y', 'e', 'o', 'u', 'de', 'del', 'en', 'con', 'por', 'para', 'a',
  'que', 'revisa', 'revisen', 'mira', 'hola', 'saludos', 'gracias',
  'como', 'cómo', 'estas', 'estás'
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** A segment of text, flagged as a mention or plain text. */
export interface TextSegment {
  text: string;
  mention: boolean;
}

/**
 * Split `text` into alternating plain / mention segments for rendering.
 * Returns an empty array for an empty string.
 */
export function splitMentions(text: string, knownNames?: string[]): TextSegment[] {
  if (!text) return [];

  const sortedKnownNames = knownNames
    ? [...knownNames].sort((a, b) => b.length - a.length)
    : [];

  const segments: TextSegment[] = [];
  let currentIndex = 0;

  // Candidate regex for finding '@' occurrences
  const atRegex = /(?:^|(?<=\s))@([\p{L}][\p{L}\d_-]*(?:\s+[\p{L}\d_-]+)*)/gu;

  let match: RegExpExecArray | null;
  while ((match = atRegex.exec(text)) !== null) {
    const atIndex = match.index;
    const rawTokens = match[1].split(/\s+/);

    let chosenName: string | null = null;

    if (sortedKnownNames.length > 0) {
      const remainingFromAt = text.slice(atIndex + 1);
      for (const known of sortedKnownNames) {
        if (remainingFromAt.toLowerCase().startsWith(known.toLowerCase())) {
          const charAfter = remainingFromAt[known.length];
          if (!charAfter || /[\s,.;:!?)]/.test(charAfter)) {
            chosenName = remainingFromAt.slice(0, known.length);
            break;
          }
        }
      }
    }

    if (!chosenName) {
      // Collect up to 3 words, stopping at punctuation, lowercase continuations or stop words
      const words: string[] = [rawTokens[0]];
      for (let i = 1; i < Math.min(rawTokens.length, 3); i++) {
        const w = rawTokens[i];
        const normW = normalise(w);
        if (STOP_WORDS.has(normW)) break;
        // Non-capitalized words in Spanish generally are not part of first/last names
        const isCapitalized = /^\p{Lu}/u.test(w);
        if (!isCapitalized) break;
        words.push(w);
      }
      chosenName = words.join(' ');
    }

    // Strip trailing punctuation (like comma, period, exclamation mark)
    chosenName = chosenName.replace(/[^\p{L}\p{N}]+$/u, '');

    if (!chosenName) continue;

    const mentionText = `@${chosenName}`;
    const startPos = atIndex;
    const endPos = atIndex + mentionText.length;

    if (startPos > currentIndex) {
      segments.push({ text: text.slice(currentIndex, startPos), mention: false });
    }

    segments.push({ text: mentionText, mention: true });
    currentIndex = endPos;
    atRegex.lastIndex = endPos;
  }

  if (currentIndex < text.length) {
    segments.push({ text: text.slice(currentIndex), mention: false });
  }

  return segments;
}

/**
 * Extract unique mention names from `text`.
 * Returns names WITHOUT the leading @, deduplicated, preserving first-seen order.
 *
 * @example
 * parseMentions('Hola @Juan Pérez y @Ana García') // ['Juan Pérez', 'Ana García']
 */
export function parseMentions(text: string, knownNames?: string[]): string[] {
  const segments = splitMentions(text, knownNames);
  const seen = new Set<string>();
  const results: string[] = [];

  for (const seg of segments) {
    if (seg.mention) {
      const name = seg.text.slice(1).trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        results.push(name);
      }
    }
  }

  return results;
}

/**
 * Given a map of `uid → displayName` and an array of mention tokens (without @),
 * return the UIDs of the users that were mentioned.
 */
export function resolveUidsFromNames(
  tokens: string[],
  uidToName: Record<string, string>,
): string[] {
  if (tokens.length === 0) return [];

  const normalisedMap: Array<{ uid: string; norm: string }> = Object.entries(uidToName).map(
    ([uid, name]) => ({ uid, norm: normalise(name) }),
  );

  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of tokens) {
    const normToken = normalise(token);
    const entry = normalisedMap.find((item) => item.norm === normToken);
    if (entry && !seen.has(entry.uid)) {
      seen.add(entry.uid);
      result.push(entry.uid);
    }
  }

  return result;
}

/**
 * Filter `names` by a typed prefix (the part after @).
 * Matching is case-insensitive and accent-insensitive.
 * If query starts with exact letters without accent, exact non-accented match can be prioritized,
 * but otherwise prefix match is used.
 * Returns at most 5 results. Returns [] for an empty query.
 */
export function buildMentionFilter(query: string, names: string[]): string[] {
  const uniqueNames = Array.from(new Set(names.filter(Boolean)));
  // If query is empty string (just @ typed), return up to 5 initial suggestions!
  if (query === '') {
    return uniqueNames.slice(0, 5);
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return uniqueNames.slice(0, 5);
  }

  const lowerQuery = query.toLowerCase();
  const normQuery = normalise(query);

  return uniqueNames
    .filter((name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.startsWith(lowerQuery)) return true;
      if (normalise(name).startsWith(normQuery)) {
        const firstWord = name.split(/\s+/)[0] || '';
        if (normalise(firstWord).startsWith(normQuery)) {
          if (query.length < 3 && firstWord.length >= 3 && !lowerName.startsWith(lowerQuery)) {
            return false;
          }
          return true;
        }
        return true;
      }
      return false;
    })
    .slice(0, 5);
}

/**
 * Given a textarea value and cursor position, extract the active @mention
 * token being typed (if any).
 *
 * Returns `""` (empty string) if just `@` was typed.
 * Returns `null` if the cursor is not immediately after an incomplete @mention.
 */
export function getActiveMentionToken(value: string, cursorPos: number): string | null {
  const textBefore = value.slice(0, cursorPos);
  // Match @ optionally followed by letters and single spaces
  const match = textBefore.match(/(?:^|(?<=\s))@([\p{L}][\p{L}\s]*)?$/u);
  if (!match) return null;
  const token = match[1] || '';
  if (/\s{2,}/.test(token)) return null;
  return token;
}
