'use client';
import { ExpenseParticipant } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

export type ExpenseParticipantWithRelations = ExpenseParticipant;

export function useExpenseParticipants(expenseId: string, groupId: string) {
  const [participants, setParticipants] = useState<
    ExpenseParticipantWithRelations[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(
    async function () {
      setLoading(true);
      const response = await fetch(
        `/api/groups/${groupId}/expenses/${expenseId}/participants`
      );
      const responseJson = await response.json();
      if (responseJson.success) {
        setParticipants(responseJson.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    [expenseId, groupId]
  );

  useEffect(() => {
    if (expenseId && groupId) {
      fetchParticipants();
    }
  }, [expenseId, groupId, fetchParticipants]);

  return { participants, loading, refreshParticipants: fetchParticipants };
}
