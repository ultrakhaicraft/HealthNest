import { useState } from 'react';

import { MedicineRequestQueryParams, MedicineRequestUpdateModel } from '../../../feature/API/MedicineRequestService';
import { MedicineRequestViewDetail } from '../../../components/MedicineRequest/parent/MedicineRequestViewDetailModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineRequestModal from '../../../components/MedicineRequest/nurse/UpdateMedicineRequestModal';
import { useMedicineRequests } from '../../../feature/Hooks/MedicineRequest/useMedicineRequests';
import { useMedicineRequestModals } from '../../../feature/Hooks/MedicineRequest/useMedicineRequestModal';
import MedicineRequestCRUDPanel from '../../../components/MedicineRequest/nurse/MedicineRequestManagementPanel';
import { useUserRole } from '../../../feature/Hooks/Account/AccountHooks';
import { UserRole } from '../../../feature/Constant';

const DEFAULT_FILTER: MedicineRequestQueryParams = {
  PageIndex: 1,
  PageSize: 10,
  sortByLatestDate: true,
  requestByName: '', //Parent Name
  forStudentName: '', //Student Name
  dateFrom: '',
  dateTo: '',
  status: '',
};

export default function MedicineRequestCRUDPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MedicineRequestQueryParams>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [actionLoading, setActionLoading] = useState(false);

  const medicineRequests = useMedicineRequests(filters,''); //No Requester Id needed
  const modal = useMedicineRequestModals();
  const userRole = useUserRole() ?? UserRole.Nurse;

  const handleShowToast = (message: string, type: 'success' | 'error') => {
      setToast({ isVisible: true, message, type });
    };
  
    const handleCloseToast = () => {
      setToast({ ...toast, isVisible: false });
    };
  
    const handleApplyFilters = (newFilters: MedicineRequestQueryParams) => {
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
      const medicine = await medicineRequests.getById(id);
      modal.openView(medicine);
    } catch {
      handleShowToast('Failed to load medicine request details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const medicine = await medicineRequests.getById(id);
      modal.openEdit(medicine);
    } catch {
      handleShowToast('Failed to load medicine request for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: MedicineRequestUpdateModel) => {
    setActionLoading(true);
    try {
      await medicineRequests.update(id, payload);
      handleShowToast('Medicine request updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update medicine request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };  


  return (
    <>
      <MedicineRequestCRUDPanel 
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
        userRole={userRole}
      />
      {modal.state.type==='view' && (
        <MedicineRequestViewDetail 
          medicineRequest={modal.state.medicineRequest} 
          isOpen={true}
          onClose={modal.close} 
        />
      )}
      {modal.state.type === 'edit' && (
        <UpdateMedicineRequestModal
          isOpen={true}
          medicineRequest={modal.state.medicineRequest}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
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





