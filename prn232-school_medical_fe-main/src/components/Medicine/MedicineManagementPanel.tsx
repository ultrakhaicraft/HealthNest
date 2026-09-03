import { IncidentRecordQueryParams } from "../../feature/API/IncidentRecordService";
import { MedicineQueryParams, MedicineViewModel } from "../../feature/API/MedicineService";
import { IconPlus, IconView, IconEdit, IconDelete, IconFilter } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { MedicineFilter } from "./MedicineFilter";

interface MedicineCRUDPanelProps {
  medicineData: MedicineViewModel[];
  onViewMedicine: (id: string) => void;
  onDeleteMedicine: (medicine: MedicineViewModel) => void;
  loading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: MedicineQueryParams;
  onFilterChange: (filterKey: keyof MedicineQueryParams, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onCreateMedicine: () => void;
  onEditMedicine: (medicine: MedicineViewModel) => void;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}
// Main CRUD component for medicines
export const MedicineCRUDPanel = ({ 
  medicineData = [], totalPages, setTotalPages, 
  totalItems, showFilters, onToggleFilters,
  filters, onFilterChange, onApplyFilters, onClearFilters,
  onViewMedicine, onDeleteMedicine, 
  loading, onCreateMedicine, onEditMedicine }: 
  MedicineCRUDPanelProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine Management Panel</h2>
          <p className="crud-subtitle">Manage medicine inventory and records</p>
        </div>
        <div className="crud-actions">
            <button className="button button-secondary button-small" onClick={onToggleFilters}>
              <IconFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button className="button button-primary button-small" onClick={onCreateMedicine}>
            <IconPlus />
            Create Medicine
            </button>
        </div>
      </div>
      {showFilters && (
        <MedicineFilter 
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters} 
        onApplyFilters={onApplyFilters} />
      )}
      <div className="crud-table-wrapper">
        <div className="crud-table-info">
          <span>Total: {totalItems} items</span>
          <span>Page {filters.PageIndex || 1} of {totalPages}</span>
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
                    <button className="action-button" onClick={() => onViewMedicine(medicine.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEditMedicine(medicine)} disabled={loading}><IconEdit /></button>
                    <button className="action-button action-delete" onClick={() => onDeleteMedicine(medicine)} disabled={loading}>
                      <IconDelete />
                    </button>
                  </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls 
                        currentPage={filters.PageIndex || 1}
                        totalPages={totalPages}
                        onPageChange={(page) => onFilterChange('PageIndex', page)}
      />
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

// Status Badge Component
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusClass = status === 'Available' ? 'status-badge-active' : 'status-badge-inactive';
  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

