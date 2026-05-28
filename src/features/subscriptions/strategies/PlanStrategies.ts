import type { FeatureId, OperationId, PlanId, PlanStrategy } from '../types/Plan';

abstract class BasePlanStrategy implements PlanStrategy {
  abstract readonly planId: PlanId;
  protected abstract readonly operations: ReadonlySet<OperationId>;
  protected abstract readonly features: ReadonlySet<FeatureId>;

  canUseOperation(operation: OperationId): boolean {
    return this.operations.has(operation);
  }

  canUseFeature(feature: FeatureId): boolean {
    return this.features.has(feature);
  }
}

export class FreePlanStrategy extends BasePlanStrategy {
  readonly planId = 'free' as const;
  protected readonly operations = new Set<OperationId>(['add']);
  protected readonly features = new Set<FeatureId>();
}

export class BasicPlanStrategy extends BasePlanStrategy {
  readonly planId = 'basic' as const;
  protected readonly operations = new Set<OperationId>(['add', 'subtract']);
  protected readonly features = new Set<FeatureId>(['reveal-result', 'theme-basic']);
}

export class ProPlanStrategy extends BasePlanStrategy {
  readonly planId = 'pro' as const;
  protected readonly operations = new Set<OperationId>(['add', 'subtract', 'multiply', 'divide']);
  protected readonly features = new Set<FeatureId>([
    'reveal-result',
    'history',
    'theme-basic',
    'theme-pro',
  ]);
}

export class EnterprisePlanStrategy extends BasePlanStrategy {
  readonly planId = 'enterprise' as const;
  protected readonly operations = new Set<OperationId>(['add', 'subtract', 'multiply', 'divide']);
  protected readonly features = new Set<FeatureId>([
    'reveal-result',
    'history',
    'percentage',
    'square-root',
    'memory',
    'theme-basic',
    'theme-pro',
    'theme-enterprise',
  ]);
}
