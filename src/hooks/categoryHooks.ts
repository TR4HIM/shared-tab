'use client';
import { useCallback, useEffect, useState } from 'react';

export interface ExpenseCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async function () {
    setLoading(true);
    const response = await fetch('/api/categories');
    const responseJson = await response.json();

    if (responseJson.success) {
      setCategories(responseJson.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refreshCategories: fetchCategories };
}
