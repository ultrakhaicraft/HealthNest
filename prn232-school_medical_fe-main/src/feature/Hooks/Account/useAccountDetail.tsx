import { useState, useEffect, useCallback } from 'react';
import { AccountDetail, accountService } from '../../API/AccountService';

export function useAccountDetail() {
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null);
  const [isStudentExist, setIsStudentExist] = useState<boolean>(true);

  const getAccountDetail = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('User ID not found in localStorage');
      return;
    }

    try {
      const result = await accountService.getDetailById(userId);

      console.log('Account detail fetched successfully:', result);

      // TODO: verify this — if a parent has no linked student, getStudentFromParentId
      // likely throws (e.g. 404) rather than resolving to null/undefined. If so, this
      // whole block never reaches the if/else below, the outer catch swallows it,
      // and setAccountDetail/setIsStudentExist(false) never fire — meaning a parent
      // with no linked student may see a broken homepage instead of the
      // "no student linked" alert. Confirm actual backend behavior and consider
      // wrapping this call in its own try/catch if it does throw on no-student.
      const studentDetail = await accountService.getStudentFromParentId(result.id);

      if (studentDetail) {
        setIsStudentExist(true);
        result.studentId = studentDetail.id;
        result.studentName = studentDetail.fullName;
      } else {
        setIsStudentExist(false);
        result.studentId = "";
        result.studentName = "";
      }

      setAccountDetail(result);
      localStorage.setItem("accountDetail", JSON.stringify(result));
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }
  }, []);

  useEffect(() => {
    getAccountDetail();
  }, [getAccountDetail]);

  return { accountDetail, isStudentExist, refetch: getAccountDetail };
}