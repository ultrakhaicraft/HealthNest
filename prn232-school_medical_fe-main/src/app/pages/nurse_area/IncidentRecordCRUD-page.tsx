import { useState, useEffect } from 'react';

import "../../CSS/IncidentRecordCRUD.css"
import { IconDelete, IconEdit, IconPlus, IconView } from '../../../components/IconList';
import { IncidentRecordService, IncidentRecordView } from '../../../feature/API/IncidentRecordService';
import { IncidentRecordViewDetail } from '../../../components/IncidentRecord/IncidentRecordView';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import CreateIncidentRecordModal from '../../../components/IncidentRecord/CreateIncidentRecordModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateIncidentRecordModal from '../../../components/IncidentRecord/UpdateIncidentRecordModal';

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

  

  const loadIncidents = () => {
    IncidentRecordService.getAll()
      .then((res: IncidentRecordView[]) => {
        setIncidentData(res);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadIncidents();
  }, []);

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
      loadIncidents(); // Reload the table
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
    loadIncidents();
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
    loadIncidents();
  };

  const handleUpdateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <IncidentRecordCRUD 
        incidentData={incidentData}
        onViewIncident={handleViewIncident}
        onDeleteIncident={handleDeleteClick}
        loading={loading}
        onCreateIncident={handleCreateIncident}
        onEditIncident={handleEditIncident}
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
        message={`Are you sure you want to delete incident record "${incidentToDelete?.id}"? This action cannot be undone.`}
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

// All Sub component of the page
// Main CRUD component for incident records
const IncidentRecordCRUD = ({ incidentData = [], onViewIncident, onDeleteIncident, loading, onCreateIncident, onEditIncident }: { incidentData: IncidentRecordView[], onViewIncident: (id: string) => void, onDeleteIncident: (incident: IncidentRecordView) => void, loading: boolean, onCreateIncident: () => void, onEditIncident: (incident: IncidentRecordView) => void }) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Incident Record CRUD</h2>
          <p className="crud-subtitle">Manage student incident records and reports</p>
        </div>
        <button className="button button-primary button-small" onClick={onCreateIncident}>
          <IconPlus />
          Create Incident Record
        </button>
      </div>
      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Incident</th>
              <th>Date Occurred</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incidentData.map(incident => (
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td>{incident.studentName}</td>
                <td>{incident.incidentType}</td>
                <td>{new Date(incident.dateOccurred).toLocaleDateString()}</td>
                <td><StatusBadge status={incident.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => onViewIncident(incident.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEditIncident(incident)} disabled={loading}><IconEdit /></button>
                    <button className="action-button action-delete" onClick={() => onDeleteIncident(incident)} disabled={loading}>
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

// Status Badge Component
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge-active';
      case 'Inactive':
        return 'status-badge-inactive';
      case 'Comple':
        return 'status-badge-resolved';
      case 'Pending':
        return 'status-badge-pending';
      default:
        return 'status-badge-pending';
    }
  };
  
  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
};