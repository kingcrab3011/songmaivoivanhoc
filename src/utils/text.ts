/**
 * Normalizes Vietnamese text to NFC (Precomposed Unicode)
 * This fixes 5-tone mark font splitting bugs across browsers and devices
 */
export function toNFC(str: string): string {
  if (!str) return '';
  return str.normalize('NFC');
}

/**
 * Normalizes Vietnamese text by removing accents for flexible search
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Smart Vietnamese text search: returns true if search query matches target text
 */
export function matchesSearch(targetText: string, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;
  const normalizedTarget = removeVietnameseAccents(targetText);
  const normalizedQuery = removeVietnameseAccents(searchQuery);

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  return queryTerms.every((term) => normalizedTarget.includes(term));
}

/**
 * Counts words in Vietnamese text accurately
 */
export function countVietnameseWords(text: string): number {
  if (!text || !text.trim()) return 0;
  // Match contiguous words separated by whitespace, ignoring punctuation
  const clean = text
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>\[\]\\|]/g, ' ')
    .replace(/\s+/g, ' ');

  const words = clean.split(' ').filter((w) => w.length > 0);
  return words.length;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Formats date into Vietnamese locale
 */
export function formatVietnameseDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats timestamp with time into Vietnamese locale
 */
export function formatVietnameseDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
