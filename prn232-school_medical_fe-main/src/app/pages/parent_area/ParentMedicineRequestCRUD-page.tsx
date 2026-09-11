import { useState } from 'react';

import '../../CSS/Nurse/MedicineRequest.css';
import "../../CSS/Nurse/NurseCRUDPanel.css"
import { MedicineRequestQueryParams } from '../../../feature/API/MedicineRequestService';
import { useMedicineRequestModals } from '../../../feature/Hooks/MedicineRequest/useMedicineRequestModal';
import { useMedicineRequests } from '../../../feature/Hooks/MedicineRequest/useMedicineRequests';
import { MedicineRequestViewDetail } from '../../../components/MedicineRequest/parent/MedicineRequestViewDetailModal';
import { Toast } from '../../../components/Notification/Toast';
import { useUserId, useUserRole } from '../../../feature/Hooks/Account/AccountHooks';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { ParentMedicineRequestManagementPanel } from '../../../components/MedicineRequest/parent/ParentMedicineRequestManagementPanel';
import CreateMedicineRequestModal from '../../../components/MedicineRequest/parent/CreateMedicineRequestModal';
import UpdateOwnedMedicineRequestModal from '../../../components/MedicineRequest/parent/UpdateOwnedMedicineRequestModal';
import { UserRole } from '../../../feature/Constant';

const DEFAULT_FILTER: MedicineRequestQueryParams = {
  PageIndex: 1,
  PageSize: 10,
  sortByLatestDate: true,
  requestByName: '', //Ignored for ParentMedicineRequestCRUDPage
  forStudentName: '', //Student Name
  dateFrom: '',
  dateTo: '',
  status: '',
};

// Main Medicine Request CRUD Component for Parent User
// This component house Medicine Request custom hooks and handles the state of the modal for medicine request.
// The differences from Nurse version is that Parent can create it and has a different way to update it, since Parent are the owner of this data
export default function ParentMedicineRequestCRUDPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<MedicineRequestQueryParams>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);
    
    const requesterId = useUserId();
    const medicineRequests = useMedicineRequests(filters,requesterId ? requesterId : ''); //RequesterId is mandatory
    const modal = useMedicineRequestModals();
    const userRole= useUserRole();

    const handleShowToast = (message: string, type: 'success' | 'error') => {
            setToast({ isVisible: true, message, type });
          };
        
          const handleCloseToast = () => {
            setToast({ ...toast, isVisible: false });
          };
        
          const handleApplyFilters = (newFilters: MedicineRequestQueryParams) => {
              console.log('Applying filters:', newFilters);
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
      const medicalSupply = await medicineRequests.getById(id);
      modal.openView(medicalSupply);
    } catch {
      handleShowToast('Failed to load medicine request details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const medicalSupply = await medicineRequests.getById(id);
      modal.openEdit(medicalSupply);
    } catch {
      handleShowToast('Failed to load medicine request for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: Parameters<typeof medicineRequests.update>[1]) => {
    setActionLoading(true);
    try {
      await medicineRequests.update(id, payload);
      handleShowToast('Medicine requesty updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update medicine request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };
   
    // --- Create ---
  const handleCreateSubmit = async (payload: Parameters<typeof medicineRequests.create>[0]) => {
    setActionLoading(true);
    try {
      await medicineRequests.create(payload);
      handleShowToast('Medicine request created successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to create Medicine request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async (medicalSupplyId: string) => {
    setActionLoading(true);
    try {
      await medicineRequests.remove(medicalSupplyId);
      handleShowToast('Medicine request deleted successfully!', 'success');
      modal.close();
    } catch {
      handleShowToast('Failed to delete Medicine request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };


    return (
        <>
        <ParentMedicineRequestManagementPanel 
        medicineRequestData={medicineRequests.data}
        loading={medicineRequests.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: medicineRequests.totalPages,
          totalItems: medicineRequests.totalItems,
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
        onDelete={(medicineRequestId) => modal.openDelete(medicineRequestId)}
        userRole={userRole ?? UserRole.Parent}
        onCreate={modal.openCreate}
      />
      {modal.state.type==='view' && (
        <MedicineRequestViewDetail 
          medicineRequest={modal.state.medicineRequest} 
          isOpen={true}
          onClose={modal.close} 
        />
      )}

      {modal.state.type === 'create' && (
      <CreateMedicineRequestModal
        isOpen={true}
        onClose={modal.close}
        onSubmit={handleCreateSubmit}
        onError={(msg)=> handleShowToast(msg, 'error')}
      />
      )}

      {modal.state.type === 'edit' && (
        <UpdateOwnedMedicineRequestModal
          isOpen={true}
          medicineRequest={modal.state.medicineRequest}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}

      {modal.state.type === 'delete' && (
        <ConfirmationModal
          isOpen={true}
          onClose={modal.close}
          onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.medicineRequestId : '')}
          title="Delete Medicine Request"
          message={`Are you sure you want to delete this medicine request ? This action cannot be undone.`}
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





