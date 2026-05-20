import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// Types
// ============================================================

export interface CardStats {
  correct: number;    // times the user said "Knew it"
  incorrect: number;  // times the user said "Unsure"
  lastSeen: number;   // Date.now() timestamp
}

export type FlashcardHistory = Record<string, CardStats>;

export type HistoryType = 'styles' | 'glossary' | 'offflavors';

const KEYS: Record<HistoryType, string> = {
  styles:      '@bjcp_fc_history_styles',
  glossary:    '@bjcp_fc_history_glossary',
  offflavors:  '@bjcp_fc_history_offflavors',
};

// ============================================================
// Read
// ============================================================

export async function getHistory(type: HistoryType): Promise<FlashcardHistory> {
  try {
    const raw = await AsyncStorage.getItem(KEYS[type]);
    return raw ? (JSON.parse(raw) as FlashcardHistory) : {};
  } catch {
    return {};
  }
}

// ============================================================
// Write
// ============================================================

export async function recordAnswer(
  type: HistoryType,
  id: string,
  knewIt: boolean
): Promise<void> {
  try {
    const history = await getHistory(type);
    const prev = history[id] ?? { correct: 0, incorrect: 0, lastSeen: 0 };
    history[id] = {
      correct:   prev.correct   + (knewIt ? 1 : 0),
      incorrect: prev.incorrect + (knewIt ? 0 : 1),
      lastSeen:  Date.now(),
    };
    await AsyncStorage.setItem(KEYS[type], JSON.stringify(history));
  } catch {
    // Fail silently — learning history is non-critical
  }
}

/**
 * Clears history entries for the given card IDs.
 * Call this when the user resets progress so the lobby counters go back to 0/0.
 */
export async function clearHistory(
  type: HistoryType,
  ids: string[]
): Promise<void> {
  try {
    const history = await getHistory(type);
    ids.forEach(id => { delete history[id]; });
    await AsyncStorage.setItem(KEYS[type], JSON.stringify(history));
  } catch {
    // Fail silently
  }
}

// ============================================================
// Sorting (Leitner-inspired)
// ============================================================

/**
 * Returns a copy of `ids` sorted so that:
 *  1. Cards never seen (no history) appear first — they need to be learned.
 *  2. Cards with a high error ratio (incorrect / total) appear next.
 *  3. Cards with perfect accuracy appear last.
 *  Within each group, cards not seen recently are prioritised.
 */
export function sortByDifficulty(
  ids: string[],
  history: FlashcardHistory
): string[] {
  return [...ids].sort((a, b) => {
    const ha = history[a];
    const hb = history[b];

    // Never seen → highest priority
    const neverA = !ha || (ha.correct + ha.incorrect) === 0;
    const neverB = !hb || (hb.correct + hb.incorrect) === 0;
    if (neverA && !neverB) return -1;
    if (!neverA && neverB) return 1;
    if (neverA && neverB) return 0;

    // Both seen: sort by error ratio descending (more errors = harder)
    const ratioA = ha!.incorrect / (ha!.correct + ha!.incorrect);
    const ratioB = hb!.incorrect / (hb!.correct + hb!.incorrect);
    if (ratioB !== ratioA) return ratioB - ratioA;

    // Tie-break: seen longest ago first
    return ha!.lastSeen - hb!.lastSeen;
  });
}

/**
 * Returns a human-readable accuracy label for a card.
 * E.g. "3/5" or "–" if unseen.
 */
export function getCardAccuracyLabel(id: string, history: FlashcardHistory): string | null {
  const stats = history[id];
  if (!stats) return null;
  const total = stats.correct + stats.incorrect;
  if (total === 0) return null;
  return `${stats.correct}/${total}`;
}
