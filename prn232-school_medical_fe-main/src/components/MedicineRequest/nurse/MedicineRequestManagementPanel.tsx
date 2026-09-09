import { MedicineRequestQueryParams, MedicineRequestViewModel } from "../../../feature/API/MedicineRequestService";
import { IconEdit, IconFilter, IconView } from "../../IconList";
import { PaginationControls } from "../../PaginationControls";
import { StatusBadge } from "../../StatusBadge";
import { MedicineRequestFilter } from "./MedicineRequestFilter";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface FilterState {
  value: MedicineRequestQueryParams;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: MedicineRequestQueryParams) => void;
  onClear: () => void;
}

export interface MedicineRequestCRUDPanelProps {
  medicineRequestData: MedicineRequestViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (medicine: MedicineRequestViewModel) => void;
  userRole: string;
}


export default function MedicineRequestCRUDPanel({ 
    medicineRequestData = [], loading, pagination, filterState, userRole,
    onView, onEdit
}: MedicineRequestCRUDPanelProps) {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine Request Management Panel</h2>
          <p className="crud-subtitle">Processing medicine requests from parents like View or Change Status</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="button button-secondary button-small" onClick={filterState.onToggle}>
            <IconFilter />
            {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      
      {filterState.show && (
        <MedicineRequestFilter 
          userRole={userRole}
          filters={filterState.value}
          onApplyFilters={filterState.onApply}
          onClearFilters={filterState.onClear}
        />
      )}
      
      <div className="crud-table-wrapper">
        <div className="crud-table-info">
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {filterState.value.PageIndex || 1} of {pagination.totalPages}</span>
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
                    <button className="action-button" onClick={() => onView(request.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEdit(request)} disabled={loading}>
                      <IconEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <PaginationControls 
          currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
        />
      </div>
    </div>
  );
};