import { useState, useEffect } from 'react';

import "../../CSS/IncidentRecordCRUD.css"
import { IconDelete, IconEdit, IconPlus, IconView, IconFilter } from '../../../components/IconList';
import { MedicineRequestService, MedicineRequestResponseDto, MedicineRequestQueryParams } from '../../../feature/API/MedicineRequestService';
import { MedicineRequestViewDetail } from '../../../components/MedicineRequest/MedicineRequestView';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import CreateMedicineRequestModal from '../../../components/MedicineRequest/CreateMedicineRequestModal';
import { Toast } from '../../../components/Notification/Toast';
import UpdateMedicineRequestModal from '../../../components/MedicineRequest/UpdateMedicineRequestModal';

export default function MedicineRequestCRUDPage() {
  const [medicineRequestData, setMedicineRequestData] = useState<MedicineRequestResponseDto[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MedicineRequestResponseDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<MedicineRequestResponseDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [requestToUpdate, setRequestToUpdate] = useState<MedicineRequestResponseDto | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({ message: '', type: 'success', isVisible: false });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MedicineRequestQueryParams>({
    pageIndex: 1,
    pageSize: 10,
    sortBy: 'DateSent',
    isDescending: true
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadMedicineRequests = () => {
    setLoading(true);
    MedicineRequestService.getAll(filters)
      .then((res) => {
        console.log('API Response:', res);
        console.log('Data array:', res.data);
        setMedicineRequestData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch((error) => {
        console.error('Error loading medicine requests:', error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedicineRequests();
  }, [filters]);

  const handleViewRequest = async (id: string) => {
    setLoading(true);
    try {
      const request = await MedicineRequestService.getById(id);
      setSelectedRequest(request);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching medicine request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleDeleteClick = (request: MedicineRequestResponseDto) => {
    setRequestToDelete(request);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    
    setDeleteLoading(true);
    try {
      await MedicineRequestService.delete(requestToDelete.id);
      setShowDeleteConfirm(false);
      setRequestToDelete(null);
      setToast({ message: 'Medicine request deleted successfully!', type: 'success', isVisible: true });
      loadMedicineRequests();
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || 'Error deleting medicine request.', type: 'error', isVisible: true });
      console.error('Error deleting medicine request:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setRequestToDelete(null);
  };

  const handleCreateRequest = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSuccess = () => {
    setToast({ message: 'Medicine request created successfully!', type: 'success', isVisible: true });
    setShowCreateModal(false);
    loadMedicineRequests();
  };

  const handleCreateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleEditRequest = async (request: MedicineRequestResponseDto) => {
    setLoading(true);
    try {
      const fullRequest = await MedicineRequestService.getById(request.id);
      setRequestToUpdate(fullRequest);
      setShowUpdateModal(true);
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || 'Failed to load medicine request for editing.', type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setRequestToUpdate(null);
  };

  const handleUpdateSuccess = () => {
    setToast({ message: 'Medicine request updated successfully!', type: 'success', isVisible: true });
    setShowUpdateModal(false);
    setRequestToUpdate(null);
    loadMedicineRequests();
  };

  const handleUpdateError = (msg: string) => {
    setToast({ message: msg, type: 'error', isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleFilterChange = (filterKey: keyof MedicineRequestQueryParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
      pageIndex: filterKey !== 'pageIndex' ? 1 : value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      pageIndex: 1,
      pageSize: 10,
      sortBy: 'DateSent',
      isDescending: true
    });
  };

  return (
    <>
      <MedicineRequestCRUD 
        medicineRequestData={medicineRequestData}
        onViewRequest={handleViewRequest}
        onDeleteRequest={handleDeleteClick}
        onEditRequest={handleEditRequest}
        onCreateRequest={handleCreateRequest}
        loading={loading}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        totalPages={totalPages}
        totalItems={totalItems}
      />
      {showModal && selectedRequest && (
        <MedicineRequestViewDetail 
          medicineRequest={selectedRequest} 
          isOpen={showModal}
          onClose={handleCloseModal} 
        />
      )}
      <CreateMedicineRequestModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />
      <UpdateMedicineRequestModal
        isOpen={showUpdateModal}
        medicineRequest={requestToUpdate}
        onClose={handleCloseUpdateModal}
        onSuccess={handleUpdateSuccess}
        onError={handleUpdateError}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Medicine Request"
        message={`Are you sure you want to delete medicine request "${requestToDelete?.id}"? This action cannot be undone.`}
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

interface MedicineRequestCRUDProps {
  medicineRequestData: MedicineRequestResponseDto[];
  onViewRequest: (id: string) => void;
  onDeleteRequest: (request: MedicineRequestResponseDto) => void;
  onEditRequest: (request: MedicineRequestResponseDto) => void;
  onCreateRequest: () => void;
  loading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: MedicineRequestQueryParams;
  onFilterChange: (filterKey: keyof MedicineRequestQueryParams, value: any) => void;
  onClearFilters: () => void;
  totalPages: number;
  totalItems: number;
}

const MedicineRequestCRUD = ({ 
  medicineRequestData = [], 
  onViewRequest, 
  onDeleteRequest, 
  onEditRequest, 
  onCreateRequest, 
  loading,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onClearFilters,
  totalPages,
  totalItems
}: MedicineRequestCRUDProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine Request CRUD</h2>
          <p className="crud-subtitle">Manage medicine requests from parents</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="button button-secondary button-small" onClick={onToggleFilters}>
            <IconFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-small" onClick={onCreateRequest}>
            <IconPlus />
            Create Medicine Request
          </button>
        </div>
      </div>
      
      {showFilters && (
        <FilterSection 
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      )}
      
      <div className="crud-table-wrapper">
        <div className="crud-table-info">
          <span>Total: {totalItems} items</span>
          <span>Page {filters.pageIndex || 1} of {totalPages}</span>
        </div>
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requested By</th>
              <th>For Student</th>
              <th>Date Sent</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  Loading medicine requests...
                </td>
              </tr>
            )}
            {medicineRequestData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  No medicine requests found
                </td>
              </tr>
            )}
            {medicineRequestData.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.requestByName}</td>
                <td>{request.forStudentName}</td>
                <td>{new Date(request.dateSent).toLocaleDateString()}</td>
                <td><StatusBadge status={request.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => onViewRequest(request.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEditRequest(request)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className="action-button action-delete" onClick={() => onDeleteRequest(request)} disabled={loading}>
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <PaginationControls 
          currentPage={filters.pageIndex || 1}
          totalPages={totalPages}
          onPageChange={(page) => onFilterChange('pageIndex', page)}
        />
      </div>
    </div>
  );
};

interface FilterSectionProps {
  filters: MedicineRequestQueryParams;
  onFilterChange: (filterKey: keyof MedicineRequestQueryParams, value: any) => void;
  onClearFilters: () => void;
}

const FilterSection = ({ filters, onFilterChange, onClearFilters }: FilterSectionProps) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        <div className="filter-group">
          <label>Request By:</label>
          <input
            type="text"
            value={filters.requestBy || ''}
            onChange={(e) => onFilterChange('requestBy', e.target.value)}
            placeholder="Search by requester name..."
          />
        </div>
        
        <div className="filter-group">
          <label>For Student:</label>
          <input
            type="text"
            value={filters.forStudent || ''}
            onChange={(e) => onFilterChange('forStudent', e.target.value)}
            placeholder="Search by student name..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={filters.sortBy || 'DateSent'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="DateSent">Date Sent</option>
            <option value="RequestBy">Request By</option>
            <option value="ForStudent">For Student</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Order:</label>
          <select
            value={filters.isDescending ? 'desc' : 'asc'}
            onChange={(e) => onFilterChange('isDescending', e.target.value === 'desc')}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="button button-secondary button-small" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-controls">
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'status-badge-pending';
      case 'Approved':
        return 'status-badge-active';
      case 'Rejected':
        return 'status-badge-inactive';
      case 'Completed':
        return 'status-badge-resolved';
      default:
        return 'status-badge-pending';
    }
  };
  
  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
};