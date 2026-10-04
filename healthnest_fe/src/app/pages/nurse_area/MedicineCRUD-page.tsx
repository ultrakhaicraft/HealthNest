import { useState } from 'react';

import "../../CSS/Nurse/MedicineCRUD.css"
import {  MedicineCreateModel, MedicineQueryParams, MedicineUpdateModel } from '../../../feature/API/MedicineService';
import { MedicineViewDetailModal } from '../../../components/Medicine/MedicineViewModal';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';
import { MedicineCRUDPanel } from '../../../components/Medicine/MedicineManagementPanel';
import { useMedicineModals } from '../../../feature/Hooks/Medicines/useMedicineModals';
import { useMedicines } from '../../../feature/Hooks/Medicines/useMedicines';

const DEFAULT_FILTER: MedicineQueryParams = {
  PageIndex: 1,
  PageSize: 10,
  SortByNameByDescending: true,
  Status: '',
  Name: '',
};

//Page component for managing medicine records
export default function MedicineCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MedicineQueryParams>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  const medicines = useMedicines(filters);
  const modal = useMedicineModals();

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: MedicineQueryParams) => {
    setFilters({...newFilters,PageIndex: 1}); // Reset to first page when filters change
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
      const medicine = await medicines.getById(id);
      modal.openView(medicine);
    } catch {
      handleShowToast('Failed to load medicine details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const medicine = await medicines.getById(id);
      modal.openEdit(medicine);
    } catch {
      handleShowToast('Failed to load medicine for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: MedicineUpdateModel) => {
    setActionLoading(true);
    try {
      await medicines.update(id, payload);
      handleShowToast('Medicine updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update medicine.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Create ---
  const handleCreateSubmit = async (payload: MedicineCreateModel) => {
    setActionLoading(true);
    try {
      await medicines.create(payload);
      handleShowToast('Medicine created successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to create medicine.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async (medicineId: string) => {
    setActionLoading(true);
    try {
      await medicines.remove(medicineId);
      handleShowToast('Medicine deleted successfully!', 'success');
      modal.close();
    } catch {
      handleShowToast('Failed to delete medicine.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  

  return (
    <>
      <MedicineCRUDPanel 
        medicineData={medicines.data}
        loading={medicines.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: medicines.totalPages,
          totalItems: medicines.totalItems,
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
        onEdit={(medicine) => handleEdit(medicine.id)}
        onDelete={(medicineId) => modal.openDelete(medicineId)}
        onCreate={modal.openCreate}
      />
      {modal.state.type === 'view' && (
        <MedicineViewDetailModal 
          medicine={modal.state.medicine} 
          isOpen={true}
          onClose={modal.close} 
        />
      )}
      {modal.state.type === 'create' && (
        <CreateMedicineModal
          isOpen={true}
          onClose={modal.close}
          onSubmit={handleCreateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}
      {modal.state.type === 'edit' &&  (
        <UpdateMedicineModal
          isOpen={true}
          medicine={modal.state.medicine}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}
      {modal.state.type === 'delete' && (
      <ConfirmationModal
        isOpen={true}
        onClose={modal.close}
        onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.medicineId : '')}
        title="Delete Medicine"
        message={`Are you sure you want to delete this medicine ? This action cannot be undone.`}
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




