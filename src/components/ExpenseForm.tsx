import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { useCategories } from '@/hooks/categoryHooks';
import { formatDateForInput, setDateWithCurrentTime } from '@/lib/utils';
import {
  CreateExpenseInput,
  Expense,
  ParticipantShare,
  UpdateExpenseInput,
  createExpenseSchema,
  updateExpenseSchema,
} from '@/types/Expense';
import { GroupInput } from '@/types/Group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ExpenseParticipantManager } from './ExpenseParticipantManager';
import { LoadingSpinner } from './LoadingSpinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
// Base interface for ExpenseFormProps
interface BaseExpenseFormProps {
  initialValues: Partial<Expense>;
  onCancel?: () => void;
  submitButtonText: string;
  loading: boolean;
  initialParticipants?: ParticipantShare[];
  group: GroupInput;
  mode: 'CREATE' | 'UPDATE';
  onSubmit: (
    data: CreateExpenseInput | UpdateExpenseInput,
    participants: ParticipantShare[]
  ) => Promise<void>;
}

export function ExpenseForm({
  initialValues,
  mode,
  onSubmit,
  onCancel,
  submitButtonText,
  loading,
  initialParticipants,
  group,
}: Readonly<BaseExpenseFormProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUser = searchParams.get('fromUser');
  const toUser = searchParams.get('toUser');
  const amount = searchParams.get('amount');
  const { categories } = useCategories();

  const [isReimbursement, setIsReimbursement] = useState(false);
  const [fromUserName, setFromUserName] = useState<string | null>(null);
  const [toUserName, setToUserName] = useState<string | null>(null);
  // Define form schema based on the mode
  const formSchema =
    mode === 'CREATE' ? createExpenseSchema : updateExpenseSchema;

  // Setup form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialValues.id ?? undefined,
      groupId: group.id,
      title: initialValues.title ?? '',
      amount: initialValues.amount ?? 0,
      paidBy: initialValues.paidBy ?? '',
      date: initialValues.date ? new Date(initialValues.date) : new Date(),
      categoryId: initialValues.categoryId ?? null,
      isReimbursement: initialValues.isReimbursement ?? false,
    },
  });

  useEffect(() => {
    if (fromUser && toUser) {
      const fromUserName =
        group.members.find((m) => m.id === fromUser)?.name ?? '';
      const toUserName = group.members.find((m) => m.id === toUser)?.name ?? '';
      if (!fromUserName || !toUserName) {
        // handle error gracefully
        router.push(`/groups/${group.id}/expenses/new`);
        return;
      }
      setIsReimbursement(true);
      setFromUserName(fromUserName);
      setToUserName(toUserName);
    }
  }, [fromUser, toUser, group, router]);

  useEffect(() => {
    if (fromUserName && toUserName) {
      setIsReimbursement(true);
      const participants = [
        {
          userId: fromUser ?? '',
          userName: fromUserName ?? '',
          share: 0,
        },
        {
          userId: toUser ?? '',
          userName: toUserName ?? '',
          share: parseFloat(amount ?? '0'),
        },
      ];
      setParticipants(participants);
      form.setValue('paidBy', fromUser ?? '');
      form.setValue('amount', parseFloat(amount ?? '0'));
      form.setValue('isReimbursement', true);
      form.setValue(
        'categoryId',
        categories.find((c) => c.name === 'Payment')?.id ?? ''
      );
      form.setValue(
        'title',
        `Reimbursement from ${fromUserName} to ${toUserName}`
      );
    }
  }, [
    fromUser,
    toUser,
    categories,
    amount,
    form,
    group,
    fromUserName,
    toUserName,
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<ParticipantShare[]>(
    initialParticipants || []
  );
  const [participantError, setParticipantError] = useState<string | null>(null);

  const watchAmount = form.watch('amount');
  const watchPaidBy = form.watch('paidBy');

  useEffect(() => {
    if (
      !fromUser &&
      !toUser &&
      initialValues &&
      !form.formState.isSubmitting &&
      !form.formState.isDirty
    ) {
      if (initialValues.id !== undefined) {
        form.setValue('id', initialValues.id);
      }

      if (initialValues.groupId !== undefined) {
        form.setValue('groupId', group.id);
      }

      if (initialValues.title !== undefined) {
        form.setValue('title', initialValues.title);
      }

      if (initialValues.amount !== undefined) {
        form.setValue('amount', initialValues.amount);
      }

      if (initialValues.paidBy !== undefined) {
        form.setValue('paidBy', initialValues.paidBy);
      }

      if (initialValues.date !== undefined) {
        form.setValue('date', new Date(initialValues.date ?? new Date()));
      }

      if (initialValues.categoryId !== undefined) {
        form.setValue('categoryId', initialValues.categoryId);
      }
    }
  }, [initialValues, form, fromUser, toUser, group.id]);

  // Update participants when initialParticipants change
  useEffect(() => {
    if (
      initialParticipants &&
      initialParticipants.length > 0 &&
      !isSubmitting
    ) {
      setParticipants(initialParticipants);
    }
  }, [initialParticipants, isSubmitting]);

  useEffect(() => {
    if (isReimbursement) {
      return;
    }
    if ((watchAmount && watchAmount <= 0) || participants.length === 0) {
      setParticipantError(null);
      return;
    }

    const totalAmount = watchAmount ?? 0;
    const totalAllocated = participants.reduce((sum, p) => sum + p.share, 0);

    // Check if the difference is small enough (less than 1 cent)
    if (Math.abs(totalAmount - totalAllocated) <= 0.01) {
      setParticipantError(null);
    } else {
      const remaining = (totalAmount - totalAllocated).toFixed(2);
      setParticipantError(
        `All expense amount must be allocated. Remaining: ${remaining}`
      );
    }
  }, [participants, watchAmount, isReimbursement]);

  useEffect(() => {
    if (isReimbursement) {
      const participants = [
        {
          userId: fromUser ?? '',
          userName: fromUserName ?? '',
          share: 0,
        },
        {
          userId: toUser ?? '',
          userName: toUserName ?? '',
          share: watchAmount ?? 0,
        },
      ];
      setParticipants(participants);
    }
  }, [
    watchAmount,
    isReimbursement,
    fromUser,
    toUser,
    group,
    fromUserName,
    toUserName,
  ]);

  const handleParticipantsChange = (newParticipants: ParticipantShare[]) => {
    setParticipants(newParticipants);
    if (participantError) {
      setParticipantError(null);
    }
  };

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    const totalAmount = formData.amount ?? 0;
    const totalAllocated = participants.reduce((sum, p) => sum + p.share, 0);

    if (Math.abs(totalAmount - totalAllocated) > 0.01) {
      const remaining = (totalAmount - totalAllocated).toFixed(2);
      setParticipantError(
        `All expense amount must be allocated. Remaining: ${remaining}`
      );
      return;
    }

    setIsSubmitting(true);
    // Format participant shares consistently
    const participantsToSubmit = participants.map((p) => ({
      ...p,
      share: Number(Number(p.share).toFixed(2)),
    }));

    await onSubmit(
      {
        groupId: group.id,
        title: formData.title ?? '',
        amount: formData.amount ?? 0,
        paidBy: formData.paidBy ?? '',
        date: formData.date
          ? setDateWithCurrentTime(formData.date)
          : new Date(),
        categoryId: formData.categoryId,
        isReimbursement: formData.isReimbursement,
      },
      participantsToSubmit
    );
    setIsSubmitting(false);
  };

  const isLoading = loading || isSubmitting;
  const expenseAmount = watchAmount ?? 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto flex w-full flex-col gap-6"
        data-test-id="expense-form"
      >
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Expense title"
                          {...field}
                          disabled={isReimbursement}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <SelectInput
                          options={[
                            { id: '', name: 'No Category' },
                            ...categories.map((category) => ({
                              id: category.id,
                              name: category.name,
                            })),
                          ]}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Select a category"
                          disabled={isReimbursement}
                          data-test-id="category-select"
                          id={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paidBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid By</FormLabel>
                      <FormControl data-test-id={field.name}>
                        <SelectInput
                          options={group.members.map((member) => ({
                            id: member.id ?? '',
                            name: member.name,
                          }))}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Select a group member"
                          disabled={isReimbursement}
                          data-test-id="payer-select"
                          id={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={formatDateForInput(field.value)}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isReimbursement"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          ref={field.ref}
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          name={field.name}
                          disabled={isReimbursement}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        This is a reimbursement
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {isReimbursement === false ? (
            <Card>
              <CardHeader>
                <CardTitle>Expense Participants</CardTitle>
                <CardDescription>
                  Manage how this expense is split between participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {watchPaidBy && expenseAmount > 0 ? (
                  <ExpenseParticipantManager
                    expenseAmount={expenseAmount}
                    paidByUserId={watchPaidBy}
                    initialParticipants={participants}
                    onParticipantsChange={handleParticipantsChange}
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center text-black">
                    Please select a group, payer, and enter an amount to manage
                    participants.
                  </div>
                )}

                {participantError && (
                  <div className="mt-4 rounded border border-red-800 bg-red-900/30 px-4 py-2 text-red-300">
                    {participantError}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[40%] text-left text-sm font-medium text-gray-700">
                        User
                      </TableHead>
                      <TableHead className="text-sm font-medium text-gray-700">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.userId}>
                        <TableCell className="font-medium text-gray-900">
                          {participant.userName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="text"
                            value={participant.share.toString()}
                            className="w-28 text-right"
                            disabled={true}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              variant="outline"
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isLoading}>
            {submitButtonText}
            {isLoading && <LoadingSpinner />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
