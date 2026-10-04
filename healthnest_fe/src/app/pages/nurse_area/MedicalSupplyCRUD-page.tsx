import { useState } from "react";
import { MedicalSupplyQuery } from "../../../feature/API/MedicalSupplyService";
import { useMedicalSupplies } from "../../../feature/Hooks/MedicalSupply/useMedicalSupplies";
import { useMedicalSupplyModals } from "../../../feature/Hooks/MedicalSupply/useMedicalSupplyModal";
import { Toast } from "../../../components/Notification/Toast";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import UpdateMedicalSupplyModal from "../../../components/Medical_Supply/UpdateMedicalSupplyModal";
import { CreateMedicalSupplyModal } from "../../../components/Medical_Supply/CreateMedicalSupplyModal";
import { MedicalSupplyViewDetailModal } from "../../../components/Medical_Supply/MedicalSupplyViewDetailModal";
import { MedicalSupplyCRUDPanel } from "../../../components/Medical_Supply/MedicalSupplyManagementPanel";

const DEFAULT_FILTER: MedicalSupplyQuery = {
    PageIndex: 1,
    PageSize: 10,
    SortByNameByDescending: true,
    Status: '',
    Name: ''
};

export default function MedicalSupplyCRUDPage() {
   const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<MedicalSupplyQuery>(DEFAULT_FILTER);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);
   
    const medicalSupplies = useMedicalSupplies(filters);
    const modal = useMedicalSupplyModals();
    

    const handleShowToast = (message: string, type: 'success' | 'error') => {
        setToast({ isVisible: true, message, type });
      };
    
      const handleCloseToast = () => {
        setToast({ ...toast, isVisible: false });
      };
    
      const handleApplyFilters = (newFilters: MedicalSupplyQuery) => {
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
      const medicalSupply = await medicalSupplies.getById(id);
      modal.openView(medicalSupply);
    } catch {
      handleShowToast('Failed to load medical supply details.', 'error');
    }
  };

  // --- Edit ---
  const handleEdit = async (id: string) => {
    try {
      const medicalSupply = await medicalSupplies.getById(id);
      modal.openEdit(medicalSupply);
    } catch {
      handleShowToast('Failed to load medical supply for editing.', 'error');
    }
  };

  const handleUpdateSubmit = async (id: string, payload: Parameters<typeof medicalSupplies.update>[1]) => {
    setActionLoading(true);
    try {
      await medicalSupplies.update(id, payload);
      handleShowToast('Medical supply updated successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to update medical supply.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Create ---
  const handleCreateSubmit = async (payload: Parameters<typeof medicalSupplies.create>[0]) => {
    setActionLoading(true);
    try {
      await medicalSupplies.create(payload);
      handleShowToast('Medical supply created successfully!', 'success');
      modal.close();
    } catch (err: any) {
      handleShowToast(err?.response?.data?.message || 'Failed to create medical supply.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async (medicalSupplyId: string) => {
    setActionLoading(true);
    try {
      await medicalSupplies.remove(medicalSupplyId);
      handleShowToast('Medical supply deleted successfully!', 'success');
      modal.close();
    } catch {
      handleShowToast('Failed to delete medical supply.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

 

    return (
        <>
        <MedicalSupplyCRUDPanel 
        medicalSupplyData={medicalSupplies.data}
        loading={medicalSupplies.loading}
        pagination={{
          currentPage: filters.PageIndex || 1,
          totalPages: medicalSupplies.totalPages,
          totalItems: medicalSupplies.totalItems,
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
        onEdit={(medicalSupply) => handleEdit(medicalSupply.id)}
        onDelete={(medicalSupplyId) => modal.openDelete(medicalSupplyId)}
        onCreate={modal.openCreate}
      />
      {modal.state.type === 'view' && (
        <MedicalSupplyViewDetailModal    
          medicalSupply={modal.state.medicalSupply} 
          isOpen={true}
          onClose={modal.close} 
        />
      )}
      {modal.state.type === 'create' && (
        <CreateMedicalSupplyModal
          isOpen={true}
          onClose={modal.close}
          onSubmit={handleCreateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}
      {modal.state.type === 'edit' &&  (
        <UpdateMedicalSupplyModal
          isOpen={true}
          medicalSupply={modal.state.medicalSupply}
          onClose={modal.close}
          onSubmit={handleUpdateSubmit}
          onError={(msg)=> handleShowToast(msg, 'error')}
        />
      )}
      {modal.state.type === 'delete' && (
      <ConfirmationModal
        isOpen={true}
        onClose={modal.close}
        onConfirm={() => handleDeleteConfirm(modal.state.type === 'delete' ? modal.state.medicalSupplyId : '')}
        title="Delete Medical Supply"
        message={`Are you sure you want to delete this medical supply ? This action cannot be undone.`}
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