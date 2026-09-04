import { useState, useEffect, useCallback } from 'react';

import "../../CSS/Nurse/IncidentRecordCRUD.css"
import "../../CSS/Nurse/NurseCRUDPanel.css"
import "../../CSS/Nurse/NurseStatusBadge.css"
import "../../CSS/Nurse/NurseModal.css"

import { IncidentRecordQueryParams, IncidentRecordService, IncidentRecordView } from '../../../feature/API/IncidentRecordService';
import { IncidentRecordViewDetail } from '../../../components/IncidentRecord/IncidentRecordViewDetailModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import CreateIncidentRecordModal from '../../../components/IncidentRecord/CreateIncidentRecordModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateIncidentRecordModal from '../../../components/IncidentRecord/UpdateIncidentRecordModal';
import { useSignalREvent } from '../../../components/SignalR/SignalrHook';
import { IncidentRecordCRUDPanel } from '../../../components/IncidentRecord/IncidentRecordManagementPanel';

// Main App Component
export default function IncidentRecordCRUDPage() {
  const [incidentData, setIncidentData] = useState<IncidentRecordView[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecordView | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<IncidentRecordView | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [incidentToUpdate, setIncidentToUpdate] = useState<IncidentRecordView | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({ message: '', type: 'success', isVisible: false });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IncidentRecordQueryParams>({
      PageIndex: 1,
      PageSize: 10,
      SortByLatest: true,
      Status: '',
      StudentId: '',
      DateFrom: '',
      DateTo: ''
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  

   // Function to load incidents with pagination, will run again based on PageIndex and PageSize changes
    const loadIncidents =  useCallback((filterArgs: IncidentRecordQueryParams) => {
      setLoading(true);
      IncidentRecordService.getAll(filterArgs)
      .then((res) => {
        setIncidentData(res.data ?? []);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
       })
      .catch((error) => {
        console.error('Error loading incident records:', error);
      })
      .finally(() => setLoading(false));
    },[filters]);


    //Load incidents based on filters changes
    useEffect(()=>{
      loadIncidents(filters);
    },[]);
    
    const handleIncidentAdded = useCallback((newIncident: IncidentRecordView) => {
      setIncidentData(prev => [newIncident, ...prev]);
      
      //Refresh the table to show the new incident record
      loadIncidents(filters);
    },[filters]);

  // In the parent component (wherever loadIncidents/filters live)
  const handleApplyFilters = useCallback(() => {
    loadIncidents(filters);
  }, [filters, loadIncidents]);

  //Add a SignalR event listener to listen for new incident records being added in real-time
  useSignalREvent<IncidentRecordView>("IncidentRecordAdded", handleIncidentAdded);


  const handleViewIncident = async (id: string) => {
    setLoading(true);
    try {
      const incident = await IncidentRecordService.getById(id);
      setSelectedIncident(incident);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching incident details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
  };

  const handleDeleteClick = (incident: IncidentRecordView) => {
    setIncidentToDelete(incident);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!incidentToDelete) return;
    
    setDeleteLoading(true);
    try {
      await IncidentRecordService.delete(incidentToDelete.id);
      setShowDeleteConfirm(false);
      setIncidentToDelete(null);
      setToast({ message: 'Incident record deleted successfully!', type: 'success', isVisible: true });
      loadIncidents(filters); // Reload the table
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || 'Error deleting incident record.', type: 'error', isVisible: true });
      console.error('Error deleting incident record:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setIncidentToDelete(null);
  };

  const handleCreateIncident = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSuccess = () => {
    setToast({ message: 'Incident record created successfully!', type: 'success', isVisible: true });
    setShowCreateModal(false);
    loadIncidents(filters); // Reload the table to show the new incident record
  };

  const handleCreateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleEditIncident = async (incident: IncidentRecordView) => {
    setLoading(true);
    try {
      const fullIncident = await IncidentRecordService.getById(incident.id);
      setIncidentToUpdate(fullIncident);
      setShowUpdateModal(true);
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || 'Failed to load incident record for editing.', type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setIncidentToUpdate(null);
  };

  const handleUpdateSuccess = () => {
    setToast({ message: 'Incident record updated successfully!', type: 'success', isVisible: true });
    setShowUpdateModal(false);
    setIncidentToUpdate(null);
    loadIncidents(filters); // Reload the table to show the updated incident record
  };

  const handleUpdateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleFilterChange = (filterKey: keyof IncidentRecordQueryParams, value: any) => {
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
      SortByLatest: true,
      Status: '',
      StudentId: '',
      DateFrom: '',
      DateTo: ''
    });
  };

  return (
    <>
      <IncidentRecordCRUDPanel 
        incidentData={incidentData}
        onViewIncident={handleViewIncident}
        onDeleteIncident={handleDeleteClick}
        loading={loading}
        onCreateIncident={handleCreateIncident}
        onEditIncident={handleEditIncident}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        totalItems={totalItems}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters} 
        onApplyFilters={handleApplyFilters}      
        />
      {showModal && selectedIncident && (
        <IncidentRecordViewDetail 
          incidentRecord={selectedIncident} 
          isOpen={showModal}
          onClose={handleCloseModal} 
        />
      )}
      <CreateIncidentRecordModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />
      <UpdateIncidentRecordModal
        isOpen={showUpdateModal}
        incidentRecord={incidentToUpdate}
        onClose={handleCloseUpdateModal}
        onSuccess={handleUpdateSuccess}
        onError={handleUpdateError}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Incident Record"
        message={`Are you sure you want to delete this incident record ? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        type="danger"
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleToastClose}
      />
    </>
  );
}






