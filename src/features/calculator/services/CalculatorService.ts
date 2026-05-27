import type { CalculationResult, CalculatorState } from '../types/Calculator';
import type { OperationId } from '../../subscriptions/types/Plan';

const initialDisplay = '0';

export class CalculatorService {
  getInitialState(): CalculatorState {
    return {
      display: initialDisplay,
      expressionParts: [],
      storedValue: null,
      pendingOperation: null,
      shouldResetDisplay: false,
      history: [],
      memory: 0,
    };
  }

  inputDigit(state: CalculatorState, digit: string): CalculatorState {
    if (state.shouldResetDisplay || state.display === initialDisplay) {
      return { ...state, display: digit, shouldResetDisplay: false };
    }

    return { ...state, display: `${state.display}${digit}` };
  }

  inputDecimal(state: CalculatorState): CalculatorState {
    if (state.shouldResetDisplay) {
      return { ...state, display: '0.', shouldResetDisplay: false };
    }

    if (state.display.includes('.')) {
      return state;
    }

    return { ...state, display: `${state.display}.` };
  }

  setOperation(state: CalculatorState, operation: OperationId): CalculatorState {
    if (state.pendingOperation && state.storedValue !== null && !state.shouldResetDisplay) {
      const rightValue = Number(state.display);
      const result = this.executeOperation(state.storedValue, rightValue, state.pendingOperation);

      return {
        ...state,
        display: this.formatNumber(result),
        expressionParts: [
          ...state.expressionParts,
          this.formatNumber(rightValue),
          this.getOperationSymbol(operation),
        ],
        storedValue: result,
        pendingOperation: operation,
        shouldResetDisplay: true,
      };
    }

    if (state.pendingOperation && state.shouldResetDisplay) {
      return {
        ...state,
        expressionParts: [
          ...state.expressionParts.slice(0, -1),
          this.getOperationSymbol(operation),
        ],
        pendingOperation: operation,
      };
    }

    return {
      ...state,
      expressionParts: [this.formatNumber(Number(state.display)), this.getOperationSymbol(operation)],
      storedValue: Number(state.display),
      pendingOperation: operation,
      shouldResetDisplay: true,
    };
  }

  calculate(state: CalculatorState): CalculationResult {
    if (state.pendingOperation === null || state.storedValue === null) {
      return { state };
    }

    const rightValue = Number(state.display);
    const result = this.executeOperation(state.storedValue, rightValue, state.pendingOperation);
    const formattedResult = this.formatNumber(result);
    const expression = [...state.expressionParts, this.formatNumber(rightValue)].join(' ');

    return {
      state: {
        ...state,
        display: formattedResult,
        expressionParts: [],
        storedValue: null,
        pendingOperation: null,
        shouldResetDisplay: true,
        history: [{ expression, result: formattedResult }, ...state.history].slice(0, 6),
      },
      expression,
      result: formattedResult,
    };
  }

  clear(state: CalculatorState): CalculatorState {
    return { ...this.getInitialState(), history: state.history, memory: state.memory };
  }

  backspace(state: CalculatorState): CalculatorState {
    if (state.shouldResetDisplay || state.display.length === 1) {
      return { ...state, display: initialDisplay, shouldResetDisplay: false };
    }

    return { ...state, display: state.display.slice(0, -1) };
  }

  applyPercentage(state: CalculatorState): CalculatorState {
    return { ...state, display: this.formatNumber(Number(state.display) / 100) };
  }

  applySquareRoot(state: CalculatorState): CalculatorState {
    const value = Number(state.display);
    return { ...state, display: value < 0 ? 'Erro' : this.formatNumber(Math.sqrt(value)) };
  }

  addMemory(state: CalculatorState): CalculatorState {
    return { ...state, memory: state.memory + Number(state.display) };
  }

  recallMemory(state: CalculatorState): CalculatorState {
    return { ...state, display: this.formatNumber(state.memory), shouldResetDisplay: true };
  }

  clearMemory(state: CalculatorState): CalculatorState {
    return { ...state, memory: 0 };
  }

  private executeOperation(left: number, right: number, operation: OperationId): number {
    switch (operation) {
      case 'add':
        return left + right;
      case 'subtract':
        return left - right;
      case 'multiply':
        return left * right;
      case 'divide':
        return right === 0 ? Number.NaN : left / right;
    }
  }

  private formatNumber(value: number): string {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'Erro';
    }

    return Number.parseFloat(value.toFixed(8)).toString();
  }

  private getOperationSymbol(operation: OperationId): string {
    const symbols: Record<OperationId, string> = {
      add: '+',
      subtract: '-',
      multiply: 'x',
      divide: '/',
    };

    return symbols[operation];
  }
}
