// All Sub component of the page

import { IncidentRecordView, IncidentRecordQueryParams } from "../../feature/API/IncidentRecordService";
import { IconFilter, IconPlus, IconView, IconEdit, IconDelete } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { IncidentRecordFilter } from "./IncidentRecordFilter";

// Main CRUD component for incident records
export const IncidentRecordCRUDPanel = ({ 
  incidentData = [], onViewIncident, 
  onDeleteIncident, loading, 
  onCreateIncident, onEditIncident, 
  totalPages, 
  totalItems, showFilters, 
  onToggleFilters, filters,

  onFilterChange, onClearFilters, onApplyFilters }: IncidentRecordCRUDPanelProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Incident Record Management Panel</h2>
          <p className="crud-subtitle">Manage student incident records and reports such as create, update, and delete</p>
        </div>
        <div className="crud-actions">
          <button className="button button-secondary button-small" onClick={onToggleFilters}>
                      <IconFilter />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-small" onClick={onCreateIncident}>
            <IconPlus />
            Create Incident Record
          </button>
        </div>
      </div>

      {showFilters && (
              <IncidentRecordFilter 
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters} 
              onApplyFilters={onApplyFilters}              />
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
                    <button className="action-button" onClick={() => onViewIncident(incident.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEditIncident(incident)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className="action-button action-delete" onClick={() => onDeleteIncident(incident)} disabled={loading}>
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaginationControls 
                  currentPage={filters.PageIndex || 1}
                  totalPages={totalPages}
                  onPageChange={(page) => onFilterChange('PageIndex', page)}
        />
      </div>
    </div>
  );
}


interface IncidentRecordCRUDPanelProps {
  incidentData: IncidentRecordView[];
  onViewIncident: (id: string) => void;
  onDeleteIncident: (incident: IncidentRecordView) => void;
  loading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: IncidentRecordQueryParams;
  onFilterChange: (filterKey: keyof IncidentRecordQueryParams, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onCreateIncident: () => void;
  onEditIncident: (incident: IncidentRecordView) => void;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}

