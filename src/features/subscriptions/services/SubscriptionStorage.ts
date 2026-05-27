import type { PlanId } from '../types/Plan';

export interface SubscriptionStorage {
  getCurrentPlan(): PlanId;
  setCurrentPlan(planId: PlanId): void;
}

const STORAGE_KEY = 'calcpay.currentPlan';
const validPlans = new Set<PlanId>(['free', 'basic', 'pro', 'enterprise']);

export class LocalSubscriptionStorage implements SubscriptionStorage {
  getCurrentPlan(): PlanId {
    const storedPlan = localStorage.getItem(STORAGE_KEY);
    return validPlans.has(storedPlan as PlanId) ? (storedPlan as PlanId) : 'free';
  }

  setCurrentPlan(planId: PlanId): void {
    localStorage.setItem(STORAGE_KEY, planId);
  }
}
