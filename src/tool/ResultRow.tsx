import type { ReactNode } from 'react';
import { CopyButton } from '@mmoall/tool-kit';

export interface ResultRowProps {
  label: ReactNode;
  value: string;
  placeholder?: string;
}

export function ResultRow({ label, value, placeholder = '—' }: ResultRowProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="font-code shrink-0 text-xs text-[var(--color-muted)] sm:w-32">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          className={`font-code min-h-9 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-[13px] leading-6 break-all whitespace-pre-wrap ${
            value ? 'text-[var(--color-fg)]' : 'text-[var(--color-subtle)]'
          }`}
        >
          {value || placeholder}
        </div>
        <CopyButton getText={() => value} disabled={!value} />
      </div>
    </div>
  );
}
