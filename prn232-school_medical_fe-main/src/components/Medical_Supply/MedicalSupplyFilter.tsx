import { useEffect, useState } from "react";
import { MedicalSupplyQuery } from "../../feature/API/MedicalSupplyService";

interface MedicalSupplyFilterProps {
  filters: MedicalSupplyQuery;
  onApplyFilters: (filters: MedicalSupplyQuery) => void;
  onClearFilters: () => void;
}

export const MedicalSupplyFilter = ({ filters, onApplyFilters, onClearFilters }: MedicalSupplyFilterProps) => {
  const [filterSettings, setFilterSettings] = useState<MedicalSupplyQuery>(filters);
  
  useEffect(() => {
      setFilterSettings(filters);
    }, [filters]);

  const handleChange = (key: keyof MedicalSupplyQuery, value: any) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilterSettings((prev) => ({...prev, [key]: value }));
  }

  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label htmlFor="MedicineId">Medical Supply Name:</label>
          <input
            id="MedicineId"
            type="text"
            value={filterSettings.Name || ''}
            onChange={(e) => handleChange('Name', e.target.value)}
            placeholder="Search by Medical Supply Name..."
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="IsAvailable">Status:</label>
          <select
            id="IsAvailable"
            value={filterSettings.Status || ''}
            onChange={(e) => handleChange('Status', e.target.value)}>
            <option value="" >All</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="SortByNameByDescending">Sort By Name (Descending):</label>
          <select
            id="SortByNameByDescending"
            value={filterSettings.SortByNameByDescending ? 'true' : 'false'}
            onChange={(e) => handleChange('SortByNameByDescending', e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="button button-primary button-small" onClick={() => onApplyFilters(filterSettings)}>
          Apply Filters
        </button>
        <button className="button button-secondary button-small" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};