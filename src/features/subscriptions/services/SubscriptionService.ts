import { plans } from '../data/plans';
import {
  getRequiredPlan,
  planRequirementOrder,
  type LockedCapability,
} from '../data/planRequirements';
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

  getLockedMessage(featureName: string, capability?: LockedCapability): string {
    if (!capability) {
      return `${featureName} esta disponivel mediante upgrade de plano.`;
    }

    const requiredPlanId = getRequiredPlan(capability);
    const requiredPlan = plans.find((plan) => plan.id === requiredPlanId);
    const currentPlan = this.getCurrentPlan();
    const currentPlanIndex = planRequirementOrder.indexOf(currentPlan.id);
    const requiredPlanIndex = planRequirementOrder.indexOf(requiredPlanId);

    if (!requiredPlan || currentPlanIndex >= requiredPlanIndex) {
      return `${featureName} esta indisponivel no momento.`;
    }

    return `${featureName} exige o plano ${requiredPlan.name}. Seu plano atual e ${currentPlan.name}.`;
  }
}
