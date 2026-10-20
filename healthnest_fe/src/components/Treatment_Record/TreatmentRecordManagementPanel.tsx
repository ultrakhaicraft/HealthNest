import styles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { TreatmentRecordQuery, TreatmentRecordViewModel } from '../../models/TreatmentRecordModel';
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from '../IconList';
import { PaginationControls } from '../PaginationControls';
import { StatusBadge } from '../StatusBadge';
import { VaccineRecordFilter } from '../Vaccine_Record/VaccineRecordFilter';
import { TreatmentRecordFilter } from './TreatmentRecordFilter';


interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: TreatmentRecordQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: TreatmentRecordQuery) => void;
  onClear: () => void;
}

interface TreatmentRecordManagementPanelProps {
  treatmentRecordData: TreatmentRecordViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (incident: TreatmentRecordViewModel) => void;
  onDelete: (incidentId: string) => void;
  onCreate: () => void;
}

export const TreatmentRecordManagementPanel = ({ 
  treatmentRecordData = [], loading, pagination, filterState,
  onView, onEdit, onDelete, onCreate }: TreatmentRecordManagementPanelProps) => {
  return (
    <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Treatment Record Management Panel</h2>
          <p className={styles.crudSubtitle}>Manage student treatment records uch as create, update, and delete</p>
        </div>
        <div className={styles.crudActions}>
          <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                      <IconFilter />
                      {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-large" onClick={onCreate}>
            <IconPlus />
            Create Treatment Record
          </button>
        </div>
      </div>

      {filterState.show && (
              <TreatmentRecordFilter 
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
              <th>Treatment Title</th>
              <th>Record Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  Loading treatment records...
                </td>
              </tr>
            )}
            {treatmentRecordData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  No treatment records found
                </td>
              </tr>
            )}
            {treatmentRecordData.map(treatment => (
              <tr key={treatment.id}>
                <td>{treatment.id}</td>
                <td>{treatment.studentName}</td>
                <td>{treatment.treatmentTitle}</td>
                <td>{new Date(treatment.recordDate).toLocaleDateString()}</td>
                <td><StatusBadge status={treatment.status ?? ''} /></td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => onView(treatment.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className={styles.actionButton} onClick={() => onEdit(treatment)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className={`${styles.actionButton} ${styles.actionDelete}`} 
                      onClick={() => onDelete(treatment.id)} disabled={loading}>
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
