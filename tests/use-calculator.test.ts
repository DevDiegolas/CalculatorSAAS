import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCalculator } from '../src/features/calculator/hooks/useCalculator';
import { SubscriptionService } from '../src/features/subscriptions/services/SubscriptionService';
import type { SubscriptionStorage } from '../src/features/subscriptions/services/SubscriptionStorage';
import type { PlanId } from '../src/features/subscriptions/types/Plan';

class MemorySubscriptionStorage implements SubscriptionStorage {
  constructor(private planId: PlanId = 'free') {}

  getCurrentPlan(): PlanId {
    return this.planId;
  }

  setCurrentPlan(planId: PlanId): void {
    this.planId = planId;
  }
}

describe('useCalculator', () => {
  it('hides intermediate chained results when result reveal is locked', () => {
    const subscriptionService = new SubscriptionService(new MemorySubscriptionStorage('free'));
    const { result } = renderHook(() => useCalculator(subscriptionService));

    act(() => {
      result.current.inputDigit('2');
      result.current.inputDigit('2');
      result.current.add();
      result.current.inputDigit('2');
      result.current.inputDigit('2');
      result.current.add();
    });

    expect(result.current.hiddenResult).toBe('44');
    expect(result.current.state.display).toBe('44');
  });
});
