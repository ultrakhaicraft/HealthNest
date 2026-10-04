import { useEffect, useState } from "react";
import { IncidentRecordQueryParams } from "../../feature/API/IncidentRecordService";

interface IncidentRecordFilterProps {
  filters: IncidentRecordQueryParams;
  onApplyFilters: (filters: IncidentRecordQueryParams) => void;
  onClearFilters: () => void;
}

const statuses: string[] =["Active","Inactive","Resolved","Hospitalized"];

export const IncidentRecordFilter = ({ filters, onApplyFilters, onClearFilters }: IncidentRecordFilterProps) => {
   const [filterDraft, setFilterDraft] = useState<IncidentRecordQueryParams>(filters);
  
    //Change the filterDraft state whenever the filters prop changes
    useEffect(() => {
      setFilterDraft(filters);
    }, [filters]);
  
    const handleChange = (key: keyof IncidentRecordQueryParams, value: any) => {
      console.log(`Filter changed: ${key} = ${value}`);
      setFilterDraft((prev) => ({ ...prev, [key]: value }));
    };
  
  return (
    <div className="filter-section">
      <div className="filter-row">
        
        <div className="filter-group">
          <label htmlFor="StudentName">Student name:</label>
          <input
            id="StudentName"
            type="text"
            value={filterDraft.StudentName || ''}
            onChange={(e) => handleChange('StudentName', e.target.value)}
            placeholder="Search by student name..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterDraft.Status || ''}
            onChange={(e) => handleChange('Status', e.target.value)}
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
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filterDraft.DateFrom || ''}
            onChange={(e) => handleChange('DateFrom', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filterDraft.DateTo || ''}
            onChange={(e) => handleChange('DateTo', e.target.value)}
          />
        </div>
        
        
        <div className="filter-group">
          <label>Sort By Latest:</label>
          <select
            value={filterDraft.SortByLatest ? 'true' : 'false'}
            onChange={(e) => handleChange('SortByLatest', e.target.value === 'true')}
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