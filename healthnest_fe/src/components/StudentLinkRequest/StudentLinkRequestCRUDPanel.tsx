import { MedicineQueryParams } from "../../feature/API/MedicineService";
import { IconView, IconEdit, IconDelete, IconFilter } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"
import { StudentLinkRequestQuery, StudentLinkRequestViewModel } from "../../models/StudentLinkRequestModel";
import { StudentLinkRequestFilter } from "./StudentLinkRequestFilter";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: StudentLinkRequestQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: MedicineQueryParams) => void;
  onClear: () => void;
}

interface StudentLinkRequestCRUDPanelProps {
  studentLinkRequestData: StudentLinkRequestViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
 
}
// Main CRUD component for student link Request
export const StudentLinkRequestCRUDPanel = ({ 
  studentLinkRequestData = [], loading, pagination, filterState,
  onView}: 
  StudentLinkRequestCRUDPanelProps) => {
  return (
    <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Student Link Request Management Panel</h2>
          <p className={styles.crudSubtitle}>Manage Student Link Request from parent, which check for the parent and their student relationship</p>
        </div>
        <div className={styles.crudActions}>
          <button className="button button-secondary button-large" onClick={filterState.onToggle}>
            <IconFilter />
            {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {filterState.show && (
        <StudentLinkRequestFilter
          filters={filterState.value}
          onClearFilters={filterState.onClear}
          onApplyFilters={filterState.onApply}
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
              <th>StudentId</th>
              <th>ParentId</th>
              <th>Status</th>
              <th>Created Date Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  Loading Student Link Request data...
                </td>
              </tr>
            )}
            {studentLinkRequestData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  No Student Link Request data found
                </td>
              </tr>
            )}
            {studentLinkRequestData.map(linkRequest => (
              <tr key={linkRequest.id}>
                <td>{linkRequest.id}</td>
                <td>{linkRequest.studentId}</td>
                <td>{linkRequest.parentId}</td>
                <td><StatusBadge status={linkRequest.status} /></td>
                <td>{linkRequest.createdDateTime}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => onView(linkRequest.id)} disabled={loading}>
                      <IconView />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.onPageChange}
      />
    </div>
  );
}

  
