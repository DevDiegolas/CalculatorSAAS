import { useCallback, useMemo, useState } from 'react';
import { Calculator, ReceiptText } from 'lucide-react';
import { Button } from '../shared/components/Button';
import { CalculatorShell } from '../features/calculator/components/CalculatorShell';
import { UpgradeModal } from '../features/subscriptions/components/UpgradeModal';
import { SubscriptionBadge } from '../features/subscriptions/components/SubscriptionBadge';
import { SubscriptionService } from '../features/subscriptions/services/SubscriptionService';
import { LocalSubscriptionStorage } from '../features/subscriptions/services/SubscriptionStorage';
import type { Plan } from '../features/subscriptions/types/Plan';

export function App() {
  const subscriptionService = useMemo(
    () => new SubscriptionService(new LocalSubscriptionStorage()),
    [],
  );
  const [currentPlan, setCurrentPlan] = useState<Plan>(() => subscriptionService.getCurrentPlan());
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<string | undefined>();

  const openUpgrade = useCallback((message?: string) => {
    setLockedMessage(message);
    setIsUpgradeOpen(true);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-stone-100 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-3">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white">
              <Calculator size={21} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-950">CalcPay</h1>
              <p className="text-xs font-medium text-slate-500">
                Calculadora com recursos por assinatura.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SubscriptionBadge plan={currentPlan} />
            <Button icon={<ReceiptText size={17} />} onClick={() => openUpgrade()}>
              Upgrade
            </Button>
          </div>
        </header>

        <CalculatorShell
          canShowHistory={subscriptionService.canUseFeature('history')}
          onBlocked={openUpgrade}
          subscriptionService={subscriptionService}
        />
      </div>

      <UpgradeModal
        currentPlan={currentPlan}
        isOpen={isUpgradeOpen}
        lockedMessage={lockedMessage}
        onClose={() => setIsUpgradeOpen(false)}
        onUpgrade={(planId) => {
          setCurrentPlan(subscriptionService.upgradeTo(planId));
          setLockedMessage(undefined);
        }}
      />
    </main>
  );
}
