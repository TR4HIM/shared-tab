'use client';

import { ExpenseForm } from '@/components/ExpenseForm';
import { Button } from '@/components/ui/Button';
import { useCreateExpense } from '@/hooks';
import { RootState } from '@/store/rtk.store';
import { CreateExpenseInput, ParticipantShare } from '@/types/Expense';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
export default function NewExpensePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const fromUser = searchParams.get('fromUser');
  const toUser = searchParams.get('toUser');

  const { activeGroup: group } = useSelector(
    (state: RootState) => state.groups
  );
  const { createExpense, loading: creatingExpense } = useCreateExpense(
    params.id
  );

  const handleSubmit = async (
    data: CreateExpenseInput,
    participants: ParticipantShare[]
  ) => {
    const response = await createExpense(data, participants);

    if (response.success && response.data?.id) {
      router.push(`/groups/${group?.id}`);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {group && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">{group.name}</h2>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  router.push(`/groups/${group.id}`);
                }}
                variant="secondary"
              >
                Back to group
              </Button>
            </div>
          </div>

          <ExpenseForm
            onSubmit={(data, participants) =>
              handleSubmit(data as unknown as CreateExpenseInput, participants)
            }
            initialValues={{
              groupId: group.id,
              title: '',
              amount: 0,
              date: new Date(),
              paidBy: '',
            }}
            mode="CREATE"
            submitButtonText={
              fromUser && toUser ? 'Settle up' : 'Create Expense'
            }
            loading={creatingExpense}
            group={group}
          />
        </div>
      )}
    </div>
  );
}
