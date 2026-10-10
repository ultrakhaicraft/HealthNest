import { MedicalSupplyQuery, MedicalSupplyViewModel } from "../../feature/API/MedicalSupplyService";
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { MedicalSupplyFilter } from "./MedicalSupplyFilter";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"


interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: MedicalSupplyQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: MedicalSupplyQuery) => void;
  onClear: () => void;
}

interface MedicalSupplyCRUDPanelProps {
  medicalSupplyData: MedicalSupplyViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (medicine: MedicalSupplyViewModel) => void;
  onDelete: (medicineId: string) => void;
  onCreate: () => void;
}

export const MedicalSupplyCRUDPanel = ({ 
  medicalSupplyData = [], loading, pagination, filterState,
  onView, onEdit, onDelete, onCreate }: 
  MedicalSupplyCRUDPanelProps) => {
  return (
    <div className={styles.crudContainer}>
          <div className={styles.crudHeader}>
            <div>
              <h2 className={styles.crudTitle}>Medical Supply Management Panel</h2>
              <p className={styles.crudSubtitle}>Manage medical supply inventory and records</p>
            </div>
            <div className={styles.crudActions}>
                <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                  <IconFilter />
                  {filterState.show ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button className="button button-primary button-large" onClick={onCreate}>
                <IconPlus />
                Create a Medical Supply item
                </button>
            </div>
          </div>
          {filterState.show && (
            <MedicalSupplyFilter 
            filters={filterState.value}
            onClearFilters={filterState.onClear}
            onApplyFilters={filterState.onApply} />
          )}
          <div className={styles.crudTableWrapper}>
            <div className={styles.crudTableInfo}>
              <span>Total: {pagination.totalItems} items</span>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            </div>
            <table className={styles.crudTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Status</th> 
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className={styles.loadingBox}>
                      Loading medical supplies data...
                    </td>
                  </tr>
                )}
                {medicalSupplyData.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className={styles.loadingBox}>
                      No medical supply data found
                    </td>
                  </tr>
                )}
                {medicalSupplyData.map(medicalSupply => (
                  <tr key={medicalSupply.id}>
                    <td>{medicalSupply.id}</td>
                    <td>{medicalSupply.name}</td>
                    <td>{medicalSupply.amount}</td>
                    <td><StatusBadge status={medicalSupply.isAvailable ? 'Available' : 'Unavailable'} /></td>
                    <td>{medicalSupply.createdByName}</td>
                    <td><div className={styles.actionButtons}>
                        <button className={styles.actionButton} onClick={() => onView(medicalSupply.id)} disabled={loading}>
                          <IconView />
                        </button>
                        <button className={styles.actionButton} onClick={() => onEdit(medicalSupply)} disabled={loading}><IconEdit /></button>
                        <button className={`${styles.actionButton} ${styles.actionDelete}`} onClick={() => onDelete(medicalSupply.id)} disabled={loading}>
                          <IconDelete />
                        </button>
                      </div></td>
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
  )
  }