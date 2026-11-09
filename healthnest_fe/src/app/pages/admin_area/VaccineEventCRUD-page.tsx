import { useState } from 'react';

import { MedicineViewDetailModal } from '../../../components/Medicine/MedicineViewModal';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';
import { VaccineEventCreateDTO, VaccineEventQueryParams, VaccineEventUpdateDTO } from '../../../models/VaccineEventModel';
import { useVaccineEvent } from '../../../feature/Hooks/VaccineEvent/useVaccineEvent';
import { useVaccineEventModals } from '../../../feature/Hooks/VaccineEvent/useVaccineEventModal';
import { VaccineEventManagementPanel } from '../../../components/Vaccine_Event/VaccineEventManagementPanel';
import { VaccineEventViewDetail } from '../../../components/Vaccine_Event/VaccinEventDetail';

const DEFAULT_FILTER: VaccineEventQueryParams = {
  pageIndex: 1,
  pageSize: 10,
  sortByLatestDateOccured: true,
  Status:'',
};

//Page component for managing vaccine event information, including viewing, creating, updating, and deleting events. It also provides filtering and pagination functionalities.
export default function VaccineEventCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VaccineEventQueryParams>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  const vaccineEvent = useVaccineEvent(filters);
  const modal = useVaccineEventModals();

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: VaccineEventQueryParams) => {
    setFilters({...newFilters,pageIndex: 1}); // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageIndex: page }));
  };
  
  const handleClearFilters = () => {
      setFilters(DEFAULT_FILTER);
  };

  
  
   // --- View ---
  const handleView = async (id: string) => {
    try {
      const result = await vaccineEvent.getById(id);
      modal.openView(result);
    } catch {
      handleShowToast('Failed to load vaccine event details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const result = await vaccineEvent.getById(id);
      modal.openEdit(result);
    } catch {
      handleShowToast('Failed to load vaccine event for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: VaccineEventUpdateDTO) => {
    setActionLoading(true);
    try {
      await vaccineEvent.update(id, payload);
      handleShowToast('Vaccine event updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update vaccine event.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Create ---
  const handleCreateSubmit = async (payload: VaccineEventCreateDTO) => {
    setActionLoading(true);
    try {
      await vaccineEvent.create(payload);
      handleShowToast('Vaccine event created successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to create vaccine event.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async (vaccineEventId: string) => {
    setActionLoading(true);
    try {
      await vaccineEvent.remove(vaccineEventId);
      handleShowToast('Vaccine event deleted successfully!', 'success');
      modal.close();
    } catch {
      handleShowToast('Failed to delete vaccine event.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  

  return (
    <>
      <VaccineEventManagementPanel 
        vaccineEventData={vaccineEvent.data}
        loading={vaccineEvent.loading}
        pagination={{
          currentPage: filters.pageIndex || 1,
          totalPages: vaccineEvent.totalPages,
          totalItems: vaccineEvent.totalItems,
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
        onEdit={(vaccineEvent) => handleEdit(vaccineEvent.id)}
        onDelete={(vaccineEventId) => modal.openDelete(vaccineEventId)}
        onCreate={modal.openCreate}
      />
      {modal.state.type === 'view' && (
        <VaccineEventViewDetail 
          vaccineEvent={modal.state.vaccineEvent} 
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
      {/*}
      {modal.state.type === 'edit' &&  (
        <UpdateMedicineModal
          isOpen={true}
          medicine={modal.state.medicine}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}
        */}
      {modal.state.type === 'delete' && (
      <ConfirmationModal
        isOpen={true}
        onClose={modal.close}
        onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.vaccineEventId : '')}
        title="Delete Vaccine Event"
        message={`Are you sure you want to delete this vaccine event ? This action cannot be undone.`}
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




