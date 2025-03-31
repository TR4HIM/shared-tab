'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Settlement } from '@/types/Expense';
import { useRouter } from 'next/navigation';
interface SettlementDetailsProps {
  settlements: Settlement[];
  loading: boolean;
  groupId: string;
}

export function SettlementPlan({
  settlements,
  loading,
  groupId,
}: Readonly<SettlementDetailsProps>) {
  const router = useRouter();

  const goToLink = (settlement: Settlement) => {
    router.push(
      `/groups/${groupId}/expenses/new?fromUser=${settlement.fromUserId}&toUser=${settlement.toUserId}&amount=${settlement.amount}`
    );
  };

  return (
    <div data-test-id="settlement-plan" className="relative">
      {loading && (
        <span className="absolute left-0 right-0 top-[-50px] flex items-center justify-center">
          <LoadingSpinner size="small" color="blue" />
        </span>
      )}
      <div className="space-y-2">
        {settlements.map((settlement, index) => (
          <div
            key={`${settlement.fromUserId}-${settlement.toUserId}`}
            className="flex flex-col items-start justify-between rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"
            data-test-id={`settlement-item-${index}`}
          >
            <div className="mb-2 flex flex-col space-y-0.5 sm:mb-0">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Payment from
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600">
                  {settlement.fromUserName}
                </span>
                <span className="text-xs font-medium font-semibold text-black">
                  owes
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {settlement.toUserName}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {formatCurrency(settlement.amount)}
              </div>
              <Button
                onClick={() => goToLink(settlement)}
                data-test-id={`mark-settled-button-${index}`}
                size="sm"
                className="w-full sm:w-auto" // Added width control for mobile
              >
                Mark as Settled
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
