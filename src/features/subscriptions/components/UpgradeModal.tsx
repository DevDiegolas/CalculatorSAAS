import { useEffect, useState } from 'react';
import { BadgeCheck, Check, Loader2, LockKeyhole, Sparkles } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { plans } from '../data/plans';
import type { Plan, PlanId } from '../types/Plan';

interface UpgradeModalProps {
  currentPlan: Plan;
  isOpen: boolean;
  lockedMessage?: string;
  onClose: () => void;
  onUpgrade: (planId: PlanId) => void;
}

export function UpgradeModal({
  currentPlan,
  isOpen,
  lockedMessage,
  onClose,
  onUpgrade,
}: UpgradeModalProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setCheckoutPlan(null);
      setCheckoutStatus('idle');
    }
  }, [isOpen]);

  const startCheckout = (planId: PlanId) => {
    setCheckoutPlan(planId);
    setCheckoutStatus('processing');

    window.setTimeout(() => {
      setCheckoutStatus('success');
      onUpgrade(planId);
    }, 1100);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Central de Assinaturas">
      {lockedMessage ? (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <LockKeyhole className="mt-0.5 shrink-0" size={19} />
          <p className="text-sm font-semibold">{lockedMessage}</p>
        </div>
      ) : null}

      {checkoutStatus !== 'idle' ? (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
            {checkoutStatus === 'processing' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Check size={22} strokeWidth={3} />
            )}
          </div>
          <div>
            <p className="font-black">
              {checkoutStatus === 'processing' ? 'Processando compra' : 'Compra concluida'}
            </p>
            <p className="text-sm font-medium text-emerald-800">
              {checkoutStatus === 'processing'
                ? 'Confirmando assinatura...'
                : 'Plano liberado com sucesso.'}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan.id;
          const isProcessingThisPlan = checkoutPlan === plan.id && checkoutStatus === 'processing';
          const isBusy = checkoutStatus === 'processing';

          return (
            <article
              className="flex min-h-64 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
              key={plan.id}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-950">{plan.name}</h3>
                  <p className="text-sm font-bold text-emerald-700">{plan.price}</p>
                </div>
                {isCurrent ? <BadgeCheck className="text-emerald-600" size={19} /> : null}
              </div>
              <p className="mb-3 text-sm text-slate-600">{plan.tagline}</p>
              <ul className="mb-4 flex flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <li className="flex gap-2 text-xs font-medium text-slate-700" key={feature}>
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-sky-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                disabled={isCurrent || isBusy}
                icon={isProcessingThisPlan ? <Loader2 className="animate-spin" size={16} /> : null}
                onClick={() => startCheckout(plan.id)}
                variant={isCurrent ? 'secondary' : 'primary'}
              >
                {isCurrent ? 'Plano atual' : 'Assinar'}
              </Button>
            </article>
          );
        })}
      </div>
    </Modal>
  );
}
