import { describe, expect, it } from 'vitest';
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

describe('SubscriptionService', () => {
  it('blocks result reveal for free users', () => {
    const service = new SubscriptionService(new MemorySubscriptionStorage('free'));

    expect(service.canUseOperation('add')).toBe(true);
    expect(service.canUseFeature('reveal-result')).toBe(false);
  });

  it('unlocks advanced operations on pro', () => {
    const service = new SubscriptionService(new MemorySubscriptionStorage('basic'));

    service.upgradeTo('pro');

    expect(service.canUseOperation('multiply')).toBe(true);
    expect(service.canUseOperation('divide')).toBe(true);
    expect(service.canUseFeature('history')).toBe(true);
    expect(service.canUseFeature('percentage')).toBe(false);
  });

  it('unlocks executive nonsense on enterprise', () => {
    const service = new SubscriptionService(new MemorySubscriptionStorage('enterprise'));

    expect(service.canUseFeature('percentage')).toBe(true);
    expect(service.canUseFeature('square-root')).toBe(true);
    expect(service.canUseFeature('memory')).toBe(true);
  });
});
