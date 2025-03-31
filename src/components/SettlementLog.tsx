import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDateWithTime } from '@/lib/utils';
import { ActivityLogs, ExpenseLog } from '@/types/Expense';

interface SettlementLogProps {
  activityLogs?: ActivityLogs;
}

export function SettlementLog({ activityLogs }: Readonly<SettlementLogProps>) {
  const renderLogContent = (log: ExpenseLog) => {
    if (!log.isReimbursement) {
      return (
        <div>
          <div>
            <span className="font-medium">{log.title}</span>{' '}
            <span className="text-blue-500">{formatCurrency(log.amount)}</span>{' '}
            <span className="text-xs text-gray-500">
              paid by {log.paidBy} on {formatDateWithTime(log.date)}
            </span>
          </div>
          <div className="mt-1 pl-2">
            <span className="text-xs">Shared between:</span>
            <ul className="mt-1 list-none pl-2 text-xs">
              {log.shares.map((share) => (
                <li key={share.user}>
                  {share.user}: {formatCurrency(share.share)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div>
        <span className="font-medium">{log.paidBy}</span> paid{' '}
        <span className="font-medium">
          {log.shares
            .filter((share) => share.user !== log.paidBy)
            .map((share) => share.user)
            .join(', ')}
        </span>{' '}
        <span className="text-green-500">{formatCurrency(log.amount)}</span>{' '}
        <span className="text-xs text-gray-500">
          on {formatDateWithTime(log.date)}
        </span>
      </div>
    );
  };

  if (!activityLogs) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-4">
        {activityLogs.expenses.length > 0 ? (
          <ul className="list-none space-y-3 text-sm">
            {activityLogs.expenses.map((log) => (
              <li
                key={log.id}
                className={`border-l-2 ${
                  log.isReimbursement ? 'border-green-600' : 'border-blue-600'
                } py-2 pl-3`}
              >
                {renderLogContent(log)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm">No activity logs available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
