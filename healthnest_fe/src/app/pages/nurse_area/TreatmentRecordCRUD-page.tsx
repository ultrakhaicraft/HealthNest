import { useState } from "react";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { Toast } from "../../../components/Notification/Toast";

import { TreatmentRecordCreateModel, TreatmentRecordQuery } from "../../../models/TreatmentRecordModel";
import { useTreatmentRecord } from "../../../feature/Hooks/TreatmentRecord/useTreatmentRecord";
import { usetreatmentRecordModal } from "../../../feature/Hooks/TreatmentRecord/useTreatmentRecordModal";
import { UpdateTreatmentRecordModal } from "../../../components/Treatment_Record/UpdateTreatmentRecordModal";
import { CreateTreatmentRecordModal } from "../../../components/Treatment_Record/CreateTreatmentRecordModal";
import { TreatmentRecordManagementPanel } from "../../../components/Treatment_Record/TreatmentRecordManagementPanel";
import { TreatmentRecordViewDetailModal } from "../../../components/Treatment_Record/TreatmentRecordViewModal";

const DEFAULT_FILTER: TreatmentRecordQuery = {
    PageIndex: 1,
    PageSize: 5,
    status: '',
    treatmentTitle: ''
};

export default function TreatmentRecordCRUDPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<TreatmentRecordQuery>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);

    const treatmentRecords = useTreatmentRecord(filters);
    const modal = usetreatmentRecordModal();


    const handleShowToast = (message: string, type: 'success' | 'error') => {
        setToast({ isVisible: true, message, type });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const handleApplyFilters = (newFilters: TreatmentRecordQuery) => {
        console.log('Applying filters:', newFilters);
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
            const entity = await treatmentRecords.getById(id);
            modal.openView(entity);
        } catch {
            handleShowToast('Failed to load treatment record details.', 'error');
        }
    };

    // --- Edit ---
    const handleEdit = async (id: string) => {
        try {
            const medicalSupply = await treatmentRecords.getById(id);
            modal.openEdit(medicalSupply);
        } catch {
            handleShowToast('Failed to load vaccine record for editing.', 'error');
        }
    };

    const handleUpdateSubmit = async (id: string, payload: Parameters<typeof treatmentRecords.update>[1]) => {
        setActionLoading(true);
        try {
            await treatmentRecords.update(id, payload);
            handleShowToast('Treament record updated successfully!', 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to update treatment record.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // --- Create ---
    const handleAddSubmit = async (
        payload: TreatmentRecordCreateModel[],
        studentHealthRecordId: string
    ) => {
        setActionLoading(true);
        try {
            await treatmentRecords.addRange(payload, studentHealthRecordId);
            handleShowToast(`${payload.length} treatment record(s) created successfully!`, 'success');
            modal.close();
        } catch (err: any) {
            handleShowToast(err?.response?.data?.message || 'Failed to create treatment records.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // --- Delete ---
    const handleDeleteConfirm = async (medicalSupplyId: string) => {
        setActionLoading(true);
        try {
            await treatmentRecords.remove(medicalSupplyId);
            handleShowToast('Treatment record deleted successfully!', 'success');
            modal.close();
        } catch {
            handleShowToast('Failed to delete treatment record.', 'error');
        } finally {
            setActionLoading(false);
        }
    };



    return (
        <>
            <TreatmentRecordManagementPanel
                treatmentRecordData={treatmentRecords.data}
                loading={treatmentRecords.loading}
                pagination={{
                    currentPage: filters.PageIndex || 1,
                    totalPages: treatmentRecords.totalPages,
                    totalItems: treatmentRecords.totalItems,
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
                onEdit={(treatmentRecords) => handleEdit(treatmentRecords.id)}
                onDelete={(treatmentRecordsId) => modal.openDelete(treatmentRecordsId)}
                onCreate={modal.openCreate}
            />
            {modal.state.type === 'view' && (
                <TreatmentRecordViewDetailModal
                    TreatmentRecord={modal.state.treatmentRecord}
                    isOpen={true}
                    onClose={modal.close}
                />
            )}
            {modal.state.type === 'create' && (
                <CreateTreatmentRecordModal
                    onClose={modal.close}
                    onSubmit={handleAddSubmit}
                    isOpen={true} />
            )}
            {modal.state.type === 'edit' && (
                <UpdateTreatmentRecordModal
                    isOpen={true}
                    treatmentRecord={modal.state.treatmentRecord}
                    onClose={modal.close}
                    onSubmit={handleUpdateSubmit}
                />
            )}
            {modal.state.type === 'delete' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={modal.close}
                    onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.treatmentRecordId : '')}
                    title="Delete Vaccine Record"
                    message={`Are you sure you want to delete this treatment record ? This action cannot be undone.`}
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
    )
}