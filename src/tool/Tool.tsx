import { useMemo, useState } from 'react';
import {
  Button,
  CopyButton,
  Panel,
  SegmentedControl,
  Switch,
  TextArea,
  Toolbar,
} from '@mmoall/tool-kit';
import { CASES, convertLines } from './case';
import { numeronymText } from './numeronym';
import { ResultRow } from './ResultRow';
import { SAMPLE_TEXT } from './sample';
import { slugify } from './slugify';

type Tab = 'case' | 'slug' | 'numeronym';

const TABS: { value: Tab; label: string }[] = [
  { value: 'case', label: 'Case' },
  { value: 'slug', label: 'Slugify' },
  { value: 'numeronym', label: 'Numeronym' },
];

type Separator = '-' | '_' | '.' | '';

const SEPARATORS: { value: Separator; label: string }[] = [
  { value: '-', label: 'Dash -' },
  { value: '_', label: 'Underscore _' },
  { value: '.', label: 'Dot .' },
  { value: '', label: 'None' },
];

export function Tool() {
  const [tab, setTab] = useState<Tab>('case');
  const [input, setInput] = useState(SAMPLE_TEXT);

  return (
    <div className="flex flex-col gap-3">
      <Toolbar>
        <SegmentedControl aria-label="Mode" value={tab} onChange={setTab} options={TABS} />
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" onClick={() => setInput(SAMPLE_TEXT)}>
            Sample
          </Button>
          <Button variant="ghost" onClick={() => setInput('')} disabled={!input}>
            Clear
          </Button>
        </div>
      </Toolbar>

      <Panel
        title="Input"
        actions={
          input && (
            <span className="text-xs tabular-nums text-[var(--color-muted)]">
              {Array.from(input).length.toLocaleString()} chars
            </span>
          )
        }
      >
        <TextArea
          aria-label="Text input"
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type or paste text to convert…"
          autoFocus
        />
      </Panel>

      {tab === 'case' && <CaseResults input={input} />}
      {tab === 'slug' && <SlugResult input={input} />}
      {tab === 'numeronym' && <NumeronymResult input={input} />}
    </div>
  );
}

function CaseResults({ input }: { input: string }) {
  const results = useMemo(
    () => CASES.map((c) => ({ ...c, value: convertLines(input, c.convert) })),
    [input],
  );

  return (
    <Panel title="Conversions">
      <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 xl:grid-cols-2">
        {results.map((result) => (
          <ResultRow key={result.id} label={result.label} value={result.value} />
        ))}
      </div>
    </Panel>
  );
}

function SlugResult({ input }: { input: string }) {
  const [separator, setSeparator] = useState<Separator>('-');
  const [lowercase, setLowercase] = useState(true);
  const [stripDiacritics, setStripDiacritics] = useState(true);

  const slug = useMemo(
    () => slugify(input, { separator, lowercase, stripDiacritics }),
    [input, separator, lowercase, stripDiacritics],
  );

  return (
    <Panel title="Slug" actions={<CopyButton getText={() => slug} disabled={!slug} />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <SegmentedControl
            aria-label="Separator"
            value={separator}
            onChange={setSeparator}
            options={SEPARATORS}
          />
          <Switch checked={lowercase} onChange={setLowercase} label="Lowercase" />
          <Switch
            checked={stripDiacritics}
            onChange={setStripDiacritics}
            label="Strip diacritics (é → e, đ → d)"
          />
        </div>
        <LargeOutput value={slug} placeholder="Your slug will appear here" />
        <p className="text-xs text-[var(--color-muted)]">
          Whitespace and punctuation collapse into a single separator; <code className="font-code">&amp;</code> becomes
          “and”; apostrophes are removed.
        </p>
      </div>
    </Panel>
  );
}

function NumeronymResult({ input }: { input: string }) {
  const output = useMemo(() => numeronymText(input), [input]);

  return (
    <Panel title="Numeronym" actions={<CopyButton getText={() => output} disabled={!output} />}>
      <div className="flex flex-col gap-4">
        <LargeOutput value={output} placeholder="e.g. internationalization → i18n" />
        <p className="text-xs text-[var(--color-muted)]">
          Every word longer than three characters becomes its first letter, the number of letters in between, and
          its last letter — <span className="font-code">accessibility → a11y</span>,{' '}
          <span className="font-code">Kubernetes → K8s</span>.
        </p>
      </div>
    </Panel>
  );
}

function LargeOutput({ value, placeholder }: { value: string; placeholder: string }) {
  return (
    <div
      className={`font-code min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-[15px] leading-6 break-all whitespace-pre-wrap ${
        value ? 'text-[var(--color-fg)]' : 'text-[var(--color-subtle)]'
      }`}
    >
      {value || placeholder}
    </div>
  );
}
