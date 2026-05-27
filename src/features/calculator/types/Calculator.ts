import type { OperationId } from '../../subscriptions/types/Plan';

export type CalculatorInput = string;

export interface CalculationRecord {
  expression: string;
  result: string;
}

export interface CalculatorState {
  display: string;
  expressionParts: string[];
  storedValue: number | null;
  pendingOperation: OperationId | null;
  shouldResetDisplay: boolean;
  history: CalculationRecord[];
  memory: number;
}

export interface CalculationResult {
  state: CalculatorState;
  expression?: string;
  result?: string;
}
