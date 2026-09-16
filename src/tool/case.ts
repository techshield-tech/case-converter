// Pure, framework-free letter-case conversion. Tool-specific.

export type CaseId =
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'constant'
  | 'kebab'
  | 'train'
  | 'dot'
  | 'path'
  | 'title'
  | 'sentence'
  | 'no'
  | 'lower'
  | 'upper'
  | 'alternating'
  | 'inverse';

export interface CaseDefinition {
  id: CaseId;
  label: string;
  convert: (line: string) => string;
}

/**
 * Splits text into words on any non letter/digit character and on case
 * boundaries: `fooBar` → foo, Bar; `XMLHttpRequest` → XML, Http, Request.
 * Apostrophes inside words are dropped (`don't` → dont).
 */
export function splitWords(input: string): string[] {
  return input
    .replace(/(\p{L})['’](\p{L})/gu, '$1$2')
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function capitalize(word: string): string {
  const [first = '', ...rest] = Array.from(word);
  return first.toLocaleUpperCase() + rest.join('').toLocaleLowerCase();
}

const lower = (word: string) => word.toLocaleLowerCase();
const upper = (word: string) => word.toLocaleUpperCase();

function joinWords(map: (word: string, index: number) => string, separator: string) {
  return (line: string) => splitWords(line).map(map).join(separator);
}

function alternating(line: string): string {
  let index = 0;
  let result = '';
  for (const char of line) {
    const lowerChar = char.toLocaleLowerCase();
    const upperChar = char.toLocaleUpperCase();
    if (lowerChar === upperChar) {
      result += char;
      continue;
    }
    result += index % 2 === 0 ? lowerChar : upperChar;
    index++;
  }
  return result;
}

function inverse(line: string): string {
  let result = '';
  for (const char of line) {
    const upperChar = char.toLocaleUpperCase();
    result += char === upperChar ? char.toLocaleLowerCase() : upperChar;
  }
  return result;
}

export const CASES: CaseDefinition[] = [
  { id: 'camel', label: 'camelCase', convert: joinWords((w, i) => (i === 0 ? lower(w) : capitalize(w)), '') },
  { id: 'pascal', label: 'PascalCase', convert: joinWords(capitalize, '') },
  { id: 'snake', label: 'snake_case', convert: joinWords(lower, '_') },
  { id: 'constant', label: 'CONSTANT_CASE', convert: joinWords(upper, '_') },
  { id: 'kebab', label: 'kebab-case', convert: joinWords(lower, '-') },
  { id: 'train', label: 'Train-Case', convert: joinWords(capitalize, '-') },
  { id: 'dot', label: 'dot.case', convert: joinWords(lower, '.') },
  { id: 'path', label: 'path/case', convert: joinWords(lower, '/') },
  { id: 'title', label: 'Title Case', convert: joinWords(capitalize, ' ') },
  { id: 'sentence', label: 'Sentence case', convert: joinWords((w, i) => (i === 0 ? capitalize(w) : lower(w)), ' ') },
  { id: 'no', label: 'no case', convert: joinWords(lower, ' ') },
  { id: 'lower', label: 'lower case', convert: lower },
  { id: 'upper', label: 'UPPER CASE', convert: upper },
  { id: 'alternating', label: 'aLtErNaTiNg', convert: alternating },
  { id: 'inverse', label: 'iNVERSE cASE', convert: inverse },
];

/** Applies `convert` to each line separately so multi-line input keeps its line breaks. */
export function convertLines(input: string, convert: (line: string) => string): string {
  return input.split('\n').map(convert).join('\n');
}
