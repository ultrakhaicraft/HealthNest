import { useState } from "react";
import UpdateMedicineRequestModal from "../../../components/MedicineRequest/nurse/UpdateMedicineRequestModal";
import { MedicineRequestViewDetail } from "../../../components/MedicineRequest/parent/MedicineRequestViewDetailModal";
import { Toast } from "../../../components/Notification/Toast";
import StudentHealthRecordViewPanel from "../../../components/Student_Health_Record/StudentHealthRecordCRUDPanel";
import { UserRole } from "../../../feature/Constant";
import { useUserRole } from "../../../feature/Hooks/Account/AccountHooks";
import { useStudentHealthRecord } from "../../../feature/Hooks/StudentHealthRecord/useStudentHealthRecord";
import { StudentHealthRecordCreateModel, StudentHealthRecordQuery, StudentHealthRecordUpdateModel, StudentHealthRecordViewModel } from "../../../models/StudentHealthRecordModel";
import { useNavigate } from "react-router-dom";
import { useStudentHealthRecordModal } from "../../../feature/Hooks/StudentHealthRecord/useStudentHealthRecordModal";
import StudentHealthRecordCreateModal from "../../../components/Student_Health_Record/Modals/StudentHealthRecordCreateModal";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import StudentHealthRecordUpdateModal from "../../../components/Student_Health_Record/Modals/StudentHealthRecordUpdateModal";

const DEFAULT_FILTER: StudentHealthRecordQuery = {
    pageNumber: 1,
    pageSize: 10,
    studentName: '',
    status: '',
};

export default function StudentHealthRecordCRUDPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<StudentHealthRecordQuery>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);

    const studentHealthRecord = useStudentHealthRecord(filters);
    const modal = useStudentHealthRecordModal();
    const userRole = useUserRole() ?? UserRole.Nurse;
    const navigate = useNavigate();


    const handleShowToast = (message: string, type: 'success' | 'error') => {
        setToast({ isVisible: true, message, type });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const handleApplyFilters = (newFilters: StudentHealthRecordQuery) => {
        setFilters({ ...newFilters, pageNumber: 1 }); // Reset to first page when filters change
    }

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, PageIndex: page }));
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTER);
    };



    // --- View ---
    const handleView = async (id: string) => {
        //Navigate to "/student-records/:id" with the student health record data
        navigate(`/student-records/${id}`)
    };

    // --- Edit ---
    const handleEdit = async (id: string) => {
        try {
            const medicine = await studentHealthRecord.getById(id);
            modal.openEdit(medicine);
        } catch {
            handleShowToast('Failed to load student health record for editing.', 'error');
        }
    };

    const handleUpdateSubmit = async (id: string, payload: StudentHealthRecordUpdateModel) => {
        setActionLoading(true);
        try {
            await studentHealthRecord.update(id, payload);
            handleShowToast('student health record updated successfully!', 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to update student health record.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // --- Create ---
    const handleCreateSubmit = async (payload: StudentHealthRecordCreateModel) => {
        setActionLoading(true);
        try {
            await studentHealthRecord.create(payload);
            handleShowToast('student health record created successfully!', 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to create student health record.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // --- Delete ---
    const handleDeleteConfirm = async (studentHealthRecordId: string) => {
        setActionLoading(true);
        try {
            await studentHealthRecord.remove(studentHealthRecordId);
            handleShowToast('student health record deleted successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to delete student health record.', 'error');
        } finally {
            setActionLoading(false);
        }
    };


    return (
        <>
            <StudentHealthRecordViewPanel
                studentHealthRecordData={studentHealthRecord.data}
                loading={studentHealthRecord.loading}
                pagination={{
                    currentPage: filters.pageNumber || 1,
                    totalPages: studentHealthRecord.totalPages,
                    totalItems: studentHealthRecord.totalItems,
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
                onCreate={modal.openCreate}
                onEdit={(studentHealthRecord: StudentHealthRecordViewModel) => handleEdit(studentHealthRecord.id)}
                onDelete={(studentHealthRecordId) => modal.openDelete(studentHealthRecordId)}
                userRole={userRole}
            />
            {modal.state.type === 'create' && (
                <StudentHealthRecordCreateModal
                    onSubmit={handleCreateSubmit}
                    onError={(msg) => handleShowToast(msg, 'error')}
                    isOpen={true}
                    onClose={modal.close}
                />
            )}
            {modal.state.type === 'edit' && (
                <StudentHealthRecordUpdateModal
                    isOpen={true}
                    studentHealthRecord={modal.state.studentHealthRecord}
                    onClose={modal.close}
                    onSubmit={handleUpdateSubmit}
                    onError={(msg)=>handleShowToast(msg,'error')}
                />
            )}

            {modal.state.type === 'delete' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={modal.close}
                    onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.studentHealthRecordId : '')}
                    title="Delete Medical Supply"
                    message={`Are you sure you want to delete this student health record ? which include the vaccine record and treament record belong to this record. This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isLoading={actionLoading}
                    type="danger"
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
