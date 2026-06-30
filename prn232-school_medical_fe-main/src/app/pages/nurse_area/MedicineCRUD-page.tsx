import { useState, useEffect } from 'react';

import "../../CSS//MedicineCRUD.css"
import { IconDelete, IconEdit, IconPlus, IconView } from '../../../components/IconList';
import { MedicineService, Medicine, PaginatedResponse } from '../../../feature/API/MedicineService';
import { MedicineView } from '../../../components/Medicine/MedicineView';
import CreateMedicineModal from '../../../components/Medicine/CreateMedicineModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineModal from '../../../components/Medicine/UpdateMedicineModal';

//Vài điều khi code phần này
//Gọi các API từ Backend thì phải tạo "MedicineService" trong feature/API, làm giống như các Service khác
//Tất cả Sub component nên dời trong file .tsx mới riêng của componen nó trong assests/components

// Main CRUD component for medicines
const MedicineCRUD = ({ medicineData = [], currentPage, totalPages, setCurrentPage, onViewMedicine, onDeleteMedicine, loading, onCreateMedicine, onEditMedicine }: { medicineData: Medicine[], currentPage: number, totalPages: number, setCurrentPage: (page: number) => void, onViewMedicine: (id: string) => void, onDeleteMedicine: (medicine: Medicine) => void, loading: boolean, onCreateMedicine: () => void, onEditMedicine: (medicine: Medicine) => void }) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine CRUD</h2>
          <p className="crud-subtitle">Manage medicine inventory and records</p>
        </div>
        <button className="button button-primary button-small" onClick={onCreateMedicine}>
          <IconPlus />
          Create Medicine
        </button>
      </div>
      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brief Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicineData.map(medicine => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.description}</td>
                <td><StatusBadge status={medicine.isAvailable ? 'Active' : 'Inactive'} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => onViewMedicine(medicine.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEditMedicine(medicine)} disabled={loading}><IconEdit /></button>
                    <button className="action-button action-delete" onClick={() => onDeleteMedicine(medicine)} disabled={loading}>
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

// Status Badge Component
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusClass = status === 'Active' ? 'status-badge-active' : 'status-badge-inactive';
  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number, totalPages: number, setCurrentPage: (page: number) => void }) => {
  return (
    <nav className="pagination-container">
      <button className="pagination-arrow" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
      <button className="pagination-arrow" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </nav>
  );
};

export default function MedicineCRUDPage() {
  const [medicineData, setMedicineData] = useState<Medicine[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const pageSize = 10;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | null>(null);

  const loadMedicines = () => {
    MedicineService.getAll({ PageIndex: currentPage, PageSize: pageSize })
      .then((res: PaginatedResponse<Medicine>) => {
        setMedicineData(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadMedicines();
  }, [currentPage]);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedicine(null);
  };

  const handleDeleteClick = (medicine: Medicine) => {
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
      loadMedicines(); // Reload the table
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

  const handleEditMedicine = (medicine: Medicine) => {
    setMedicineToEdit(medicine);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setMedicineToEdit(null);
  };

  return (
    <>
      <MedicineCRUD 
        medicineData={medicineData} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        setCurrentPage={setCurrentPage}
        onViewMedicine={handleViewMedicine}
        onDeleteMedicine={handleDeleteClick}
        loading={loading}
        onCreateMedicine={handleCreateMedicine}
        onEditMedicine={handleEditMedicine}
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
          onSuccess={() => {
            loadMedicines();
            handleShowToast('Medicine created successfully!', 'success');
          }}
          onError={(msg: string) => handleShowToast(msg, 'error')}
        />
      )}
      {showUpdateModal && medicineToEdit && (
        <UpdateMedicineModal
          isOpen={showUpdateModal}
          medicine={medicineToEdit}
          onClose={handleCloseUpdateModal}
          onSuccess={() => {
            loadMedicines();
            handleShowToast('Medicine updated successfully!', 'success');
          }}
          onError={(msg: string) => handleShowToast(msg, 'error')}
        />
      )}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Medicine"
        message={`Are you sure you want to delete "${medicineToDelete?.name}"? This action cannot be undone.`}
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




