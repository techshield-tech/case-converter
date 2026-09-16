// Pure, framework-free numeronym generation (internationalization → i18n). Tool-specific.

/** Numeronym of a single word; words of three characters or fewer are returned unchanged. */
export function numeronym(word: string): string {
  const chars = Array.from(word);
  if (chars.length <= 3) return word;
  return `${chars[0]}${chars.length - 2}${chars[chars.length - 1]}`;
}

/** Replaces every word (run of letters/digits) in `text` with its numeronym, keeping everything else. */
export function numeronymText(text: string): string {
  return text.replace(/[\p{L}\p{N}]+/gu, numeronym);
}
