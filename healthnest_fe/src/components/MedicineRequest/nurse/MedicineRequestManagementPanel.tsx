import { MedicineRequestQueryParams, MedicineRequestViewModel } from "../../../feature/API/MedicineRequestService";
import { IconEdit, IconFilter, IconView } from "../../IconList";
import { PaginationControls } from "../../PaginationControls";
import { StatusBadge } from "../../StatusBadge";
import { MedicineRequestFilter } from "./MedicineRequestFilter";
import styles from "../../../CSS/Nurse/NurseCRUDPanel.module.css"

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
  onEdit: (medicineRequest: MedicineRequestViewModel) => void;
  userRole: string;
  onCreate?: () => void;
  onDelete: (medicineRequestId: string) => void;
}


export default function MedicineRequestCRUDPanel({ 
    medicineRequestData = [], loading, pagination, filterState, userRole,
    onView, onEdit
}: MedicineRequestCRUDPanelProps) {
  return (
    <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Medicine Request Management Panel</h2>
          <p className={styles.crudSubtitle}>Processing medicine requests from parents like View or Change Status</p>
        </div>
        {/* .crudActions is display:flex + gap:0.5rem, same as the old inline style */}
        <div className={styles.crudActions}>
          {/* button classes are not in the module, so they stay global */}
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
      
      <div className={styles.crudTableWrapper}>
        <div className={styles.crudTableInfo}>
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {filterState.value.PageIndex || 1} of {pagination.totalPages}</span>
        </div>
        <table className={styles.crudTable}>
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
                <td colSpan={6} className={styles.loadingBox}>
                  Loading medicine requests...
                </td>
              </tr>
            )}
            {medicineRequestData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
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
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => onView(request.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className={styles.actionButton} onClick={() => onEdit(request)} disabled={loading}>
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