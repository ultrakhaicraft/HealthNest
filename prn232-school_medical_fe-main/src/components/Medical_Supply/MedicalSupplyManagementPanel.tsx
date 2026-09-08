import { MedicalSupplyQuery, MedicalSupplyViewModel } from "../../feature/API/MedicalSupplyService";
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { MedicalSupplyFilter } from "./MedicalSupplyFilter";


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
    <div className="crud-container">
          <div className="crud-header">
            <div>
              <h2 className="crud-title">Medical Supply Management Panel</h2>
              <p className="crud-subtitle">Manage medical supply inventory and records</p>
            </div>
            <div className="crud-actions">
                <button className="button button-secondary button-small" onClick={filterState.onToggle}>
                  <IconFilter />
                  {filterState.show ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button className="button button-primary button-small" onClick={onCreate}>
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
          <div className="crud-table-wrapper">
            <div className="crud-table-info">
              <span>Total: {pagination.totalItems} items</span>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
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
                        <button className="action-button" onClick={() => onView(medicalSupply.id)} disabled={loading}>
                          <IconView />
                        </button>
                        <button className="action-button" onClick={() => onEdit(medicalSupply)} disabled={loading}><IconEdit /></button>
                        <button className="action-button action-delete" onClick={() => onDelete(medicalSupply.id)} disabled={loading}>
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
                            onPageChange={(page) => filterState.onChange('PageIndex', page)}
          />
        </div>
  )
  }