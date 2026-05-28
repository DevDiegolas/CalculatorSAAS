import { useCallback, useMemo, useState } from 'react';
import { Calculator, ReceiptText } from 'lucide-react';
import { Button } from '../shared/ui/Button';
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
    <main className="app-shell h-dvh overflow-hidden bg-stone-100 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-3 py-2 sm:px-4 sm:py-3">
        <header className="mb-2 flex w-full items-center justify-between gap-2 border-b border-slate-200 pb-2 sm:mb-3 sm:gap-3 sm:pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950 text-white sm:h-10 sm:w-10">
              <Calculator size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-950 sm:text-xl">CalcPay</h1>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">
                Calculadora com recursos por assinatura.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <SubscriptionBadge plan={currentPlan} />
            </div>
            <Button
              className="h-10 w-10 px-0 sm:w-auto sm:px-4"
              icon={<ReceiptText size={17} />}
              onClick={() => openUpgrade()}
            >
              <span className="hidden sm:inline">Upgrade</span>
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
