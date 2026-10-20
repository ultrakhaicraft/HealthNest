import { useEffect, useState } from "react";
import filterStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { VaccineRecordQuery } from "../../models/VaccineRecordModel";


interface VaccineRecordFilterProps {
  filters: VaccineRecordQuery;
  onApplyFilters: (filters: VaccineRecordQuery) => void;
  onClearFilters: () => void;
}

const statuses: string[] =["Active","Inactive"];

export const VaccineRecordFilter = ({ filters, onApplyFilters, onClearFilters }: VaccineRecordFilterProps) => {
   const [filterDraft, setFilterDraft] = useState<VaccineRecordQuery>(filters);
  
    //Change the filterDraft state whenever the filters prop changes
    useEffect(() => {
      setFilterDraft(filters);
    }, [filters]);
  
    const handleChange = (key: keyof VaccineRecordQuery, value: any) => {
      console.log(`Filter changed: ${key} = ${value}`);
      setFilterDraft((prev) => ({ ...prev, [key]: value }));
    };
  
  return (
    <div className={filterStyles.filterSection}>
      <div className={filterStyles.filterRow}>
        
        <div className={filterStyles.filterGroup}>
          <label htmlFor="VaccineTitle">Vaccine Title:</label>
          <input
            id="VaccineTitle"
            type="text"
            value={filterDraft.vaccineTitle || ''}
            onChange={(e) => handleChange('vaccineTitle', e.target.value)}
            placeholder="Search by vaccine title..."
          />
        </div>
        
        <div className={filterStyles.filterGroup}>
          <label>Status:</label>
          <select
            value={filterDraft.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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