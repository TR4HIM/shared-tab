'use client';
import { ActivityLogs, SettlementResult } from '@/types/Expense';
import { useState } from 'react';

export function useGroupSettlement(groupId: string) {
  const [loading, setLoading] = useState(false);
  const [settlementResult, setSettlementResult] =
    useState<SettlementResult | null>(null);

  async function calculateSettlement() {
    setLoading(true);
    const response = await fetch(`/api/groups/${groupId}/settlements`);
    const responseJson = await response.json();

    if (responseJson.success) {
      setSettlementResult(responseJson.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
    return responseJson;
  }

  return { calculateSettlement, settlementResult, loading };
}

export function useGroupActivities(groupId: string) {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityLogs | null>(null);

  async function getActivities() {
    setLoading(true);
    const response = await fetch(`/api/groups/${groupId}/activities`);
    const responseJson = await response.json();
    if (responseJson.success) {
      setActivities(responseJson.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
    return responseJson;
  }

  return { getActivities, activities, loading };
}
