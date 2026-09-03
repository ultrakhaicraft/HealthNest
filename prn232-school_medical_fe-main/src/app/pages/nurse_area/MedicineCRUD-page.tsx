import { useState, useEffect, useCallback } from 'react';

import "../../CSS/Nurse/MedicineCRUD.css"
import { MedicineService, MedicineQueryParams, MedicineViewModel } from '../../../feature/API/MedicineService';
import { MedicineView } from '../../../components/Medicine/MedicineView';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';
import { MedicineCRUDPanel } from '../../../components/Medicine/MedicineManagementPanel';



//Page component for managing medicine records
export default function MedicineCRUDPage() {
  const [medicineData, setMedicineData] = useState<MedicineViewModel[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineViewModel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<MedicineViewModel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<MedicineViewModel | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MedicineQueryParams>({
    PageIndex: 1,
    PageSize: 10,
    SortNameByDescending: true,
    IsAvailable: true,
    Id: '',
    Name: ''
  });

  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  

  const loadMedicines =  useCallback((filterArgs: MedicineQueryParams) => {
        setLoading(true);
        MedicineService.getAll(filterArgs)
        .then((res) => {
          setMedicineData(res.data);
          setTotalPages(res.totalPages);
          setTotalItems(res.totalCount);
          
         })
        .catch((error) => {
          console.error('Error loading medicine requests:', error);
        })
        .finally(() => setLoading(false));
  },[filters]);

  useEffect(() => {
    loadMedicines(filters);
  }, [currentPage]);

  const handleMedicineAdded = useCallback((newMedicine: MedicineViewModel) => {
        setMedicineData(prev => [newMedicine, ...prev]);
        
        //Refresh the table to show the new medicine record
        loadMedicines(filters);
      },[filters]);
  
    // In the parent component (wherever loadMedicines/filters live)
    const handleApplyFilters = useCallback(() => {
      loadMedicines(filters);
    }, [filters, loadMedicines]);
  
    //Add a SignalR event listener to listen for new medicine records being added in real-time
    //useSignalREvent<MedicineViewModel>("MedicineAdded", handleMedicineAdded);

  const handleViewMedicine = async (id: string) => {
    setLoading(true);
    try {
      const medicine = await MedicineService.getById(id);
      setSelectedMedicine(medicine);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setToast({ message: 'Medicine created successfully!', type: 'success', isVisible: true });
    setShowCreateModal(false);
    loadMedicines(filters); // Reload the table to show the new medicine record
  };

  const handleCreateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedicine(null);
  };

  const handleUpdateSuccess = () => {
    setToast({ message: 'Medicine updated successfully!', type: 'success', isVisible: true });
    setShowUpdateModal(false);
    setMedicineToEdit(null);
    loadMedicines(filters); // Reload the table to show the updated medicine record
  };

  const handleUpdateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleDeleteClick = (medicine: MedicineViewModel) => {
    setMedicineToDelete(medicine);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!medicineToDelete) return;
    
    setDeleteLoading(true);
    try {
      await MedicineService.delete(medicineToDelete.id);
      setShowDeleteConfirm(false);
      setMedicineToDelete(null);
      loadMedicines(filters); // Reload the table
      handleShowToast('Medicine deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      handleShowToast('Failed to delete medicine.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setMedicineToDelete(null);
  };

  const handleCreateMedicine = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleEditMedicine = (medicine: MedicineViewModel) => {
    setMedicineToEdit(medicine);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setMedicineToEdit(null);
  };

  const handleFilterChange = (filterKey: keyof MedicineQueryParams, value: any) => {
        setFilters(prev => ({
          ...prev,
          [filterKey]: value,
          pageIndex: filterKey !== 'PageIndex' ? 1 : value
        }));
    };
  
    const handleClearFilters = () => {
      setFilters({
        PageIndex: 1,
        PageSize: 10,
        SortNameByDescending: true,
        IsAvailable: true,
        Id: '',
        Name: ''
      });
    };

  return (
    <>
      <MedicineCRUDPanel 
        medicineData={medicineData} 
        onViewMedicine={handleViewMedicine}
        onDeleteMedicine={handleDeleteClick}
        loading={loading}
        onCreateMedicine={handleCreateMedicine}
        onEditMedicine={handleEditMedicine}
        totalPages={totalPages} 
        setTotalPages={setTotalPages}
        totalItems={totalItems}
        showFilters={showFilters}
        onToggleFilters={()=> setShowFilters(!showFilters)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      {showModal && selectedMedicine && (
        <MedicineView 
          medicine={selectedMedicine} 
          isOpen={showModal}
          onClose={handleCloseModal} 
        />
      )}
      {showCreateModal && (
        <CreateMedicineModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
          onError={handleCreateError}
        />
      )}
      {showUpdateModal && medicineToEdit && (
        <UpdateMedicineModal
          isOpen={showUpdateModal}
          medicine={medicineToEdit}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
          onError={handleUpdateError}
        />
      )}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Medicine"
        message={`Are you sure you want to delete this medicine ? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        type="danger"
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
}




