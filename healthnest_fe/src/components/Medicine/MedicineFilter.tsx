import { useEffect, useState } from "react";
import { MedicineQueryParams } from "../../feature/API/MedicineService";

interface MedicineFilterProps {
  filters: MedicineQueryParams;
  onApplyFilters: (filters: MedicineQueryParams) => void;
  onClearFilters: () => void;
}

export const MedicineFilter = ({ filters, onApplyFilters, onClearFilters }: MedicineFilterProps) => {
  const [filterDraft, setFilterDraft] = useState<MedicineQueryParams>(filters);

  //Change the filterDraft state whenever the filters prop changes
  useEffect(() => {
    setFilterDraft(filters);
  }, [filters]);

  const handleChange = (key: keyof MedicineQueryParams, value: any) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilterDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label htmlFor="MedicineId">Medicine Name:</label>
          <input
            id="MedicineId"
            type="text"
            value={filterDraft.Name || ''}
            onChange={(e) => handleChange('Name', e.target.value)}
            placeholder="Search by Medicine Name..."
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="Status">Status:</label>
          <select
            id="Status"
            value={filterDraft.Status || ''}
            onChange={(e) => {
              handleChange('Status', e.target.value);
            }}>
            <option value="" >All</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="SortNameByDescending">Sort By Name (Descending):</label>
          <select
            id="SortNameByDescending"
            value={filterDraft.SortByNameByDescending ? 'true' : 'false'}
            onChange={(e) => handleChange('SortByNameByDescending', e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="button button-primary button-small" onClick={() => onApplyFilters(filterDraft)}>
          Apply Filters
        </button>
        <button className="button button-secondary button-small" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};