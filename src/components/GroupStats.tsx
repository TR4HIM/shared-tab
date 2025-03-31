import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { SettlementResult } from '@/types/Expense';

interface GroupStatsProps {
  settlementResult: SettlementResult;
}

export function GroupStats({ settlementResult }: Readonly<GroupStatsProps>) {
  const { settlements, groupTotal } = settlementResult;

  const settlementsTotal = settlements.reduce(
    (acc, settlement) => acc + settlement.amount,
    0
  );

  return (
    <Card data-test-id="group-stats">
      <CardContent className="pt-4">
        <p className="text-sm">
          Total Group Transactions:{' '}
          <span className="text-xs font-bold text-green-500">
            {formatCurrency(groupTotal)}
          </span>
        </p>
        <p className="text-sm">
          Unsettled Balances:{' '}
          <span className="text-xs font-bold text-red-500">
            {formatCurrency(settlementsTotal)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
