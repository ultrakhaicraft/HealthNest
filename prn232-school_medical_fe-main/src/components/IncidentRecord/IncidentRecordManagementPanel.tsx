// All Sub component of the page

import { IncidentRecordView, IncidentRecordQueryParams } from "../../feature/API/IncidentRecordService";
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { IncidentRecordFilter } from "./IncidentRecordFilter";


interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: IncidentRecordQueryParams;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: IncidentRecordQueryParams) => void;
  onClear: () => void;
}

interface IncidentRecordCRUDPanelProps {
  incidentData: IncidentRecordView[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (incident: IncidentRecordView) => void;
  onDelete: (incidentId: string) => void;
  onCreate: () => void;
}

// Main CRUD component for incident records
export const IncidentRecordCRUDPanel = ({ 
  incidentData = [], loading, pagination, filterState,
  onView, onEdit, onDelete, onCreate }: IncidentRecordCRUDPanelProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Incident Record Management Panel</h2>
          <p className="crud-subtitle">Manage student incident records and reports such as create, update, and delete</p>
        </div>
        <div className="crud-actions">
          <button className="button button-secondary button-small" onClick={filterState.onToggle}>
                      <IconFilter />
                      {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-small" onClick={onCreate}>
            <IconPlus />
            Create Incident Record
          </button>
        </div>
      </div>

      {filterState.show && (
              <IncidentRecordFilter 
              filters={filterState.value}
              onClearFilters={filterState.onClear} 
              onApplyFilters={filterState.onApply} 
              />
      )}
      
      <div className="crud-table-wrapper">
        <div className="crud-table-info">
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        </div>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Student Name</th>
              <th>Incident</th>
              <th>Date Occurred</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  Loading incident records...
                </td>
              </tr>
            )}
            {incidentData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  No incident records found
                </td>
              </tr>
            )}
            {incidentData.map(incident => (
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td>{incident.studentName}</td>
                <td>{incident.incidentType}</td>
                <td>{new Date(incident.dateOccurred).toLocaleDateString()}</td>
                <td><StatusBadge status={incident.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => onView(incident.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEdit(incident)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className="action-button action-delete" onClick={() => onDelete(incident.id)} disabled={loading}>
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


