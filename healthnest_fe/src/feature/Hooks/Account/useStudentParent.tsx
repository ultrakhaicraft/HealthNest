// feature/Hooks/Account/useParentStudents.tsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { accountService } from '../../API/AccountService';
import { StudentDetailModel } from '../../../models/AccountSubclassModels/StudentModel';

export function useParentStudents(parentId: string | undefined) {
  const [students, setStudents] = useState<StudentDetailModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!parentId) return;          // parent not loaded yet: nothing to do, not an error

    setLoading(true);
    setError(null);
    try {
      const result = await accountService.getStudentFromParentId(parentId);
      setStudents(result ?? []);
    } catch (err) {
      // Backend returns 404 when a parent has no linked students: that's an empty list, not a failure
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setStudents([]);
      } else {
        setError('Failed to load linked students.');
        setStudents([]);
      }
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { students, loading, error, refetch };
}