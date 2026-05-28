import { describe, expect, it } from 'vitest';
import { CalculatorService } from '../../../src/features/calculator/services/CalculatorService';

describe('CalculatorService', () => {
  it('calculates a basic addition', () => {
    const service = new CalculatorService();
    let state = service.getInitialState();

    state = service.inputDigit(state, '2');
    state = service.setOperation(state, 'add');
    state = service.inputDigit(state, '2');

    const result = service.calculate(state);

    expect(result.state.display).toBe('4');
    expect(result.expression).toBe('2 + 2');
  });

  it('keeps calculation history after a result', () => {
    const service = new CalculatorService();
    let state = service.getInitialState();

    state = service.inputDigit(state, '8');
    state = service.setOperation(state, 'multiply');
    state = service.inputDigit(state, '7');

    const result = service.calculate(state);

    expect(result.state.history).toEqual([{ expression: '8 x 7', result: '56' }]);
  });

  it('calculates chained additions like a standard calculator', () => {
    const service = new CalculatorService();
    let state = service.getInitialState();

    state = service.inputDigit(state, '2');
    state = service.inputDigit(state, '2');
    state = service.setOperation(state, 'add');
    state = service.inputDigit(state, '2');
    state = service.inputDigit(state, '2');
    state = service.setOperation(state, 'add');
    state = service.inputDigit(state, '3');
    state = service.inputDigit(state, '4');

    const result = service.calculate(state);

    expect(result.expression).toBe('22 + 22 + 34');
    expect(result.state.display).toBe('78');
  });
});
