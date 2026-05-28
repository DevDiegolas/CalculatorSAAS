export type PlanId = 'free' | 'basic' | 'pro' | 'enterprise';

export type FeatureId =
  | 'reveal-result'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'history'
  | 'percentage'
  | 'square-root'
  | 'memory'
  | 'theme-basic'
  | 'theme-pro'
  | 'theme-enterprise';

export type OperationId = 'add' | 'subtract' | 'multiply' | 'divide';

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
}

export interface PlanStrategy {
  readonly planId: PlanId;
  canUseOperation(operation: OperationId): boolean;
  canUseFeature(feature: FeatureId): boolean;
}
