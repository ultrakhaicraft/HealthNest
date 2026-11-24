import { useParams } from "react-router-dom";
import { CompleteVaccinationRequest, VaccineEventStudentQuery } from "../../../models/VaccineEventStudentModel";
import { useVaccineEventStudent } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudent";
import { useVaccineEventStudentModals } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudentModal";
import { VaccineEventStudentManagementPanel } from "../../../components/VaccineEventStudent/VaccineEventStudentManagementPanel";
import { ViewVaccineEventStudentDetail } from "../../../components/VaccineEventStudent/VaccineEventStudentDetailModal";
import { Toast } from "../../../components/Notification/Toast";
import { useState } from "react";
import styles from "../../../CSS/MainPage.module.css";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { CompleteVaccineEventStudentModal } from "../../../components/VaccineEventStudent/CompleteVaccineEventStudentModal";

const DEFAULT_FILTER: VaccineEventStudentQuery = {
    pageIndex: 1,
    pageSize: 10,
    sortByDateSignUp: true,
    class: '',
    participantStatus: '',
};

const searchMode = "event";

export default function VaccineEventStudentManagementPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<VaccineEventStudentQuery>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);

    const vaccineEventStudent = useVaccineEventStudent(filters, searchMode, undefined, eventId);
    const modal = useVaccineEventStudentModals();

    const handleShowToast = (message: string, type: 'success' | 'error') => {
        setToast({ isVisible: true, message, type });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const handleApplyFilters = (newFilters: VaccineEventStudentQuery) => {
        setFilters({ ...newFilters, pageIndex: 1 }); // Reset to first page when filters change
    }

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, pageIndex: page }));
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTER);
    };



    // --- View ---
    const handleView = async (eventId: string, studentId: string) => {
        try {
            const data = await vaccineEventStudent.getById(eventId, studentId);
            modal.openView(data);
        } catch {
            handleShowToast('Failed to load vaccine Event participant details.', 'error');
        }
    };


    const handleApproveStudent = async (studentId: string, eventId: string) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.approveStudentForEvent(eventId, studentId);
            handleShowToast('Approve sign up successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to approve vaccine event sign up.', 'error');
        } finally {
            setActionLoading(false);
        }
    };


    const handleRejectStudent = async (studentId: string, eventId: string) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.rejectStudentFromEvent(eventId, studentId);
            handleShowToast('Reject sign up successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to reject vaccine event sign up.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async (studentId: string, eventId: string, payload: CompleteVaccinationRequest) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.CompleteStudentVaccineEvent(eventId, studentId, payload);
            handleShowToast('Check Complete for this attendant successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to Check Complete for this attendant.', 'error');
        } finally {
            setActionLoading(false);
        }
    };


    return (
        <>

            <div className={styles.eventPageContainer}>
                <VaccineEventStudentManagementPanel
                    vaccineEventStudentData={vaccineEventStudent.data}
                    loading={vaccineEventStudent.loading}
                    pagination={{
                        currentPage: filters.pageIndex || 1,
                        totalPages: vaccineEventStudent.totalPages,
                        totalItems: vaccineEventStudent.totalItems,
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
                    onApprove={(eventId: string, studentId: string) => modal.openApproveStudent(eventId, studentId)}
                    onComplete={(eventId: string, studentId: string) => modal.openCompleteStudent(eventId,studentId)}
                    onReject={(eventId: string, studentId: string) => { modal.openRejectStudent(eventId, studentId) }}
                    onRefresh={() => { void vaccineEventStudent.refetch(); }}

                />
            </div>
            {modal.state.type === 'view' && (
                <ViewVaccineEventStudentDetail
                    vaccineEventParticipant={modal.state.vaccineEventStudent}
                    isOpen={true}
                    onClose={modal.close}
                />
            )}

            {modal.state.type === 'approve-student' && (() => {
                const currentModal = modal.state;
                return (
                    <ConfirmationModal
                        isOpen={true}
                        onClose={modal.close}
                        onConfirm={() => handleApproveStudent(currentModal.studentId, currentModal.eventId)}
                        title="Approve Student Sign Up Vaccine"
                        message="Are you sure you want to approve this sign up? This action cannot be undone."
                        confirmText="Approve"
                        cancelText="Cancel"
                        isLoading={actionLoading}
                        type="danger"
                    />
                );
            })()}

            {modal.state.type === 'reject-student' && (() => {
                const currentModal = modal.state;
                return (
                    <ConfirmationModal
                        isOpen={true}
                        onClose={modal.close}
                        onConfirm={() => handleRejectStudent(currentModal.studentId, currentModal.eventId)}
                        title="Reject Student Sign Up Vaccine"
                        message="Are you sure you want to reject this sign up? This action cannot be undone."
                        confirmText="Reject"
                        cancelText="Cancel"
                        isLoading={actionLoading}
                        type="danger"
                    />
                );
            })()}

            {modal.state.type === 'complete-student' && (() => {
                const currentModal=modal.state;
                return (
                    <CompleteVaccineEventStudentModal
                        isOpen={true}
                        onClose={modal.close}
                        onSubmit={(payload: CompleteVaccinationRequest) => handleComplete(currentModal.studentId, currentModal.eventId,payload)}
                        onError={(msg) => handleShowToast(msg, 'error')}
                    />
                )
            })()}


            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={handleCloseToast}
            />
        </>
    );
}