import { IncidentRecordQueryParams } from "../../feature/API/IncidentRecordService";

interface IncidentRecordFilterProps {
  filters: IncidentRecordQueryParams;
  onFilterChange: (filterKey: keyof IncidentRecordQueryParams, value: any) => void;
  onClearFilters: () => void;
}

export const IncidentRecordFilter = ({ filters, onFilterChange, onClearFilters }: IncidentRecordFilterProps) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label>Student Id:</label>
          <input
            type="text"
            value={filters.StudentId || ''}
            onChange={(e) => onFilterChange('StudentId', e.target.value)}
            placeholder="Search by student ID..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.Status || ''}
            onChange={(e) => onFilterChange('Status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
            <option value="Hospitalized">Hospitalized</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.DateFrom || ''}
            onChange={(e) => onFilterChange('DateFrom', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.DateTo || ''}
            onChange={(e) => onFilterChange('DateTo', e.target.value)}
          />
        </div>
        
        
        <div className="filter-group">
          <label>Sort By Latest:</label>
          <select
            value={filters.SortByLatest ? 'true' : 'false'}
            onChange={(e) => onFilterChange('SortByLatest', e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="button button-secondary button-small" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};