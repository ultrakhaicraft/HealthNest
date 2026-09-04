import { MedicalSupplyQuery, MedicalSupplyViewModel } from "../../feature/API/MedicalSupplyService";
import { MedicineQueryParams } from "../../feature/API/MedicineService";
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { MedicineFilter } from "../Medicine/MedicineFilter";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { MedicalSupplyFilter } from "./MedicalSupplyFilter";

interface MedicalSupplyCRUDPanelProps {
  medicalSupplyData: MedicalSupplyViewModel[];
  onViewMedicalSupply: (id: string) => void;
  onDeleteMedicalSupply: (medicalSupply: MedicalSupplyViewModel) => void;
  loading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: MedicalSupplyQuery;
  onFilterChange: (filterKey: keyof MedicalSupplyQuery, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onCreateMedicalSupply: () => void;
  onEditMedicalSupply: (medicalSupply: MedicalSupplyViewModel) => void;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}

export const MedicalSupplyCRUDPanel = ({ 
  medicalSupplyData = [], totalPages, setTotalPages, 
  totalItems, showFilters, onToggleFilters,
  filters, onFilterChange, onApplyFilters, onClearFilters,
  onViewMedicalSupply, onDeleteMedicalSupply, 
  loading, onCreateMedicalSupply, onEditMedicalSupply }: 
  MedicalSupplyCRUDPanelProps) => {
  return (
    <div className="crud-container">
          <div className="crud-header">
            <div>
              <h2 className="crud-title">Medical Supply Management Panel</h2>
              <p className="crud-subtitle">Manage medical supply inventory and records</p>
            </div>
            <div className="crud-actions">
                <button className="button button-secondary button-small" onClick={onToggleFilters}>
                  <IconFilter />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button className="button button-primary button-small" onClick={onCreateMedicalSupply}>
                <IconPlus />
                Create a Medical Supply item
                </button>
            </div>
          </div>
          {showFilters && (
            <MedicalSupplyFilter 
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
                      Loading medical supplies data...
                    </td>
                  </tr>
                )}
                {medicalSupplyData.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
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
                    <td><div className="action-buttons">
                        <button className="action-button" onClick={() => onViewMedicalSupply(medicalSupply.id)} disabled={loading}>
                          <IconView />
                        </button>
                        <button className="action-button" onClick={() => onEditMedicalSupply(medicalSupply)} disabled={loading}><IconEdit /></button>
                        <button className="action-button action-delete" onClick={() => onDeleteMedicalSupply(medicalSupply)} disabled={loading}>
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
  )
  }