import { useState, useEffect, useCallback } from 'react';
import { AccountDetailBaseModel, accountService } from '../../API/AccountService';
import { UserRole } from '../../Constant';

export function useAccountDetailModel<R extends UserRole>(expectedRole: R) {
  type Detail = Extract<AccountDetailBaseModel, { role: R }>;
  const [AccountDetailModel, setAccountDetailModel] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Simply get Account Detail info based on role and set in local storage, nothing else
  const getAccountDetailModel = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('User ID not found in localStorage');
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

     try {
      const result = await accountService.getDetailById(userId);
      if (!hasRole(result, expectedRole)) {
        setError(`Expected a ${expectedRole} account but received ${result.role}.`);
        return;
      }
      setAccountDetailModel(result);   // narrowed to Detail by the type guard
    } catch {
      setError('Failed to load account details.');
    } finally {
      setLoading(false);
    }

  }, [expectedRole]);

  useEffect(() => {
    getAccountDetailModel();
  }, [getAccountDetailModel]);

  

  return { AccountDetailModel, refetch: getAccountDetailModel, loading , error };
}

// Reusable narrowing helper, no casts needed at call sites
export function hasRole<R extends UserRole>(
  account: AccountDetailBaseModel,
  role: R
): account is Extract<AccountDetailBaseModel, { role: R }> {
  return account.role === role;
}

