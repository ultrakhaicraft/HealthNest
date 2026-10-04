import { MedicineQueryParams, MedicineViewModel } from "../../feature/API/MedicineService";
import { IconPlus, IconView, IconEdit, IconDelete, IconFilter } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { MedicineFilter } from "./MedicineFilter";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: MedicineQueryParams;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: MedicineQueryParams) => void;
  onClear: () => void;
}

interface MedicineCRUDPanelProps {
  medicineData: MedicineViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (medicine: MedicineViewModel) => void;
  onDelete: (medicineId: string) => void;
  onCreate: () => void;
}
// Main CRUD component for medicines
export const MedicineCRUDPanel = ({ 
  medicineData = [], loading, pagination, filterState,
  onView, onEdit, onDelete, onCreate }: 
  MedicineCRUDPanelProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine Management Panel</h2>
          <p className="crud-subtitle">Manage medicine inventory and records</p>
        </div>
        <div className="crud-actions">
            <button className="button button-secondary button-small" onClick={filterState.onToggle}>
              <IconFilter />
              {filterState.show ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button className="button button-primary button-small" onClick={onCreate}>
            <IconPlus />
            Create Medicine
            </button>
        </div>
      </div>
      {filterState.show && (
        <MedicineFilter 
        filters={filterState.value}
        onClearFilters={filterState.onClear} 
        onApplyFilters={filterState.onApply} />
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
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  Loading medicines data...
                </td>
              </tr>
            )}
            {medicineData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  No medicine data found
                </td>
              </tr>
            )}
            {medicineData.map(medicine => (
              <tr key={medicine.id}>
                <td>{medicine.id}</td>
                <td>{medicine.name}</td>
                <td>{medicine.amount}</td>
                <td><StatusBadge status={medicine.isAvailable ? 'Available' : 'Unavailable'} /></td>
                <td>{medicine.createdByName}</td>
                <td><div className="action-buttons">
                    <button className="action-button" onClick={() => onView(medicine.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEdit(medicine)} disabled={loading}><IconEdit /></button>
                    <button className="action-button action-delete" onClick={() => onDelete(medicine.id)} disabled={loading}>
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
  );
}

  
