import type { ReactNode } from 'react';
import { LockKeyhole } from 'lucide-react';
import { clsx } from 'clsx';

interface CalculatorButtonProps {
  children: ReactNode;
  label: string;
  className?: string;
  isLocked?: boolean;
  tone?: 'number' | 'operator' | 'utility' | 'equals';
  onClick: () => void;
}

const toneClasses = {
  number: 'bg-white text-slate-950 hover:bg-slate-50',
  operator: 'bg-sky-100 text-sky-950 hover:bg-sky-200',
  utility: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  equals: 'bg-emerald-600 text-white hover:bg-emerald-500',
};

export function CalculatorButton({
  children,
  className,
  label,
  isLocked = false,
  tone = 'number',
  onClick,
}: CalculatorButtonProps) {
  return (
    <button
      aria-label={label}
      className={clsx(
        'relative grid h-full min-h-12 place-items-center rounded-lg text-lg font-black shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] sm:h-16',
        toneClasses[tone],
        className,
      )}
      onClick={onClick}
      title={isLocked ? `${label} bloqueado pelo plano atual` : label}
      type="button"
    >
      {children}
      {isLocked ? (
        <span className="absolute right-1.5 top-1.5 text-slate-500">
          <LockKeyhole size={12} />
        </span>
      ) : null}
    </button>
  );
}
