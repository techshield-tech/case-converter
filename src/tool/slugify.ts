// Pure, framework-free slug generation. Tool-specific.

export interface SlugifyOptions {
  separator: string;
  lowercase: boolean;
  stripDiacritics: boolean;
}

// Letters that Unicode NFD does not decompose into base letter + mark.
const SPECIAL_LETTERS: Record<string, string> = {
  đ: 'd', Đ: 'D', ð: 'd', Ð: 'D', ø: 'o', Ø: 'O', ł: 'l', Ł: 'L', ß: 'ss', ẞ: 'SS',
  æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE', þ: 'th', Þ: 'TH', ı: 'i', ħ: 'h', Ħ: 'H',
};

const SPECIAL_LETTERS_RE = new RegExp(`[${Object.keys(SPECIAL_LETTERS).join('')}]`, 'g');

export function removeDiacritics(input: string): string {
  return input
    .replace(SPECIAL_LETTERS_RE, (char) => SPECIAL_LETTERS[char] ?? char)
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .normalize('NFC');
}

export function slugify(input: string, options: SlugifyOptions): string {
  let text = input.replace(/&/g, ' and ').replace(/['’]/g, '');
  if (options.stripDiacritics) text = removeDiacritics(text);
  if (options.lowercase) text = text.toLocaleLowerCase();
  return text.split(/[^\p{L}\p{N}]+/u).filter(Boolean).join(options.separator);
}
