import prisma from '@/lib/prisma';
import { generateUUID, uuidToBase62 } from '@/lib/utils';
import {
  CreateExpenseInput,
  ExpenseWithRelations,
  ParticipantShare,
  UpdateExpenseInput,
} from '@/types/Expense';
import type {
  Expense,
  ExpenseCategory,
  ExpenseParticipant,
} from '@prisma/client';

export async function getExpenses(): Promise<ExpenseWithRelations[]> {
  return prisma.expense.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      group: true,
      payer: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getExpenseById(
  id: string
): Promise<ExpenseWithRelations | null> {
  return prisma.expense.findUnique({
    where: { id },
    include: {
      group: true,
      payer: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getExpenseCategory(
  id: string
): Promise<ExpenseCategory | null> {
  return await prisma.expenseCategory.findUnique({
    where: { id },
  });
}

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return await prisma.expenseCategory.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createExpense(
  data: CreateExpenseInput,
  participants: ParticipantShare[]
): Promise<Expense | null> {
  const id = uuidToBase62(generateUUID());
  const localParticipants = participants.map((p) => ({
    id: uuidToBase62(generateUUID()),
    share: Number(Number(p.share).toFixed(2)),
    expenseId: id,
    userId: p.userId,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.expense.create({
      data: {
        id,
        title: data.title,
        amount: data.amount,
        paidBy: data.paidBy,
        date: data.date,
        categoryId: data.categoryId,
        groupId: data.groupId,
        isReimbursement: data.isReimbursement,
      },
    });

    // Create all members at once using createMany
    await tx.expenseParticipant.createMany({
      data: localParticipants,
    });
  });

  return prisma.expense.findUnique({
    where: { id },
    include: {
      group: true,
      payer: true,
      participants: true,
    },
  });
}

export async function updateExpense(
  id: string,
  data: UpdateExpenseInput,
  participants: ParticipantShare[]
): Promise<Expense | null> {
  const localParticipants = participants.map((p) => ({
    id: uuidToBase62(generateUUID()),
    share: Number(Number(p.share).toFixed(2)),
    expenseId: id,
    userId: p.userId,
  }));

  await prisma.$transaction(async (tx) => {
    // Create the group
    await tx.expense.update({
      where: { id },
      data,
      include: {
        group: true,
        payer: true,
        participants: true,
      },
    });

    // Create all members at once using createMany
    await tx.expenseParticipant.deleteMany({
      where: { expenseId: id },
    });

    await tx.expenseParticipant.createMany({
      data: localParticipants,
    });
  });

  return prisma.expense.findUnique({
    where: { id },
    include: {
      group: true,
      payer: true,
      participants: true,
    },
  });
}

export async function deleteExpense(id: string): Promise<Expense> {
  await prisma.expenseParticipant.deleteMany({
    where: { expenseId: id },
  });

  return prisma.expense.delete({
    where: { id },
    include: {
      group: true,
      payer: true,
      participants: true,
    },
  });
}

export async function getExpenseParticipants(
  expenseId: string
): Promise<ExpenseParticipant[]> {
  return prisma.expenseParticipant.findMany({
    where: { expenseId },
    include: {
      user: true,
      expense: true,
    },
  });
}

export async function getExpensesByGroup(
  groupId: string
): Promise<ExpenseWithRelations[]> {
  return prisma.expense.findMany({
    where: {
      groupId,
    },
    orderBy: {
      date: 'desc',
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}
