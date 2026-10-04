import { useState } from 'react';

import "../../CSS/Nurse/IncidentRecordCRUD.css"

import { IncidentRecordCreate, IncidentRecordQueryParams, IncidentRecordUpdate } from '../../../feature/API/IncidentRecordService';
import { IncidentRecordViewDetailModal } from '../../../components/IncidentRecord/IncidentRecordViewDetailModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import CreateIncidentRecordModal from '../../../components/IncidentRecord/CreateIncidentRecordModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateIncidentRecordModal from '../../../components/IncidentRecord/UpdateIncidentRecordModal';
import { IncidentRecordCRUDPanel } from '../../../components/IncidentRecord/IncidentRecordManagementPanel';
import { useIncidentRecords } from '../../../feature/Hooks/IncidentRecord/useIncidentRecords';
import { useIncidentRecordModals } from '../../../feature/Hooks/IncidentRecord/useIncidentRecordModals';
import { useUserId } from '../../../feature/Hooks/Account/AccountHooks';


const DEFAULT_FILTER: IncidentRecordQueryParams = {
  PageIndex: 1,
    PageSize: 10,
    SortByLatest: true,
    Status: '',
    StudentName: '',
    DateFrom: '',
    DateTo: ''
};

// Main App Component
export default function IncidentRecordCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IncidentRecordQueryParams>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  const incidentRecords = useIncidentRecords(filters);
  const modal = useIncidentRecordModals();
  
  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };
  
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: IncidentRecordQueryParams) => {
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
        const incidentRecord = await incidentRecords.getById(id);
        modal.openView(incidentRecord);
      } catch {
        handleShowToast('Failed to load incident record details.', 'error');
      }
    };
  
    // --- Edit ---
    const handleEdit = async (id: string) => {
      try {
        const incidentRecord = await incidentRecords.getById(id);
        modal.openEdit(incidentRecord);
      } catch {
        handleShowToast('Failed to load incident record for editing.', 'error');
      }
    };
  
    const handleUpdateSubmit = async (id: string, payload: IncidentRecordUpdate) => {
      setActionLoading(true);
      try {
        await incidentRecords.update(id, payload);
        handleShowToast('Incident record updated successfully!', 'success');
        modal.close();
      } catch (err: any) {
        handleShowToast(err?.response?.data?.message || 'Failed to update incident record.', 'error');
      } finally {
        setActionLoading(false);
      }
    };
  
    // --- Create ---
    const handleCreateSubmit = async (payload: IncidentRecordCreate) => {
      setActionLoading(true);
      try {
        await incidentRecords.create(payload);
        handleShowToast('Incident record created successfully!', 'success');
        modal.close();
      } catch (err: any) {
        handleShowToast(err?.response?.data?.message || 'Failed to create incident record.', 'error');
      } finally {
        setActionLoading(false);
      }
    };
  
    // --- Delete ---
    const handleDeleteConfirm = async (incidentId: string) => {
      setActionLoading(true);
      try {
        await incidentRecords.remove(incidentId);
        handleShowToast('Incident record deleted successfully!', 'success');
        modal.close();
      } catch {
        handleShowToast('Failed to delete incident record.', 'error');
      } finally {
        setActionLoading(false);
      }
    };

  return (
    <>
      <IncidentRecordCRUDPanel 
        incidentData={incidentRecords.data}
        loading={incidentRecords.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: incidentRecords.totalPages,
          totalItems: incidentRecords.totalItems,
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
        onEdit={(incident) => handleEdit(incident.id)}
        onDelete={(incidentId) => modal.openDelete(incidentId)}
        onCreate={modal.openCreate}
        />
      {modal.state.type === 'view' && (
        <IncidentRecordViewDetailModal 
          incidentRecord={modal.state.incidentRecord} 
          isOpen={true}
          onClose={modal.close} 
        />
      )}

      {modal.state.type === 'create' && (
      <CreateIncidentRecordModal
        isOpen={true}
        onClose={modal.close}
        onSubmit={handleCreateSubmit}
        onError={(msg)=> handleShowToast(msg, 'error')}
      />
      )}

      {modal.state.type === 'edit' && (
      <UpdateIncidentRecordModal
        isOpen={true}
        incidentRecord={modal.state.incidentRecord}
        onClose={modal.close}
        onSubmit={handleUpdateSubmit}
        onError={(msg)=> handleShowToast(msg, 'error')}
      />
      )}

      {modal.state.type === 'delete' && (
      <ConfirmationModal
        isOpen={modal.state.type === 'delete'}
        onClose={modal.close}
        onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.incidentRecordId : '')}
        title="Delete Incident Record"
        message={`Are you sure you want to delete this incident record ? This action cannot be undone.`}
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






