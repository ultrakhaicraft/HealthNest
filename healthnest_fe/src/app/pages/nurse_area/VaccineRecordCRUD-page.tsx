import { useState } from "react";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { Toast } from "../../../components/Notification/Toast";
import { CreateVaccineRecordModal } from "../../../components/Vaccine_Record/CreateVaccineRecordModal";
import { UpdateVaccineRecordModal } from "../../../components/Vaccine_Record/UpdateVaccineRecordModal";
import { VaccineRecordViewDetailModal } from "../../../components/Vaccine_Record/VaccineRecordViewModal";
import { useVaccineRecord } from "../../../feature/Hooks/VaccineRecord/useVaccineRecord";
import { usevaccineRecordModal } from "../../../feature/Hooks/VaccineRecord/useVaccineRecordModal";
import { VaccineRecordCreateModel, VaccineRecordQuery } from "../../../models/VaccineRecordModel";
import { VaccineRecordManagementPanel } from "../../../components/Vaccine_Record/VaccineRecordManagementPanel";

const DEFAULT_FILTER: VaccineRecordQuery = {
  PageIndex: 1,
  PageSize: 5,
  status: '',
  vaccineTitle: ''
};

export default function VaccineRecordCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VaccineRecordQuery>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  const vaccineRecord = useVaccineRecord(filters);
  const modal = usevaccineRecordModal();


  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: VaccineRecordQuery) => {
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
      const entity = await vaccineRecord.getById(id);
      modal.openView(entity);
    } catch {
      handleShowToast('Failed to load vaccine record details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const medicalSupply = await vaccineRecord.getById(id);
      modal.openEdit(medicalSupply);
    } catch {
      handleShowToast('Failed to load vaccine record for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: Parameters<typeof vaccineRecord.update>[1]) => {
    setActionLoading(true);
    try {
      await vaccineRecord.update(id, payload);
      handleShowToast('Vaccine record updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update vaccine record.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Create ---
  const handleAddSubmit = async (
    payload: VaccineRecordCreateModel[],
    studentHealthRecordId: string
  ) => {
    setActionLoading(true);
    try {
      await vaccineRecord.addRange(payload, studentHealthRecordId);
      handleShowToast(`${payload.length} vaccine record(s) created successfully!`, 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to create vaccine records.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async (medicalSupplyId: string) => {
    setActionLoading(true);
    try {
      await vaccineRecord.remove(medicalSupplyId);
      handleShowToast('Vaccine record deleted successfully!', 'success');
      modal.close();
    } catch {
      handleShowToast('Failed to delete Vaccine record.', 'error');
    } finally {
      setActionLoading(false);
    }
  };



  return (
    <>
      <VaccineRecordManagementPanel
        vaccineRecordData={vaccineRecord.data}
        loading={vaccineRecord.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: vaccineRecord.totalPages,
          totalItems: vaccineRecord.totalItems,
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
        onEdit={(vaccineRecord) => handleEdit(vaccineRecord.id)}
        onDelete={(vaccineRecordId) => modal.openDelete(vaccineRecordId)}
        onCreate={modal.openCreate}
      />
      {modal.state.type === 'view' && (
        <VaccineRecordViewDetailModal
          vaccineRecord={modal.state.vaccineRecord}
          isOpen={true}
          onClose={modal.close}
        />
      )}
      {modal.state.type === 'create' && (
        <CreateVaccineRecordModal
          onClose={modal.close}
          onSubmit={handleAddSubmit}
        />
      )}
      {modal.state.type === 'edit' && (
        <UpdateVaccineRecordModal
          isOpen={true}
          vaccineRecord={modal.state.vaccineRecord}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
        />
      )}
      {modal.state.type === 'delete' && (
        <ConfirmationModal
          isOpen={true}
          onClose={modal.close}
          onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.vaccineRecordId : '')}
          title="Delete Vaccine Record"
          message={`Are you sure you want to delete this vaccine record ? This action cannot be undone.`}
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