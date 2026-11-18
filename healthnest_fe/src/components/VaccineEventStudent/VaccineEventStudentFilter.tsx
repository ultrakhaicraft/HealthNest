import { useState, useEffect } from 'react';
import filterStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css';
import { VaccineEventStudentQuery } from '../../models/VaccineEventStudentModel';


interface VaccineEventStudentFilterProps {
    filters: VaccineEventStudentQuery;
    onApplyFilters: (filters: VaccineEventStudentQuery) => void;
    onClearFilters: () => void;
}

export const VaccineEventStudentFilter = ({ filters, onApplyFilters, onClearFilters }: VaccineEventStudentFilterProps) => {
    const [filterDraft, setFilterDraft] = useState<VaccineEventStudentQuery>(filters);

    //Change the filterDraft state whenever the filters prop changes
    useEffect(() => {
        setFilterDraft(filters);
    }, [filters]);

    const handleChange = (key: keyof VaccineEventStudentQuery, value: any) => {
        console.log(`Filter changed: ${key} = ${value}`);
        setFilterDraft((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className={filterStyles.filterSection}>
            <div className={filterStyles.filterRow}>

                <div className={filterStyles.filterGroup}>
                    <label htmlFor="Status">Participant Status:</label>
                    <select
                        id="Status"
                        value={filterDraft.participantStatus || ''}
                        onChange={(e) => {
                            handleChange('participantStatus', e.target.value);
                        }}>
                        <option value="" >All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className={filterStyles.filterGroup}>
                    <label htmlFor="Class">Class:</label>
                    <input
                        id="Class"
                        type="text"
                        value={filterDraft.class || ''}
                        onChange={(e) => handleChange('class', e.target.value)}
                        placeholder="Search by Class..."
                    />
                </div>
            </div>

            <div className={filterStyles.filterRow}>
                <div className={filterStyles.filterGroup}>
                    <label htmlFor="SortNameByDescending">Sort By Date Signup (Descending):</label>
                    <select
                        id="SortNameByDescending"
                        value={filterDraft.sortByDateSignUp ? 'true' : 'false'}
                        onChange={(e) => handleChange('sortByDateSignUp', e.target.value === 'true')}
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