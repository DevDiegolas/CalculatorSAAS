import { Crown } from 'lucide-react';
import type { Plan } from '../types/Plan';

interface SubscriptionBadgeProps {
  plan: Plan;
}

export function SubscriptionBadge({ plan }: SubscriptionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 ring-1 ring-slate-200">
      <Crown size={16} className="text-amber-500" />
      <span className="hidden sm:inline">Plano</span>
      <span>{plan.name}</span>
    </div>
  );
}
