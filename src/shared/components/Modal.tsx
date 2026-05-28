import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ title, children, isOpen, onClose }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-3 sm:items-center sm:p-4">
      <section className="max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-panel sm:max-h-[calc(100dvh-2rem)]">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button
            aria-label="Fechar"
            className="grid h-12 w-12 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 sm:h-10 sm:w-10"
            onClick={onClose}
            type="button"
          >
            <X size={22} />
          </button>
        </header>
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}
