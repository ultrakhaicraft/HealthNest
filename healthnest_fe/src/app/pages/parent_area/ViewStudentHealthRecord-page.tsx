import UserHomeNavBar from '../../../components/ParentStudentHomepage/ParentHomeNavBar';
import Footer from '../../../components/Landing_Page/footer';
import RecordEmptyView from '../../../components/Student_Health_Record/EmptyRecordView'

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../../../components/Notification/Toast';
import MedicalRecordView from '../../../components/Student_Health_Record/MedicalRecordView';
import { StudentHealthRecordDetail, StudentHealthRecordService } from '../../../feature/API/StudentHealthRecordService';
import { AccountDetailModel } from '../../../models/AccountModel';
import ParentHomeNavBar from '../../../components/ParentStudentHomepage/ParentHomeNavBar';
import { useUserRole } from '../../../feature/Hooks/Account/AccountHooks';
import ParentStudentHealthRecordViewPanel from '../../../components/Student_Health_Record/StudentHealthRecordCRUDPanel';
import { UserRole } from '../../../feature/Constant';
import { StudentHealthRecordQuery } from '../../../models/StudentHealthRecordModel';
import { useStudentHealthRecord } from '../../../feature/Hooks/StudentHealthRecord/useStudentHealthRecord';

//View all of their child health record page, Parent can only view the record, no read delete or update
//If the parent click on "View Detail", it will takes them into a different page 
// (meaning go to component called 'StudentHealthRecordDetailPage')
//As for the display, it should be the same as ParentMedicineRequestManagementPanel page, which contain the table
export default function ViewStudentHealthRecordPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StudentHealthRecordQuery>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  // State to hold record data
  const studentHealthRecords = useStudentHealthRecord(filters);
  const userRole = useUserRole();
  const navigate = useNavigate();

  // --- View ---
  const handleView = async (id: string) => {
    
    //Navigate to "/student-records/:id" with the student health record data
    navigate(`/student-records/${id}`)

  };

  const handleApplyFilters = (newFilters: StudentHealthRecordQuery) => {
    console.log('Applying filters:', newFilters);
    setFilters({ ...newFilters, pageNumber: 1 }); // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageIndex: page }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTER);
  };

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  return (
    <>
      <ParentStudentHealthRecordViewPanel
        studentHealthRecordData={studentHealthRecords.data}
        loading={studentHealthRecords.loading}
        pagination={{
          currentPage: filters.pageNumber || 1,
          totalPages: studentHealthRecords.totalPages,
          totalItems: studentHealthRecords.totalItems,
          onPageChange: handlePageChange,
        }}
        filterState={{
          value: filters,
          show: showFilters,
          onToggle: () => setShowFilters((s) => !s),
          onApply: handleApplyFilters,
          onClear: handleClearFilters,
        }}
        onView={handleView}
        userRole={userRole ?? UserRole.Parent}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
}

const DEFAULT_FILTER: StudentHealthRecordQuery = {
  pageNumber: 1,
  pageSize: 10,
  studentName: '',
  status: '', 
};









