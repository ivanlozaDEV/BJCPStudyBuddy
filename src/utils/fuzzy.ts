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
 * Perform a hybrid high-performance fuzzy match over a single string or an array of fields.
 * Every word token in the query must match at least one of the targets (either via substring
 * or via subsequence fuzzy match on short fields).
 */
export function fuzzyMatch(
  query: string, 
  target: string | (string | null | undefined)[] | null | undefined
): boolean {
  if (!query) return true;
  if (!target) return false;

  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  // Split query into individual word tokens
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return true;

  // Convert target to an array of normalized strings
  const targets = (Array.isArray(target) ? target : [target])
    .filter(Boolean)
    .map(t => normalizeString(t!));

  if (targets.length === 0) return false;

  // Every single word in the query must match at least one target field!
  return queryWords.every(word => {
    // 1. Check for exact substring match in any field
    const hasSubstringMatch = targets.some(t => t.includes(word));
    if (hasSubstringMatch) return true;

    // 2. Check for subsequence fuzzy match ONLY on short fields (length < 50)
    // to prevent loose false positives in long paragraphs/descriptions!
    return targets.some(t => {
      if (t.length > 50 || word.length <= 1) return false;

      let queryIdx = 0;
      let targetIdx = 0;

      while (queryIdx < word.length && targetIdx < t.length) {
        if (word[queryIdx] === t[targetIdx]) {
          queryIdx++;
        }
        targetIdx++;
      }

      return queryIdx === word.length;
    });
  });
}
