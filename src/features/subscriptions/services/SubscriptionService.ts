import { plans } from '../data/plans';
import { PlanStrategyFactory } from './PlanStrategyFactory';
import type { SubscriptionStorage } from './SubscriptionStorage';
import type { FeatureId, OperationId, Plan, PlanId, PlanStrategy } from '../types/Plan';

export class SubscriptionService {
  private readonly strategyFactory = new PlanStrategyFactory();

  constructor(private readonly storage: SubscriptionStorage) {}

  getCurrentPlan(): Plan {
    return plans.find((plan) => plan.id === this.storage.getCurrentPlan()) ?? plans[0];
  }

  getCurrentStrategy(): PlanStrategy {
    return this.strategyFactory.create(this.storage.getCurrentPlan());
  }

  upgradeTo(planId: PlanId): Plan {
    this.storage.setCurrentPlan(planId);
    return this.getCurrentPlan();
  }

  canUseOperation(operation: OperationId): boolean {
    return this.getCurrentStrategy().canUseOperation(operation);
  }

  canUseFeature(feature: FeatureId): boolean {
    return this.getCurrentStrategy().canUseFeature(feature);
  }

  getLockedMessage(featureName: string): string {
    return this.getCurrentStrategy().getLockedMessage(featureName);
  }
}
