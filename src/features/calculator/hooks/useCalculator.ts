import { useEffect, useMemo, useState } from 'react';
import { CalculatorService } from '../services/CalculatorService';
import type { CalculatorState } from '../types/Calculator';
import type { FeatureId, OperationId } from '../../subscriptions/types/Plan';
import type { SubscriptionService } from '../../subscriptions/services/SubscriptionService';

interface BlockedFeature {
  featureName: string;
  message: string;
}

export function useCalculator(subscriptionService: SubscriptionService) {
  const calculatorService = useMemo(() => new CalculatorService(), []);
  const [state, setState] = useState<CalculatorState>(() => calculatorService.getInitialState());
  const [lastBlockedFeature, setLastBlockedFeature] = useState<BlockedFeature | null>(null);
  const [hiddenResult, setHiddenResult] = useState<string | null>(null);
  const [memoryFeedback, setMemoryFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!memoryFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMemoryFeedback(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [memoryFeedback]);

  const blockFeature = (featureName: string) => {
    setLastBlockedFeature({
      featureName,
      message: subscriptionService.getLockedMessage(featureName),
    });
  };

  const runOperation = (operation: OperationId, label: string) => {
    if (!subscriptionService.canUseOperation(operation)) {
      blockFeature(label);
      return;
    }

    setState((currentState) => {
      const shouldHideIntermediateResult =
        !subscriptionService.canUseFeature('reveal-result') &&
        currentState.pendingOperation !== null &&
        currentState.storedValue !== null &&
        !currentState.shouldResetDisplay;
      const nextState = calculatorService.setOperation(currentState, operation);

      if (shouldHideIntermediateResult) {
        setHiddenResult(nextState.display);
      }

      return nextState;
    });
  };

  const calculate = () => {
    if (!subscriptionService.canUseFeature('reveal-result')) {
      const preview = calculatorService.calculate(state);
      setHiddenResult(preview.result ?? state.display);
      blockFeature('Resultado');
      return;
    }

    setState((currentState) => calculatorService.calculate(currentState).state);
    setHiddenResult(null);
  };

  const requireFeature = (feature: FeatureId, label: string, action: () => void) => {
    if (!subscriptionService.canUseFeature(feature)) {
      blockFeature(label);
      return;
    }

    action();
  };

  return {
    state,
    hiddenResult,
    memoryFeedback,
    lastBlockedFeature,
    clearBlockedFeature: () => setLastBlockedFeature(null),
    inputDigit: (digit: string) => {
      setHiddenResult(null);
      setState((currentState) => calculatorService.inputDigit(currentState, digit));
    },
    inputDecimal: () => setState((currentState) => calculatorService.inputDecimal(currentState)),
    clear: () => {
      setHiddenResult(null);
      setState((currentState) => calculatorService.clear(currentState));
    },
    backspace: () => setState((currentState) => calculatorService.backspace(currentState)),
    add: () => runOperation('add', 'Soma'),
    subtract: () => runOperation('subtract', 'Subtracao'),
    multiply: () => runOperation('multiply', 'Multiplicacao'),
    divide: () => runOperation('divide', 'Divisao'),
    calculate,
    percentage: () =>
      requireFeature('percentage', 'Porcentagem', () =>
        setState((currentState) => calculatorService.applyPercentage(currentState)),
      ),
    squareRoot: () =>
      requireFeature('square-root', 'Raiz quadrada', () =>
        setState((currentState) => calculatorService.applySquareRoot(currentState)),
      ),
    memoryAdd: () =>
      requireFeature('memory', 'Memoria', () =>
        setState((currentState) => {
          const nextState = calculatorService.addMemory(currentState);
          setMemoryFeedback(`Memoria: ${nextState.memory}`);
          return nextState;
        }),
      ),
    memoryRecall: () =>
      requireFeature('memory', 'Memoria', () =>
        setState((currentState) => {
          const nextState = calculatorService.recallMemory(currentState);
          setMemoryFeedback(`Memoria recuperada: ${nextState.display}`);
          return nextState;
        }),
      ),
    memoryClear: () =>
      requireFeature('memory', 'Memoria', () =>
        setState((currentState) => {
          const nextState = calculatorService.clearMemory(currentState);
          setMemoryFeedback('Memoria limpa');
          return nextState;
        }),
      ),
  };
}
