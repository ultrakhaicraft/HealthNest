import { useState, useEffect } from "react";
import filterStyles from "../../CSS/Nurse/NurseCRUDPanel.module.css";
import { UserRole } from "../../feature/Constant";
import { StudentHealthRecordQuery } from "../../models/StudentHealthRecordModel";


interface StudentHealthRecordFilterProps {
  filters: StudentHealthRecordQuery;
  onApplyFilters: (filters: StudentHealthRecordQuery) => void;
  onClearFilters: () => void;
  userRole: string;
}

export const StudentHealthRecordFilter = ({ filters, onApplyFilters, onClearFilters, userRole }: StudentHealthRecordFilterProps) => {
  const [filterSettings, setFilterSettings] = useState<StudentHealthRecordQuery>(filters);
  const [toggleRequestByFilter, setToggleRequestByFilter]= useState<boolean>(false);

  //If userRole somehow change, rerun the toggle check
  useEffect(()=>{
    if(userRole===UserRole.Nurse){
      setToggleRequestByFilter(true)
    }else{
      setToggleRequestByFilter(false)
    }
  },[userRole])
  
  //Change the filterSettings state whenever the filters prop changes
  useEffect(() => {
    setFilterSettings(filters);
  }, [filters]);
  
  const handleChange = (key: keyof StudentHealthRecordQuery, value: any) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilterSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={filterStyles.filterSection}>
      <div className={filterStyles.filterRow}>
        
        
        <div className={filterStyles.filterGroup}>
          <label>Student Name:</label>
          <input
            type="text"
            value={filterSettings.studentName || ''}
            onChange={(e) => handleChange('studentName', e.target.value)}
            placeholder="Search by student name..."
          />
        </div>
        
        <div className={filterStyles.filterGroup}>
          <label>Status:</label>
          <select
            value={filterSettings.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className={filterStyles.filterRow}>
       
        
      </div>
      
      <div className={filterStyles.filterActions}>
        <button className="button button-primary button-large" onClick={() => onApplyFilters(filterSettings)}>
          Apply Filters
        </button>
        <button className="button button-secondary button-large" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};