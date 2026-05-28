import { useEffect, useState } from 'react';
import {
  Clock3,
  Delete,
  Divide,
  Equal,
  LockKeyhole,
  MemoryStick,
  Minus,
  Palette,
  Percent,
  Plus,
  Radical,
  ReceiptText,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CalculatorButton } from './CalculatorButton';
import { useCalculator } from '../hooks/useCalculator';
import { Modal } from '../../../shared/components/Modal';
import { calculatorThemes, type CalculatorThemeId } from '../data/calculatorThemes';
import type { SubscriptionService } from '../../subscriptions/services/SubscriptionService';

interface CalculatorShellProps {
  subscriptionService: SubscriptionService;
  canShowHistory: boolean;
  onBlocked: (message?: string) => void;
}

export function CalculatorShell({
  subscriptionService,
  canShowHistory,
  onBlocked,
}: CalculatorShellProps) {
  const calculator = useCalculator(subscriptionService);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<CalculatorThemeId>('white');
  const selectedTheme =
    calculatorThemes.find((theme) => theme.id === selectedThemeId) ?? calculatorThemes[0];

  useEffect(() => {
    if (!calculator.lastBlockedFeature) {
      return;
    }

    onBlocked(calculator.lastBlockedFeature.message);
    calculator.clearBlockedFeature();
  }, [calculator, onBlocked]);

  const isLocked = {
    result: !subscriptionService.canUseFeature('reveal-result'),
    subtraction: !subscriptionService.canUseOperation('subtract'),
    multiplication: !subscriptionService.canUseOperation('multiply'),
    division: !subscriptionService.canUseOperation('divide'),
    percentage: !subscriptionService.canUseFeature('percentage'),
    squareRoot: !subscriptionService.canUseFeature('square-root'),
    memory: !subscriptionService.canUseFeature('memory'),
  };

  const openHistory = () => {
    if (!canShowHistory) {
      onBlocked(
        subscriptionService.getLockedMessage('Historico', { kind: 'feature', id: 'history' }),
      );
      return;
    }

    setIsHistoryOpen(true);
  };

  const selectTheme = (themeId: CalculatorThemeId) => {
    const theme = calculatorThemes.find((item) => item.id === themeId);

    if (!theme) {
      return;
    }

    if (theme.requiredFeature && !subscriptionService.canUseFeature(theme.requiredFeature)) {
      onBlocked(
        subscriptionService.getLockedMessage(`Tema ${theme.name}`, {
          kind: 'feature',
          id: theme.requiredFeature,
        }),
      );
      return;
    }

    setSelectedThemeId(theme.id);
    setIsThemeModalOpen(false);
  };

  const getButtonClassName = (tone: 'number' | 'operator' | 'utility' | 'equals') => {
    const classes = {
      number: selectedTheme.numberButtonClassName,
      operator: selectedTheme.operatorButtonClassName,
      utility: selectedTheme.utilityButtonClassName,
      equals: selectedTheme.equalsButtonClassName,
    };

    return classes[tone];
  };

  const visibleExpression =
    calculator.state.expressionParts.length > 0
      ? [
          ...calculator.state.expressionParts,
          calculator.state.shouldResetDisplay ? null : calculator.state.display,
        ]
          .filter(Boolean)
          .join(' ')
      : '';

  const renderThemePicker = (variant: 'sidebar' | 'modal') => (
    <div
      className={clsx(
        variant === 'sidebar' ? 'grid grid-cols-3 gap-2 lg:grid-cols-2' : 'grid grid-cols-2 gap-2',
      )}
    >
      {calculatorThemes.map((theme) => {
        const isSelected = theme.id === selectedTheme.id;
        const isThemeLocked =
          Boolean(theme.requiredFeature) &&
          !subscriptionService.canUseFeature(theme.requiredFeature!);

        return (
          <button
            aria-label={`Tema ${theme.name}`}
            className={clsx(
              'relative flex h-14 items-center justify-start gap-3 rounded-md border px-3 text-sm font-bold transition',
              variant === 'sidebar' && 'flex-col justify-center gap-1 px-0 text-xs',
              isSelected
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white',
            )}
            key={theme.id}
            onClick={() => selectTheme(theme.id)}
            title={isThemeLocked ? `Tema ${theme.name} bloqueado` : `Tema ${theme.name}`}
            type="button"
          >
            <span
              className={clsx(
                'h-6 w-6 shrink-0 rounded-full border border-black/10 ring-1 ring-slate-200',
                variant === 'sidebar' && 'h-5 w-5',
                theme.swatchClassName,
              )}
            />
            <span>{theme.name}</span>
            {isThemeLocked ? (
              <span className="absolute right-2 top-2 text-slate-500">
                <LockKeyhole size={12} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <section className="grid h-full min-h-0 w-full grid-cols-1 items-stretch gap-3 md:mx-auto md:h-auto md:w-[610px] md:grid-cols-[400px_190px] md:items-start md:gap-5">
        <div
          className={clsx(
            'flex h-full min-h-0 w-full flex-col rounded-lg border p-2 shadow-panel sm:p-3 md:h-auto md:w-[400px]',
            selectedTheme.shellClassName,
          )}
        >
          <div
            className={clsx(
              'mb-2 flex min-h-[11.5rem] shrink-0 flex-col rounded-lg p-3 sm:mb-3 md:min-h-0',
              selectedTheme.displayClassName,
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Historico"
                  className="relative grid h-9 w-9 place-items-center rounded-md bg-white/10 text-slate-200 transition hover:bg-white/15 hover:text-white"
                  onClick={openHistory}
                  title={canShowHistory ? 'Historico' : 'Historico bloqueado'}
                  type="button"
                >
                  <Clock3 size={17} />
                  {!canShowHistory ? (
                    <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-slate-950">
                      <LockKeyhole size={9} />
                    </span>
                  ) : null}
                </button>
                <p
                  className={clsx(
                    'text-xs font-bold uppercase tracking-wide',
                    selectedTheme.titleClassName,
                  )}
                >
                  CalcPay Terminal
                </p>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <button
                  aria-label="Planos"
                  className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-slate-200 transition hover:bg-white/15 hover:text-white"
                  onClick={() => onBlocked()}
                  title="Planos"
                  type="button"
                >
                  <ReceiptText size={17} />
                </button>
                <button
                  aria-label="Escolher tema"
                  className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-slate-200 transition hover:bg-white/15 hover:text-white"
                  onClick={() => setIsThemeModalOpen(true)}
                  title="Escolher tema"
                  type="button"
                >
                  <Palette size={17} />
                </button>
              </div>
            </div>
            <div
              className={clsx(
                'min-h-5 truncate text-right text-sm font-semibold',
                selectedTheme.titleClassName,
              )}
            >
              {visibleExpression}
            </div>
            <div className="min-h-12 break-all text-right text-3xl font-black tabular-nums">
              {calculator.hiddenResult ? '•••••' : calculator.state.display}
            </div>
            {calculator.hiddenResult ? (
              <p className="mt-2 text-right text-xs font-semibold text-amber-300">
                Resultado protegido por assinatura.
              </p>
            ) : null}
            <div className="mt-2 flex min-h-5 items-center justify-between gap-2 text-xs font-semibold">
              {calculator.state.memory !== 0 ? (
                <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-slate-200">
                  <MemoryStick size={12} />
                  M {calculator.state.memory}
                </span>
              ) : (
                <span />
              )}
              {calculator.memoryFeedback ? (
                <span className="truncate text-right text-slate-200">{calculator.memoryFeedback}</span>
              ) : null}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-5 gap-2 md:flex-none md:grid-rows-none">
            <CalculatorButton
              className={getButtonClassName('utility')}
              label="Limpar"
              onClick={calculator.clear}
              tone="utility"
            >
              AC
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('utility')}
              label="Apagar"
              onClick={calculator.backspace}
              tone="utility"
            >
              <Delete size={20} />
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('utility')}
              isLocked={isLocked.percentage}
              label="Porcentagem"
              onClick={calculator.percentage}
              tone="utility"
            >
              <Percent size={20} />
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('operator')}
              isLocked={isLocked.division}
              label="Divisao"
              onClick={calculator.divide}
              tone="operator"
            >
              <Divide size={20} />
            </CalculatorButton>

            {[7, 8, 9].map((digit) => (
              <CalculatorButton
                className={getButtonClassName('number')}
                key={digit}
                label={`Numero ${digit}`}
                onClick={() => calculator.inputDigit(String(digit))}
              >
                {digit}
              </CalculatorButton>
            ))}
            <CalculatorButton
              className={getButtonClassName('operator')}
              isLocked={isLocked.multiplication}
              label="Multiplicacao"
              onClick={calculator.multiply}
              tone="operator"
            >
              <X size={20} />
            </CalculatorButton>

            {[4, 5, 6].map((digit) => (
              <CalculatorButton
                className={getButtonClassName('number')}
                key={digit}
                label={`Numero ${digit}`}
                onClick={() => calculator.inputDigit(String(digit))}
              >
                {digit}
              </CalculatorButton>
            ))}
            <CalculatorButton
              className={getButtonClassName('operator')}
              isLocked={isLocked.subtraction}
              label="Subtracao"
              onClick={calculator.subtract}
              tone="operator"
            >
              <Minus size={20} />
            </CalculatorButton>

            {[1, 2, 3].map((digit) => (
              <CalculatorButton
                className={getButtonClassName('number')}
                key={digit}
                label={`Numero ${digit}`}
                onClick={() => calculator.inputDigit(String(digit))}
              >
                {digit}
              </CalculatorButton>
            ))}
            <CalculatorButton
              className={getButtonClassName('operator')}
              label="Soma"
              onClick={calculator.add}
              tone="operator"
            >
              <Plus size={20} />
            </CalculatorButton>

            <CalculatorButton
              className={getButtonClassName('utility')}
              isLocked={isLocked.squareRoot}
              label="Raiz quadrada"
              onClick={calculator.squareRoot}
              tone="utility"
            >
              <Radical size={20} />
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('number')}
              label="Numero 0"
              onClick={() => calculator.inputDigit('0')}
            >
              0
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('number')}
              label="Decimal"
              onClick={calculator.inputDecimal}
            >
              .
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('equals')}
              isLocked={isLocked.result}
              label="Resultado"
              onClick={calculator.calculate}
              tone="equals"
            >
              <Equal size={22} />
            </CalculatorButton>
          </div>

          <div className="mt-2 grid h-[clamp(4.5rem,11dvh,6.25rem)] grid-cols-3 gap-2 md:h-auto">
            <CalculatorButton
              className={getButtonClassName('utility')}
              isLocked={isLocked.memory}
              label="Adicionar memoria"
              onClick={calculator.memoryAdd}
              tone="utility"
            >
              M+
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('utility')}
              isLocked={isLocked.memory}
              label="Recuperar memoria"
              onClick={calculator.memoryRecall}
              tone="utility"
            >
              MR
            </CalculatorButton>
            <CalculatorButton
              className={getButtonClassName('utility')}
              isLocked={isLocked.memory}
              label="Limpar memoria"
              onClick={calculator.memoryClear}
              tone="utility"
            >
              MC
            </CalculatorButton>
          </div>
        </div>

        <aside className="hidden w-[190px] rounded-lg border border-slate-200 bg-white p-3 shadow-panel md:block">
          <div className="mb-3">
            <h2 className="text-sm font-black text-slate-950">Temas</h2>
            <p className="text-xs font-medium text-slate-500">Aparencia da calculadora</p>
          </div>
          {renderThemePicker('sidebar')}
        </aside>
      </section>

      <Modal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} title="Temas">
        {renderThemePicker('modal')}
      </Modal>

      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Historico">
        <div className="space-y-3">
          {calculator.state.history.length > 0 ? (
            calculator.state.history.map((record) => (
              <div
                className="rounded-md bg-slate-50 p-3 text-sm ring-1 ring-slate-200"
                key={`${record.expression}-${record.result}`}
              >
                <p className="font-semibold text-slate-500">{record.expression}</p>
                <p className="text-xl font-black text-slate-950">{record.result}</p>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-slate-500">Nenhuma conta aprovada ainda.</p>
          )}
        </div>
      </Modal>
    </>
  );
}
