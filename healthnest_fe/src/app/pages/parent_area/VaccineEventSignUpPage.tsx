import { useState } from "react";
import { useVaccineEventStudent } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudent";
import { useVaccineEventStudentModals } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudentModal";
import { CreateVaccineEventStudentModel, UpdateNoteRequest, VaccineEventStudentQuery } from "../../../models/VaccineEventStudentModel";
import { Toast } from "../../../components/Notification/Toast";
import styles from "../../../CSS/MainPage.module.css";
import { ViewVaccineEventStudentDetail } from "../../../components/VaccineEventStudent/VaccineEventStudentDetailModal";
import { VaccineEventStudentViewPanel } from "../../../components/VaccineEventStudent/VaccineEventStudentViewPanel";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import SignUpVaccineEventModal from "../../../components/VaccineEventStudent/SignUpVaccineEventStudentModal";
import UpdateSignUpVaccineEventModal from "../../../components/VaccineEventStudent/UpdateVaccineEventSignUpModal";


const DEFAULT_FILTER: VaccineEventStudentQuery = {
    pageIndex: 1,
    pageSize: 10,
    sortByDateSignUp: true,
    class: '',
    participantStatus: '',
};

const searchMode = "parent";
//Manage your child vaccine event sign up (Does not show available vaccine event)
export default function VaccineEventSignUpPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<VaccineEventStudentQuery>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);

    const vaccineEventStudent = useVaccineEventStudent(filters, searchMode, undefined, undefined);
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

    const handleCreateSubmit = async (payload: CreateVaccineEventStudentModel, IsSignUpAgain: boolean) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.signUpStudentToEvent(payload,IsSignUpAgain);
            handleShowToast('Sign up vaccine event successfully!', 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to sign up.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    

    const handleEditNote = async (eventId: string, studentId: string, payload: UpdateNoteRequest) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.UpdateNote(eventId, studentId, payload);
            handleShowToast('Update Sign up vaccine event successfully!', 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to update sign up.', 'error');
        } finally {
            setActionLoading(false);
        }
    };


    const handleCancel = async (studentId: string, eventId: string) => {
        setActionLoading(true);
        try {
            await vaccineEventStudent.cancelSignup(eventId, studentId);
            handleShowToast('Cancel sign up successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to Cancel vaccine event sign up.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    return (<>

        <div className={styles.eventPageContainer}>
            <VaccineEventStudentViewPanel
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
                onCancel={(eventId: string, studentId: string) => modal.openCancelSignUp(eventId, studentId)}
                onEdit={(eventId: string, studentId: string) => modal.openUpdateNote(eventId, studentId)}
                onSignUp={modal.openSignup}
                onSignUpAgain={modal.openReSignup}
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

        {modal.state.type === 'cancel-sign-up' && (() => {
            const currentModal = modal.state;
            return (
                <ConfirmationModal
                    isOpen={true}
                    onClose={modal.close}
                    onConfirm={() => handleCancel(currentModal.studentId, currentModal.eventId)}
                    title="Cancel your Student Sign Up Vaccine"
                    message="Are you sure you want to cancel this sign up? This action cannot be undone."
                    confirmText="Yes"
                    cancelText="No"
                    isLoading={actionLoading}
                    type="danger"
                />
            );
        })()}

        {modal.state.type === 'sign-up' && (() => {
            return (
                <SignUpVaccineEventModal
                    isOpen={true}
                    onClose={modal.close}
                    onSubmit={handleCreateSubmit}
                    IsSignUpAgain={false}
                />
            )
        })()}

        {modal.state.type === 're-sign-up' && (() => {
            const currentModal = modal.state;
            return (
                <SignUpVaccineEventModal
                    isOpen={true}
                    onClose={modal.close}
                    onSubmit={handleCreateSubmit}
                    passedEventId={currentModal.eventId}
                    passedStudentId={currentModal.studentId}
                    IsSignUpAgain={true}
                />
            )
        })()}

        {modal.state.type === 'update-note' && (() => {
            const currentModal = modal.state;
            const VaccineEventSignUpIDPair = {
                studentId: currentModal.studentId,
                vaccineEventId: currentModal.eventId
            }
            return (
                <UpdateSignUpVaccineEventModal
                    data={VaccineEventSignUpIDPair}
                    isOpen={true}
                    onClose={modal.close}
                    onSubmit={handleEditNote}

                />
            )
        })()}

        <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={handleCloseToast}
        />
    </>)

}
