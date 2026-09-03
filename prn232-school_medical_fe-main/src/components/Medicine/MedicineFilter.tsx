import { MedicineQueryParams } from "../../feature/API/MedicineService";

interface MedicineFilterProps {
  filters: MedicineQueryParams;
  onApplyFilters: () => void;
  onFilterChange: (filterKey: keyof MedicineQueryParams, value: any) => void;
  onClearFilters: () => void;
}

export const MedicineFilter = ({ filters, onApplyFilters, onFilterChange, onClearFilters }: MedicineFilterProps) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label htmlFor="MedicineId">Medicine Id:</label>
          <input
            id="MedicineId"
            type="text"
            value={filters.Id || ''}
            onChange={(e) => onFilterChange('Id', e.target.value)}
            placeholder="Search by Medicine ID..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.IsAvailable ? 'true' : 'false'}
            onChange={(e) => onFilterChange('IsAvailable', e.target.value === 'true')}>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Sort By Name (Descending):</label>
          <select
            value={filters.SortNameByDescending ? 'true' : 'false'}
            onChange={(e) => onFilterChange('SortNameByDescending', e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="button button-primary button-small" onClick={onApplyFilters}>
          Apply Filters
        </button>
        <button className="button button-secondary button-small" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};