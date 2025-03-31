'use client';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RootState } from '@/store/rtk.store';
import { Expense } from '@prisma/client';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function ExpensesList({
  expenses,
}: Readonly<{ expenses: Expense[] }>) {
  const { activeGroup: group } = useSelector(
    (state: RootState) => state.groups
  );
  return (
    <Card>
      <CardContent className="pt-4">
        {expenses.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <Link
                key={expense.id}
                href={`/groups/${expense.groupId}/expenses/${expense.id}/edit`}
                className="block transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <span className="text-sm font-medium text-blue-600">
                        {expense.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {expense.title}
                      </p>
                      <p className="ml-2 flex-shrink-0 text-sm font-semibold text-green-600">
                        {formatCurrency(Number(expense.amount))}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>Paid by</span>
                      <span className="font-medium text-gray-900">
                        {
                          group?.members.find(
                            (member) => member.id === expense.paidBy
                          )?.name
                        }
                      </span>
                      <span>•</span>

                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-gray-900">
              No expenses found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first expense to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
