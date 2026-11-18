import { useParams } from "react-router-dom";
import { VaccineEventStudentQuery } from "../../../models/VaccineEventStudentModel";
import { useVaccineEventStudent } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudent";
import { useVaccineEventStudentModals } from "../../../feature/Hooks/VaccineEventStudent/useVaccineEventStudentModal";
import { VaccineEventStudentManagementPanel } from "../../../components/VaccineEventStudent/VaccineEventStudentManagementPanel";
import { ViewVaccineEventStudentDetail } from "../../../components/VaccineEventStudent/VaccineEventStudentDetailModal";
import { Toast } from "../../../components/Notification/Toast";
import { useState } from "react";

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

    const vaccineEventStudent = useVaccineEventStudent(filters, searchMode);
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

    return (
        <>

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
                onApprove={() => { }}
                onComplete={() => { }}
                onReject={() => { }}
                onRefresh={() => { void vaccineEventStudent.refetch(); }}

            />
            {modal.state.type === 'view' && (
                <ViewVaccineEventStudentDetail
                    vaccineEventParticipant={modal.state.vaccineEventStudent}
                    isOpen={true}
                    onClose={modal.close}
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