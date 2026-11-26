import { useEffect, useState } from "react";
import filterStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { StudentLinkRequestQuery } from "../../models/StudentLinkRequestModel";

interface StudentLinkRequestFilterProps {
    filters: StudentLinkRequestQuery;
    onApplyFilters: (filters: StudentLinkRequestQuery) => void;
    onClearFilters: () => void;
}

export const StudentLinkRequestFilter = ({ filters, onApplyFilters, onClearFilters }: StudentLinkRequestFilterProps) => {
    const [filterDraft, setFilterDraft] = useState<StudentLinkRequestQuery>(filters);

    //Change the filterDraft state whenever the filters prop changes
    useEffect(() => {
        setFilterDraft(filters);
    }, [filters]);

    const handleChange = (key: keyof StudentLinkRequestQuery, value: any) => {
        console.log(`Filter changed: ${key} = ${value}`);
        setFilterDraft((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className={filterStyles.filterSection}>
            <div className={filterStyles.filterRow}>

                <div className={filterStyles.filterGroup}>
                    <label htmlFor="StudentName">Student Name:</label>
                    <input
                        id="StudentName"
                        type="text"
                        value={filterDraft.studentName || ''}
                        onChange={(e) => handleChange('studentName', e.target.value)}
                        placeholder="Search by Student Name..."
                    />
                </div>

                <div className={filterStyles.filterGroup}>
                    <label htmlFor="ParentName">Parent Name:</label>
                    <input
                        id="ParentName"
                        type="text"
                        value={filterDraft.parentName || ''}
                        onChange={(e) => handleChange('parentName', e.target.value)}
                        placeholder="Search by Parent Name..."
                    />
                </div>

                <div className={filterStyles.filterGroup}>
                    <label htmlFor="Status">Status:</label>
                    <select
                        id="Status"
                        value={filterDraft.status || ''}
                        onChange={(e) => {
                            handleChange('status', e.target.value);
                        }}>
                        <option value="" >All</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>

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