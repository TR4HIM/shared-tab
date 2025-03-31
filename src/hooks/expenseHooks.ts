'use client';
import {
  CreateExpenseInput,
  ExpenseWithRelations,
  ParticipantShare,
  UpdateExpenseInput,
} from '@/types/Expense';
import { useCallback, useEffect, useState } from 'react';

export function useGroupExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<ExpenseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(
    async function () {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}/expenses`);
      const responseJson = await response.json();

      if (responseJson.success) {
        setExpenses(responseJson.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    [groupId]
  );

  useEffect(() => {
    if (groupId) {
      fetchExpenses();
    }
  }, [groupId, fetchExpenses]);

  return { expenses, loading, refreshExpenses: fetchExpenses };
}

export function useExpense(id: string, groupId: string) {
  const [expense, setExpense] = useState<ExpenseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpense() {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}/expenses/${id}`);
      const responseJson = await response.json();

      if (responseJson.success) {
        setExpense(responseJson.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchExpense();
  }, [id, groupId]);

  return { expense, loading };
}

export function useCreateExpense(groupId: string) {
  const [loading, setLoading] = useState(false);

  async function createExpense(
    expense: CreateExpenseInput,
    participants: ParticipantShare[]
  ) {
    setLoading(true);
    const response = await fetch(`/api/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...expense,
        participants,
      }),
    });
    const responseJson = await response.json();

    return responseJson;
  }

  return { createExpense, loading };
}

export function useUpdateExpense(id: string, groupId: string) {
  const [loading, setLoading] = useState(false);

  async function updateExpense(
    expenseData: UpdateExpenseInput,
    participants: ParticipantShare[]
  ) {
    setLoading(true);

    const response = await fetch(`/api/groups/${groupId}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...expenseData,
        participants,
      }),
    });
    const responseJson = await response.json();

    return responseJson;
  }

  return { updateExpense, loading };
}

export function useDeleteExpense() {
  const [loading, setLoading] = useState(false);
  const [expenseId, setExpenseId] = useState<string | null>(null);

  async function deleteExpense(id: string, groupId: string) {
    setLoading(true);
    setExpenseId(id);
    const response = await fetch(`/api/groups/${groupId}/expenses/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    return responseJson;
  }

  return { deleteExpense, loading, expenseId };
}
