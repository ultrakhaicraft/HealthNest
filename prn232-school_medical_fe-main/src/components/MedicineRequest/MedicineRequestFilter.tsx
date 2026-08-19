import { MedicineRequestQueryParams } from "../../feature/API/MedicineRequestService";

//TODO: Need a way to define base and children filters component, so that we can have a base filter component 
// and then extend it for different use cases. For example, we can have a base filter component for the app in general, 
// and then extend it for different use cases like medicine request, incident report, etc. 
// This will help us to avoid code duplication and make the code more maintainable.


interface MedicineRequestFilterProps {
  filters: MedicineRequestQueryParams;
  onFilterChange: (filterKey: keyof MedicineRequestQueryParams, value: any) => void;
  onClearFilters: () => void;
}

export const MedicineRequestFilter = ({ filters, onFilterChange, onClearFilters }: MedicineRequestFilterProps) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        <div className="filter-group">
          <label>Request By:</label>
          <input
            type="text"
            value={filters.requestBy || ''}
            onChange={(e) => onFilterChange('requestBy', e.target.value)}
            placeholder="Search by requester name..."
          />
        </div>
        
        <div className="filter-group">
          <label>For Student:</label>
          <input
            type="text"
            value={filters.forStudent || ''}
            onChange={(e) => onFilterChange('forStudent', e.target.value)}
            placeholder="Search by student name..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={filters.sortBy || 'DateSent'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="DateSent">Date Sent</option>
            <option value="RequestBy">Request By</option>
            <option value="ForStudent">For Student</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Order:</label>
          <select
            value={filters.isDescending ? 'desc' : 'asc'}
            onChange={(e) => onFilterChange('isDescending', e.target.value === 'desc')}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
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