'use client';

import { ExpenseForm } from '@/components/ExpenseForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/Button';
import {
  useDeleteExpense,
  useExpense,
  useExpenseParticipants,
  useUpdateExpense,
} from '@/hooks';
import { RootState } from '@/store/rtk.store';
import { ParticipantShare, UpdateExpenseInput } from '@/types/Expense';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function EditExpensePage() {
  const params = useParams<{ id: string; expense_id: string }>();
  const router = useRouter();
  const { activeGroup: group } = useSelector(
    (state: RootState) => state.groups
  );
  const { expense, loading: expenseLoading } = useExpense(
    params.expense_id,
    params.id
  );
  const { participants: currentParticipants, loading: participantsLoading } =
    useExpenseParticipants(params.expense_id, params.id);
  const { updateExpense, loading: updating } = useUpdateExpense(
    params.expense_id,
    params.id
  );

  const { deleteExpense, loading: deleting } = useDeleteExpense();
  const [loading, setLoading] = useState(false);

  const formattedCurrentParticipants = currentParticipants.map((p) => ({
    id: p.id,
    userId: p.userId,
    userName: group?.members.find((m) => m.id === p.userId)?.name ?? '',
    share: Number(p.share),
  }));

  const handleUpdateExpense = async (
    data: UpdateExpenseInput,
    newParticipants: ParticipantShare[]
  ) => {
    setLoading(true);
    const response = await updateExpense(data, newParticipants);
    if (response.success) {
      router.push(`/groups/${params.id}`);
    }

    setLoading(false);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setLoading(true);
    const response = await deleteExpense(expenseId, params.id);
    if (response.success) {
      router.push(`/groups/${params.id}`);
    }

    setLoading(false);
  };
  if (expenseLoading || participantsLoading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="large" className="mx-auto" color="red" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          Expense not found
        </div>
        <Button
          className="mt-4"
          onClick={() => router.push(`/groups/${params.id}`)}
          variant="secondary"
        >
          Back to Group
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{group?.name}</h2>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => router.push(`/groups/${params.id}`)}
            variant="outline"
          >
            Back to group
          </Button>
        </div>
      </div>

      {group && (
        <div className="flex flex-col gap-4">
          <ExpenseForm
            onSubmit={handleUpdateExpense}
            initialValues={{
              id: params.expense_id,
              title: expense.title,
              amount: Number(expense.amount),
              date: new Date(expense.date),
              paidBy: expense.paidBy,
              groupId: expense.groupId,
              categoryId: expense.categoryId,
              isReimbursement: expense.isReimbursement,
            }}
            mode="UPDATE"
            submitButtonText="Update Expense"
            loading={loading || updating}
            initialParticipants={formattedCurrentParticipants}
            group={group}
          />
          {/* Delete Expense Button */}
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Expense</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this expense.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteExpense(params.expense_id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <LoadingSpinner size="small" color="white" />
                    ) : (
                      'Delete Expense'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
