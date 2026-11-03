import { useState } from 'react';

import { MedicineCreateModel, MedicineQueryParams, MedicineUpdateModel } from '../../../feature/API/MedicineService';
import { MedicineViewDetailModal } from '../../../components/Medicine/MedicineViewModal';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';
import { MedicineCRUDPanel } from '../../../components/Medicine/MedicineManagementPanel';
import { LinkRequestRejectModel, StudentLinkRequestDetailModel, StudentLinkRequestQuery } from '../../../models/StudentLinkRequestModel';
import { useStudentLinkRequestModal } from '../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestModal';
import { useMyLinkRequests } from '../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequest';
import { useStudentLinkRequestNurse } from '../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestNurse';
import { StudentLinkRequestCRUDPanel } from '../../../components/StudentLinkRequest/StudentLinkRequestCRUDPanel';
import LinkRequestDetailModal from '../../../components/StudentLinkRequest/StudentLinkRequestDetailModal';
import { getLinkRequestErrorMessage } from '../../../feature/API/StudentLinkRequestService';
import { LinkRequestRejectModal } from '../../../components/StudentLinkRequest/StudentLinkRequestRejectModal';

const DEFAULT_FILTER: StudentLinkRequestQuery = {
  PageIndex: 1,
  PageSize: 10,
  parentName: '',
  status: '',
  studentName: '',
};

//Page component for managing medicine records
export default function StudentLinkRequestCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StudentLinkRequestQuery>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const studentLinkRequest = useStudentLinkRequestNurse(filters);
  const modal = useStudentLinkRequestModal();
  const canReject = modal.state.type === 'reject' ? modal.state.studentLinkRequest : null;


  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: MedicineQueryParams) => {
    setFilters({ ...newFilters, PageIndex: 1 }); // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageIndex: page }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTER);
  };



  // --- View ---
  const handleView = async (id: string) => {
    try {
      const medicine = await studentLinkRequest.getById(id);
      modal.openView(medicine);
    } catch {
      handleShowToast('Failed to load medicine details.', 'error');
    }
  };


  // -- Approve -- (Within View Detail Modal)
  const handleApprove = async (request: StudentLinkRequestDetailModel) => {
    setReviewingId(request.id);
    try {
      await studentLinkRequest.approve(request.id);

      handleShowToast(`Linked ${request.studentName ?? 'the student'} to ${request.parentName ?? 'the parent'}.`, 'success');
    } catch (err) {
      handleShowToast(getLinkRequestErrorMessage(err, 'Failed to approve the request.'), 'error');
    } finally {
      setReviewingId(null);
      modal.close();      // the hook has already refetched; the modal's copy may be stale either way
    }
  };

  // -- Reject -- (In Reject Modal)

  const handleReject = async (request: StudentLinkRequestDetailModel, reason: string) => {
    setReviewingId(request.id);
    try {
      await studentLinkRequest.reject(request.id, reason);

      handleShowToast(`Reject Link request with Id ${request.id} completed'}.`, 'success');
    } catch (err) {
      handleShowToast(getLinkRequestErrorMessage(err, 'Failed to reject the request.'), 'error');
    } finally {
      setReviewingId(null);
      modal.close();      // the hook has already refetched; the modal's copy may be stale either way
    }
  };






  return (
    <>
      <StudentLinkRequestCRUDPanel
        studentLinkRequestData={studentLinkRequest.data}
        loading={studentLinkRequest.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: studentLinkRequest.totalPages,
          totalItems: studentLinkRequest.totalItems,
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

      />
      {modal.state.type === 'view' && (
        <LinkRequestDetailModal
          request={modal.state.studentLinkRequest}
          onClose={modal.close}
          onApprove={handleApprove}
          onReject={request => modal.openReject(request)}   // the reason dialog is the next component
          busy={reviewingId !== null}
        />
      )}

      {canReject && (
        <LinkRequestRejectModal
          request={canReject}
          busy={reviewingId !== null}
          onClose={() => modal.openView(canReject)}      // Cancel goes back to the details, not out of the flow. We must use Detail Modal as input instead of string
          onConfirm={reason => handleReject( canReject,reason)}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
}




