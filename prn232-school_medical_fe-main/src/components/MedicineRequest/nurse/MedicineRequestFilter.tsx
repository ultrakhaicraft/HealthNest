import { useEffect, useState } from "react";
import { MedicineRequestQueryParams } from "../../../feature/API/MedicineRequestService";


interface MedicineRequestFilterProps {
  filters: MedicineRequestQueryParams;
  onApplyFilters: (filters: MedicineRequestQueryParams) => void;
  onClearFilters: () => void;
}

export const MedicineRequestFilter = ({ filters, onApplyFilters, onClearFilters }: MedicineRequestFilterProps) => {
   const [filterSettings, setFilterSettings] = useState<MedicineRequestQueryParams>(filters);
  
    //Change the filterSettings state whenever the filters prop changes
    useEffect(() => {
      setFilterSettings(filters);
    }, [filters]);
  
    const handleChange = (key: keyof MedicineRequestQueryParams, value: any) => {
      console.log(`Filter changed: ${key} = ${value}`);
      setFilterSettings((prev) => ({ ...prev, [key]: value }));
    };

  return (
    <div className="filter-section">
      <div className="filter-row">
        <div className="filter-group">
          <label>Request By:</label>
          <input
            type="text"
            value={filterSettings.requestByName || ''}
            onChange={(e) => handleChange('requestByName', e.target.value)}
            placeholder="Search by requester name..."
          />
        </div>
        
        <div className="filter-group">
          <label>For Student:</label>
          <input
            type="text"
            value={filterSettings.forStudentName || ''}
            onChange={(e) => handleChange('forStudentName', e.target.value)}
            placeholder="Search by student name..."
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterSettings.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
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
            value={filterSettings.dateFrom || ''}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filterSettings.dateTo || ''}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={filterSettings.sortByLatestDate ? 'true' : 'false'}
            onChange={(e) => handleChange('sortByLatestDate', e.target.value)}
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