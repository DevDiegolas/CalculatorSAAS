import type { FeatureId, OperationId, PlanId } from '../types/Plan';

export type LockedCapability =
  | { kind: 'feature'; id: FeatureId }
  | { kind: 'operation'; id: OperationId };

export const planRequirementOrder: PlanId[] = ['free', 'basic', 'pro', 'enterprise'];

export const featurePlanRequirements: Record<FeatureId, PlanId> = {
  'reveal-result': 'basic',
  subtraction: 'basic',
  multiplication: 'pro',
  division: 'pro',
  history: 'pro',
  percentage: 'enterprise',
  'square-root': 'enterprise',
  memory: 'enterprise',
  'theme-basic': 'basic',
  'theme-pro': 'pro',
  'theme-enterprise': 'enterprise',
};

export const operationPlanRequirements: Record<OperationId, PlanId> = {
  add: 'free',
  subtract: 'basic',
  multiply: 'pro',
  divide: 'pro',
};

export function getRequiredPlan(capability: LockedCapability): PlanId {
  if (capability.kind === 'feature') {
    return featurePlanRequirements[capability.id];
  }

  return operationPlanRequirements[capability.id];
}
