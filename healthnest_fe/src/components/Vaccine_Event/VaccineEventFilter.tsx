import { useState, useEffect } from 'react';
import filterStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { VaccineEventQueryParams } from '../../models/VaccineEventModel';


interface VaccineEventFilterProps {
  filters: VaccineEventQueryParams;
  onApplyFilters: (filters: VaccineEventQueryParams) => void;
  onClearFilters: () => void;
}

export const VaccineEventFilter = ({ filters, onApplyFilters, onClearFilters }: VaccineEventFilterProps) => {
  const [filterDraft, setFilterDraft] = useState<VaccineEventQueryParams>(filters);

  //Change the filterDraft state whenever the filters prop changes
  useEffect(() => {
    setFilterDraft(filters);
  }, [filters]);

  const handleChange = (key: keyof VaccineEventQueryParams, value: any) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilterDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={filterStyles.filterSection}>
      <div className={filterStyles.filterRow}>
        
        
        
        <div className={filterStyles.filterGroup}>
          <label htmlFor="Status">Status:</label>
          <select
            id="Status"
            value={filterDraft.Status || ''}
            onChange={(e) => {
              handleChange('Status', e.target.value);
            }}>
            <option value="" >All</option>
            <option value="Pending">Pending</option>
            <option value="Signup">In Signup Period</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
       <div className={filterStyles.filterRow}>
        <div className={filterStyles.filterGroup}>
          <label htmlFor="SortNameByDescending">Sort By Name (Descending):</label>
          <select
            id="SortNameByDescending"
            value={filterDraft.sortByLatestDateOccured ? 'true' : 'false'}
            onChange={(e) => handleChange('sortByLatestDateOccured', e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      
      <div className={filterStyles.filterActions}>
        <button className="button button-primary button-large" onClick={() => onApplyFilters(filterDraft)}>
          Apply Filters
        </button>
        <button className="button button-secondary button-large" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};