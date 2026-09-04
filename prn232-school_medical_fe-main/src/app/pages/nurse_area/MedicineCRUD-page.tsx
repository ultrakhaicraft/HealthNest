import { useState, useEffect, useCallback } from 'react';

import "../../CSS/Nurse/MedicineCRUD.css"
import { MedicineService, MedicineQueryParams, MedicineViewModel, MedicineDetailsViewModel } from '../../../feature/API/MedicineService';
import { MedicineViewDetailModal } from '../../../components/Medicine/MedicineView';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';
import { MedicineCRUDPanel } from '../../../components/Medicine/MedicineManagementPanel';



//Page component for managing medicine records
export default function MedicineCRUDPage() {
  const [medicinesListData, setMedicinesListData] = useState<MedicineViewModel[]>([]);

  //Selected medicine for viewing details, edit or delete
  //Since view, edit and delete are different actions that can't interact with each other, 
  //We can use the same state to store the selected medicine for all three actions
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDetailsViewModel | null>(null); 
  //const [medicineToDelete, setMedicineToDelete] = useState<MedicineViewModel | null>(null);
  //const [medicineToEdit, setMedicineToEdit] = useState<MedicineDetailsViewModel | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MedicineQueryParams>({
    PageIndex: 1,
    PageSize: 10,
    SortNameByDescending: true,
    IsAvailable: true,
    Id: '',
    Name: ''
  });
  
  //Load medicines list
  const loadMedicines =  useCallback((filterArgs: MedicineQueryParams) => {
        setLoading(true);
        MedicineService.getAll(filterArgs)
        .then((res) => {
          setMedicinesListData(res.data);
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

  // Callback to handle real-time updates when a new medicine record is added
  const handleMedicineAdded = useCallback((newMedicine: MedicineViewModel) => {
        setMedicinesListData(prev => [newMedicine, ...prev]);
        
        //Refresh the table to show the new medicine record
        loadMedicines(filters);
      },[filters]);
  
    // In the parent component (wherever loadMedicines/filters live)
    const handleApplyFilters = useCallback(() => {
      loadMedicines(filters);
    }, [filters, loadMedicines]);
  
  //Add a SignalR event listener to listen for new medicine records being added in real-time
  //useSignalREvent<MedicineViewModel>("MedicineAdded", handleMedicineAdded);

  // Function to view medicine details
  const handleViewMedicineDetails = async (id: string) => {
    setLoading(true);
    try {
      const medicine = await MedicineService.getById(id);
      setSelectedMedicine(medicine);
      setShowDetailModal(true);
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

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMedicine(null);
  };

  const handleUpdateSuccess = () => {
    setToast({ message: 'Medicine updated successfully!', type: 'success', isVisible: true });
    setShowUpdateModal(false);
    ////setMedicineToEdit(null);
    setSelectedMedicine(null);
    loadMedicines(filters); // Reload the table to show the updated medicine record
  };

  const handleUpdateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleDeleteClick = (medicine: MedicineDetailsViewModel) => {
    ////setMedicineToDelete(medicine);
    setSelectedMedicine(medicine);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMedicine) return;

    setDeleteLoading(true);
    try {
      await MedicineService.delete(selectedMedicine.id);
      setShowDeleteConfirmModal(false);
      //setMedicineToDelete(null);
      setSelectedMedicine(null);
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
    setShowDeleteConfirmModal(false);
    //setMedicineToDelete(null);
    setSelectedMedicine(null);
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

  const handleEditMedicine = (medicineId: string) => {
    //Get the medicine details from the server before opening the edit modal
    
      MedicineService.getById(medicineId)
      .then((res) => {
        //setMedicineToEdit(medicine);
        setSelectedMedicine(res);
        setShowUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error fetching medicine details for edit:', error);
        handleShowToast('Failed to fetch medicine details for edit.', 'error');
      });
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    //setMedicineToEdit(null);
    setSelectedMedicine(null);
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
        medicineData={medicinesListData} 
        onViewMedicine={handleViewMedicineDetails}
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
      {showDetailModal && selectedMedicine && (
        <MedicineViewDetailModal 
          medicine={selectedMedicine} 
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal} 
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
      {showUpdateModal && selectedMedicine && (
        <UpdateMedicineModal
          isOpen={showUpdateModal}
          medicine={selectedMedicine}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
          onError={handleUpdateError}
        />
      )}
      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
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




