import { useEffect, useState } from 'react';
import {
  Clock3,
  Delete,
  Divide,
  Equal,
  LockKeyhole,
  Minus,
  Percent,
  Plus,
  Radical,
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
  onBlocked: (message: string) => void;
}

export function CalculatorShell({
  subscriptionService,
  canShowHistory,
  onBlocked,
}: CalculatorShellProps) {
  const calculator = useCalculator(subscriptionService);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
      onBlocked(subscriptionService.getLockedMessage('Historico'));
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
      onBlocked(subscriptionService.getLockedMessage(`Tema ${theme.name}`));
      return;
    }

    setSelectedThemeId(theme.id);
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

  return (
    <>
      <section className="mx-auto grid w-[610px] grid-cols-[400px_190px] items-start gap-5">
        <div
          className={clsx(
            'w-[400px] rounded-lg border p-3 shadow-panel',
            selectedTheme.shellClassName,
          )}
        >
          <div className={clsx('mb-3 rounded-lg p-3', selectedTheme.displayClassName)}>
            <div className="mb-2 flex items-center gap-2">
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
          </div>

          <div className="grid grid-cols-4 gap-2">
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

          <div className="mt-2 grid grid-cols-3 gap-2">
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

        <aside className="w-[190px] rounded-lg border border-slate-200 bg-white p-3 shadow-panel">
          <div className="mb-3">
            <h2 className="text-sm font-black text-slate-950">Temas</h2>
            <p className="text-xs font-medium text-slate-500">Aparencia da calculadora</p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
            {calculatorThemes.map((theme) => {
              const isSelected = theme.id === selectedTheme.id;
              const isThemeLocked =
                Boolean(theme.requiredFeature) &&
                !subscriptionService.canUseFeature(theme.requiredFeature!);

              return (
                <button
                  aria-label={`Tema ${theme.name}`}
                  className={clsx(
                    'relative flex h-14 flex-col items-center justify-center gap-1 rounded-md border text-xs font-bold transition',
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
                      'h-5 w-5 rounded-full border border-black/10 ring-1 ring-slate-200',
                      theme.swatchClassName,
                    )}
                  />
                  <span>{theme.name}</span>
                  {isThemeLocked ? (
                    <span className="absolute right-1.5 top-1.5 text-slate-500">
                      <LockKeyhole size={12} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>
      </section>

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
