/**
 * Normalizes a string by converting it to lowercase, trimming spaces,
 * and stripping out all Spanish accent marks / diacritics.
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Generates an acronym from a multi-word string.
 * "India Pale Ale" → "ipa"
 * "American Pale Ale" → "apa"
 * "Double India Pale Ale" → "dipa"
 * Filters out common filler words so they don't inflate acronyms.
 */
function toAcronym(str: string): string {
  const fillers = new Set([
    'and','de','the','of','a','an','y','la','el','los','las','with','con','or','en','von','van',
  ]);
  return normalizeString(str)
    .split(/\s+/)
    .filter(w => w.length > 1 && !fillers.has(w))
    .map(w => w[0])
    .join('');
}

/**
 * Hybrid fuzzy search with three layers:
 *  1. Exact substring match across all fields.
 *  2. Acronym match against name-only fields (so "IPA" matches "India Pale Ale").
 *  3. Subsequence match ONLY for long queries (> 4 chars) on short fields (< 50 chars).
 *     This prevents "ipa" from matching "imperial" via i…p…a subsequence.
 *
 * @param query    The user's search string (may be multi-word).
 * @param target   One or more text fields to search inside.
 * @param nameFields  Optional subset of fields treated as "names" for acronym generation.
 *                    If omitted, all short target fields are used for acronym generation.
 */
export function fuzzyMatch(
  query: string,
  target: string | (string | null | undefined)[] | null | undefined,
  nameFields?: (string | null | undefined)[]
): boolean {
  if (!query) return true;
  if (!target) return false;

  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return true;

  // All target fields normalized
  const targets = (Array.isArray(target) ? target : [target])
    .filter(Boolean)
    .map(t => normalizeString(t!));

  if (targets.length === 0) return false;

  // Name-only fields for acronym generation (very short, multi-word)
  const acronymSource = nameFields
    ? nameFields.filter(Boolean).map(f => normalizeString(f!))
    : targets;

  const acronyms = acronymSource
    .filter(t => t.includes(' ') && t.length < 60)
    .map(t => toAcronym(t))
    .filter(a => a.length >= 2);

  return queryWords.every(word => {
    // 1. Exact substring match (handles "stout", "lager", "american ipa", etc.)
    if (targets.some(t => t.includes(word))) return true;

    // 2. Acronym match: word must exactly equal a generated acronym
    //    Works for "ipa", "apa", "dipa", "esb", "ris", etc.
    if (acronyms.some(a => a === word)) return true;

    // 3. Subsequence fuzzy match — DISABLED for short queries (≤ 4 chars)
    //    This prevents "ipa" from matching "imperial" via i…p…a.
    if (word.length <= 4) return false;

    return targets.some(t => {
      if (t.length > 50 || word.length <= 1) return false;

      let qi = 0;
      let ti = 0;
      while (qi < word.length && ti < t.length) {
        if (word[qi] === t[ti]) qi++;
        ti++;
      }
      return qi === word.length;
    });
  });
}
