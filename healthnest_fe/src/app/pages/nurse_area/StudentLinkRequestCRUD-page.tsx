import { useEffect, useState } from 'react';

import { Toast } from '../../../components/Notification/Toast';
import { StudentLinkRequestDetailModel, StudentLinkRequestQuery } from '../../../models/StudentLinkRequestModel';
import { useStudentLinkRequestModal } from '../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestModal';
import { useStudentLinkRequestNurse } from '../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestNurse';
import { StudentLinkRequestCRUDPanel } from '../../../components/StudentLinkRequest/StudentLinkRequestCRUDPanel';
import LinkRequestDetailModal from '../../../components/StudentLinkRequest/StudentLinkRequestDetailModal';
import { getLinkRequestErrorMessage } from '../../../feature/API/StudentLinkRequestService';
import { LinkRequestRejectModal } from '../../../components/StudentLinkRequest/StudentLinkRequestRejectModal';
import axios from 'axios';
import { LinkRequestStatus } from '../../../feature/Constant';

const DEFAULT_FILTER: StudentLinkRequestQuery = {
  PageIndex: 1, PageSize: 10, parentName: '', studentName: '', status: 'Pending',
};
const PENDING_SUMMARY_FILTER: StudentLinkRequestQuery = { PageIndex: 1, PageSize: 1, status: 'Pending' };

export default function StudentLinkRequestCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StudentLinkRequestQuery>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const isReviewing = reviewingId !== null;

  const studentLinkRequest = useStudentLinkRequestNurse(filters);
  const pendingSummary = useStudentLinkRequestNurse(PENDING_SUMMARY_FILTER);   // only feeds the tab badge
  const modal = useStudentLinkRequestModal();
  const requestToView = modal.state.type === 'view' ? modal.state.studentLinkRequest : null;
  const requestToReject = modal.state.type === 'reject' ? modal.state.studentLinkRequest : null;

  const handleShowToast = (message: string, type: 'success' | 'error') =>
    setToast({ isVisible: true, message, type });
  const handleCloseToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  // The status tab owns `status`; the filter panel owns the names. Neither overwrites the other.
  const handleStatusChange = (status: LinkRequestStatus | '') =>
    setFilters(prev => ({ ...prev, status, PageIndex: 1 }));

  const handleApplyFilters = (applied: StudentLinkRequestQuery) =>
    setFilters(prev => ({ ...prev, studentName: applied.studentName, parentName: applied.parentName, PageIndex: 1 }));

  const handleClearFilters = () => setFilters(prev => ({ ...DEFAULT_FILTER, status: prev.status }));

  const handlePageChange = (page: number) => setFilters(prev => ({ ...prev, PageIndex: page }));

  // Processing the last row on a page leaves that page empty: step back to the last real page
  useEffect(() => {
    const page = filters.PageIndex ?? 1;
    if (!studentLinkRequest.loading && page > 1 && page > studentLinkRequest.totalPages) {
      setFilters(prev => ({ ...prev, PageIndex: Math.max(1, studentLinkRequest.totalPages) }));
    }
  }, [studentLinkRequest.loading, studentLinkRequest.totalPages, filters.PageIndex]);

  const handleView = async (id: string) => {
    try {
      const detail = await studentLinkRequest.getById(id);
      modal.openView(detail);
    } catch (err) {
      handleShowToast(getLinkRequestErrorMessage(err, 'Failed to load the link request.'), 'error');
    }
  };

  const handleApprove = async (request: StudentLinkRequestDetailModel) => {
    setReviewingId(request.id);
    try {
      await studentLinkRequest.approve(request.id);
      handleShowToast(`Linked ${request.studentName ?? 'the student'} to ${request.parentName ?? 'the parent'}.`, 'success');
    } catch (err) {
      handleShowToast(getLinkRequestErrorMessage(err, 'Failed to approve the request.'), 'error');
    } finally {
      setReviewingId(null);
      modal.close();                       // the hook already refetched the list
      void pendingSummary.refetch();       // and this one refreshes the tab badge
    }
  };

  const handleReject = async (request: StudentLinkRequestDetailModel, reason: string) => {
    setReviewingId(request.id);
    let keepOpen = false;
    try {
      await studentLinkRequest.reject(request.id, reason);
      handleShowToast(`Rejected the request for ${request.studentName ?? 'the student'}.`, 'success');
    } catch (err) {
      handleShowToast(getLinkRequestErrorMessage(err, 'Failed to reject the request.'), 'error');
      keepOpen = axios.isAxiosError(err) && !err.response;      // network error: keep what the nurse typed
    } finally {
      setReviewingId(null);
      if (!keepOpen) modal.close();
      void pendingSummary.refetch();
    }
  };

  return (
    <>
      <StudentLinkRequestCRUDPanel
        studentLinkRequestData={studentLinkRequest.data}
        loading={studentLinkRequest.loading}
        error={studentLinkRequest.error}
        pendingCount={pendingSummary.totalItems}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: studentLinkRequest.totalPages,
          totalItems: studentLinkRequest.totalItems,
          onPageChange: handlePageChange,
        }}
        filterState={{
          value: filters,
          show: showFilters,
          onToggle: () => setShowFilters(s => !s),
          onApply: handleApplyFilters,
          onClear: handleClearFilters,
        }}
        onStatusChange={handleStatusChange}
        onRefresh={() => { void studentLinkRequest.refetch(); void pendingSummary.refetch(); }}
        onView={handleView}
      />

      {requestToView && (
        <LinkRequestDetailModal
          request={requestToView}
          onClose={modal.close}
          onApprove={handleApprove}
          onReject={request => modal.openReject(request)}
          busy={isReviewing}
        />
      )}

      {requestToReject && (
        <LinkRequestRejectModal
          request={requestToReject}
          busy={isReviewing}
          onClose={() => modal.openView(requestToReject)}     // Cancel goes back to the details
          onConfirm={reason => handleReject(requestToReject, reason)}
        />
      )}

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={handleCloseToast} />
    </>
  );
}