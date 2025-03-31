import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Helper for dealing with Decimal in zod
const decimalParser = (val: unknown) => {
  if (typeof val === 'string') return parseFloat(val);
  if (typeof val === 'number') return val;
  return undefined;
};

// Schema for creating and updating expenses
export const expenseSchema = z.object({
  id: z.string().optional(),
  groupId: z.string().min(1, 'Group ID is required'),
  title: z.string().min(1, 'Title is required'),
  amount: z.preprocess(
    decimalParser,
    z.number().min(0, 'Amount must be positive')
  ),
  paidBy: z.string().min(1, 'Payer ID is required'),
  date: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date()
  ),
  categoryId: z.string().nullable().optional(),
  isReimbursement: z.boolean().optional().default(false),
});
export type Expense = z.infer<typeof expenseSchema>;

export const createExpenseSchema = expenseSchema;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = expenseSchema.omit({ id: true }).partial();
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const expenseParticipantSchema = z.object({
  id: z.string().optional(),
  expenseId: z.string().min(1, 'Expense ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  share: z.preprocess(
    decimalParser,
    z.number().min(0, 'Share must be positive')
  ),
});

export const createExpenseParticipantSchema = expenseParticipantSchema;
export type CreateExpenseParticipantInput = z.infer<
  typeof createExpenseParticipantSchema
>;

export const updateExpenseParticipantSchema = expenseParticipantSchema
  .omit({ id: true, expenseId: true })
  .partial();
export type UpdateExpenseParticipantInput = z.infer<
  typeof updateExpenseParticipantSchema
>;

export type ExpenseWithRelations = Prisma.ExpenseGetPayload<{
  include: {
    participants: {
      include: {
        user: true;
      };
    };
  };
}>;

// Types for group settlement calculations
export interface UserBalance {
  userId: string;
  userName: string;
  balance: number; // Positive means they are owed money, negative means they owe money
}

export interface Settlement {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

export interface ExpenseLog {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  date: Date;
  isReimbursement: boolean;
  shares: {
    user: string;
    share: number;
    settled: boolean;
  }[];
}

export interface SettlementLog {
  id: string;
  fromUser: string;
  toUser: string;
  amount: number;
  completedAt: Date;
}

export interface ActivityLogs {
  expenses: ExpenseLog[];
}

export interface SettlementResult {
  balances: UserBalance[];
  settlements: Settlement[];
  groupTotal: number;
  allParticipants: string[];
}

export interface ParticipantShare {
  userId: string;
  userName: string;
  share: number;
}

export interface ExpenseParticipantManagerProps {
  expenseAmount: number;
  paidByUserId: string;
  onParticipantsChange: (participants: ParticipantShare[]) => void;
  initialParticipants?: ParticipantShare[];
}
