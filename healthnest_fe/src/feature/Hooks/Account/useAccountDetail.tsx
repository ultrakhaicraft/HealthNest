import { useState, useEffect, useCallback } from 'react';
import { AccountDetail, accountService, GetAllAccountsParams } from '../../API/AccountService';

export const  useAccountDetail =()=> {
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null);
  const [isStudentExist, setIsStudentExist] = useState<boolean>(true);
  const defaultQuery: GetAllAccountsParams = {
    FullName: '',
    Email: '',
    Role: '',
    Status: '',
    PageNumber: 1,
    PageSize: 5
  };

  const getAccountDetail = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('User ID not found in localStorage');
      return;
    }

    let result: AccountDetail;
    try {
      result = await accountService.getDetailById(userId); // assignment, no `const`/`let` here
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      return; // genuine failure — nothing more we can do
    }

    console.log(result);

    try {
      console.log(result.id);
      const studentDetail = await accountService.getStudentFromParentId(result.id, defaultQuery);
      const firstStudent = studentDetail.data[0];
      console.log(studentDetail);

      //TODO: Need to find a way to handle multiple child, like a multiple child dashboard thing
      if (firstStudent) {
        setIsStudentExist(true);
        result.studentId = firstStudent.id;
        result.studentName = firstStudent.fullName;
      } else {
        setIsStudentExist(false);
        result.studentId = "";
        result.studentName = "";
      }
    } catch {
      // 404 (or any failure) fetching linked student → treat as "no student linked"
      setIsStudentExist(false);
      result.studentId = "";
      result.studentName = "";
    }

    setAccountDetail(result);
    localStorage.setItem("accountDetail", JSON.stringify(result));

  }, []);

  useEffect(() => {
    getAccountDetail();
  }, [getAccountDetail]);

  return { accountDetail, isStudentExist, refetch: getAccountDetail };
}