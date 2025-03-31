import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';
import { RootState } from '@/store/rtk.store';
import { Settlement, SettlementResult, UserBalance } from '@/types/Expense';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SettlementPlan } from './SettlementPlan';

interface SettlementDetailsProps {
  settlementResult: SettlementResult;
  loading: boolean;
}

export function GroupSettlement({
  settlementResult,
  loading,
}: Readonly<SettlementDetailsProps>) {
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  const group = useSelector((state: RootState) => state.groups.activeGroup);

  const getBalanceStatusElement = (balance: number) => {
    if (balance > 0) return <span className="text-green-500">Gets paid</span>;
    if (balance < 0) return <span className="text-red-500">Owes money</span>;
    return <span className="text-gray-500">Settled</span>;
  };

  useEffect(() => {
    if (settlementResult) {
      setBalances(settlementResult.balances);
      setSettlements(settlementResult.settlements);
    }
  }, [settlementResult]);

  return (
    <div data-test-id="member-balances">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((balance) => (
                <TableRow key={balance.userId}>
                  <TableCell>{balance.userName}</TableCell>
                  <TableCell>{formatCurrency(balance.balance)}</TableCell>
                  <TableCell>
                    {getBalanceStatusElement(balance.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Settlement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length > 0 && group ? (
            <SettlementPlan
              settlements={settlements}
              loading={loading}
              groupId={group.id}
            />
          ) : (
            <div
              className="rounded-lg p-6 text-center"
              data-test-id="settlements-complete-message"
            >
              {settlements.length === 0 ? (
                <div className="mb-2 text-xl text-green-500">
                  ✓ All settlements completed!
                </div>
              ) : (
                <p>
                  All balances are settled! There are no payments to be made.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
