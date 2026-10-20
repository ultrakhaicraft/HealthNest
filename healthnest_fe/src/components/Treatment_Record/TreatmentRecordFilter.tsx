import { TreatmentRecordQuery } from "../../models/TreatmentRecordModel";

import { useEffect, useState } from "react";
import filterStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css';


interface TreatmentRecordFilterProps {
  filters: TreatmentRecordQuery;
  onApplyFilters: (filters: TreatmentRecordQuery) => void;
  onClearFilters: () => void;
}

const statuses: string[] =["Active","Inactive"];


export const TreatmentRecordFilter = ({ filters, onApplyFilters, onClearFilters }: TreatmentRecordFilterProps) => {
   const [filterDraft, setFilterDraft] = useState<TreatmentRecordQuery>(filters);
  
    //Change the filterDraft state whenever the filters prop changes
    useEffect(() => {
      setFilterDraft(filters);
    }, [filters]);
  
    const handleChange = (key: keyof TreatmentRecordQuery, value: any) => {
      console.log(`Filter changed: ${key} = ${value}`);
      setFilterDraft((prev) => ({ ...prev, [key]: value }));
    };
  
  return (
    <div className={filterStyles.filterSection}>
      <div className={filterStyles.filterRow}>
        
        <div className={filterStyles.filterGroup}>
          <label htmlFor="TreatmentTitle">Treatment Title:</label>
          <input
            id="TreatmentTitle"
            type="text"
            value={filterDraft.treatmentTitle || ''}
            onChange={(e) => handleChange('treatmentTitle', e.target.value)}
            placeholder="Search by treatment title..."
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