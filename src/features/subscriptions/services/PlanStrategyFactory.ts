import {
  BasicPlanStrategy,
  EnterprisePlanStrategy,
  FreePlanStrategy,
  ProPlanStrategy,
} from '../strategies/PlanStrategies';
import type { PlanId, PlanStrategy } from '../types/Plan';

export class PlanStrategyFactory {
  create(planId: PlanId): PlanStrategy {
    switch (planId) {
      case 'basic':
        return new BasicPlanStrategy();
      case 'pro':
        return new ProPlanStrategy();
      case 'enterprise':
        return new EnterprisePlanStrategy();
      case 'free':
      default:
        return new FreePlanStrategy();
    }
  }
}
