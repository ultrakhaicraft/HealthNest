// All Sub component of the page

import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import styles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { VaccineRecordQuery, VaccineRecordViewModel } from "../../models/VaccineRecordModel";
import { VaccineRecordFilter } from "./VaccineRecordFilter";



interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: VaccineRecordQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: VaccineRecordQuery) => void;
  onClear: () => void;
}

interface VaccineRecordManagementPanelProps {
  vaccineRecordData: VaccineRecordViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (incident: VaccineRecordViewModel) => void;
  onDelete: (incidentId: string) => void;
  onCreate: () => void;
}

export const VaccineRecordManagementPanel = ({ 
  vaccineRecordData = [], loading, pagination, filterState,
  onView, onEdit, onDelete, onCreate }: VaccineRecordManagementPanelProps) => {
  return (
    <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Vaccine Record Management Panel</h2>
          <p className={styles.crudSubtitle}>Manage student vaccine records uch as create, update, and delete</p>
        </div>
        <div className={styles.crudActions}>
          <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                      <IconFilter />
                      {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-large" onClick={onCreate}>
            <IconPlus />
            Create Vaccine Record
          </button>
        </div>
      </div>

      {filterState.show && (
              <VaccineRecordFilter 
              filters={filterState.value}
              onClearFilters={filterState.onClear} 
              onApplyFilters={filterState.onApply} 
              />
      )}
      
      <div className={styles.crudTableWrapper}>
        <div className={styles.crudTableInfo}>
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        </div>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Student Name</th>
              <th>Vaccine Title</th>
              <th>Record Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  Loading vaccine records...
                </td>
              </tr>
            )}
            {vaccineRecordData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  No vaccine records found
                </td>
              </tr>
            )}
            {vaccineRecordData.map(vaccineRecord => (
              <tr key={vaccineRecord.id}>
                <td>{vaccineRecord.id}</td>
                <td>{vaccineRecord.studentName}</td>
                <td>{vaccineRecord.vaccineTitle}</td>
                <td>{new Date(vaccineRecord.recordDate).toLocaleDateString()}</td>
                <td><StatusBadge status={vaccineRecord.status ?? ''} /></td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => onView(vaccineRecord.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className={styles.actionButton} onClick={() => onEdit(vaccineRecord)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className={`${styles.actionButton} ${styles.actionDelete}`} 
                      onClick={() => onDelete(vaccineRecord.id)} disabled={loading}>
                      <IconDelete />
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
}


