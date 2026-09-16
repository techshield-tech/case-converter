// Per-tool metadata. This is the ONE file (together with `src/tool/`,
// `index.html`'s fallback <title>, and this repo's README) that changes
// when this template is copied to a new tool repo.

// Imports from '@mmoall/tool-kit/config' (a plain-JS-backed subpath), not
// the main '@mmoall/tool-kit' barrel — this file is also reachable from
// vite.config.ts's config-load chain, which cannot load the main barrel's
// .ts source from inside node_modules. See '@mmoall/tool-kit/config's
// source comment for why.
import { defineToolConfig } from '@mmoall/tool-kit/config';

export const toolConfig = defineToolConfig({
  slug: 'case-converter',
  name: 'Case Converter & Slugify',
  description:
    'Convert text between camelCase, snake_case, kebab-case and 12 other cases, create URL slugs, and generate numeronyms like i18n — 100% client-side.',
  category: 'Converter',
  keywords: [
    'case converter',
    'camelcase converter',
    'snake case converter',
    'kebab case',
    'pascal case',
    'title case',
    'slugify',
    'url slug generator',
    'remove diacritics',
    'numeronym generator',
  ],
});
