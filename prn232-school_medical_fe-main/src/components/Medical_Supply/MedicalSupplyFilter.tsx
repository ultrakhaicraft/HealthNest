import { MedicalSupplyQuery } from "../../feature/API/MedicalSupplyService";

interface MedicalSupplyFilterProps {
  filters: MedicalSupplyQuery;
  onApplyFilters: () => void;
  onFilterChange: (filterKey: keyof MedicalSupplyQuery, value: any) => void;
  onClearFilters: () => void;
}

export const MedicalSupplyFilter = ({ filters, onApplyFilters, onFilterChange, onClearFilters }: MedicalSupplyFilterProps) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label htmlFor="MedicineId">Medical Supply Name:</label>
          <input
            id="MedicineId"
            type="text"
            value={filters.Name || ''}
            onChange={(e) => onFilterChange('Name', e.target.value)}
            placeholder="Search by Medical Supply Name..."
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="IsAvailable">Status:</label>
          <select
            id="IsAvailable"
            value={filters.IsAvailable ? 'true' : 'false'}
            onChange={(e) => onFilterChange('IsAvailable', e.target.value === 'true')}>
            <option value="" selected >All</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="SortByNameByDescending">Sort By Name (Descending):</label>
          <select
            id="SortByNameByDescending"
            value={filters.SortByNameByDescending ? 'true' : 'false'}
            onChange={(e) => onFilterChange('SortByNameByDescending', e.target.value === 'true')}
          >
            <option value="" selected>None</option>
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