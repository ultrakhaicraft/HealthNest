import { VaccineEventStudentQuery, ViewVaccineEventStudentModel } from "../../models/VaccineEventStudentModel";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"
import { RefreshButton } from "../RefreshButton";
import { VaccineEventStudentFilter } from "./VaccineEventStudentFilter";
import { IconFilter, IconPlus, IconView } from "../IconList";
import { StatusBadge } from "../StatusBadge";
import { PaginationControls } from "../PaginationControls";

// We will find a way to merge with the management panel
interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

interface FilterState {
    value: VaccineEventStudentQuery;
    show: boolean;
    onToggle: () => void;
    onApply: (filters: VaccineEventStudentQuery) => void;
    onClear: () => void;

}

interface VaccineEventStudentManagementPanelProps {
    vaccineEventStudentData: ViewVaccineEventStudentModel[];
    loading: boolean;
    pagination: PaginationState;
    filterState: FilterState;
    onView: (eventId: string, studentId: string) => void;
    onSignUp: () => void;
    onSignUpAgain: (eventId: string, studentId: string) => void;
    onRefresh: () => void;
    onEdit: (eventId: string, studentId: string) => void;
    onCancel: (eventId: string, studentId: string) => void;
}


export const VaccineEventStudentViewPanel = ({
    vaccineEventStudentData = [], loading, pagination, filterState,
    onView, onSignUp, onRefresh, onEdit, onCancel, onSignUpAgain }:
    VaccineEventStudentManagementPanelProps) => {

    const convertToRowKey = (studentId: string, eventId: string): string => {
        const RowKey: string = `${eventId}:${studentId}`;
        return RowKey;
    };




    return (
        <div className={styles.crudContainer}>
            <div className={styles.crudHeader}>
                <div>
                    <h2 className={styles.crudTitle}>Vaccine Event Sign Up Panel</h2>
                    <p className={styles.crudSubtitle}>See available event and have your children sign up</p>
                </div>
                <div className={styles.crudActions}>
                    <RefreshButton onRefresh={onRefresh} loading={loading} />

                    <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                        <IconFilter />
                        {filterState.show ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button className="button button-primary button-large" onClick={onSignUp}>
                        <IconPlus />
                        Click here to Sign up
                    </button>
                </div>
            </div>

            {filterState.show && (
                <VaccineEventStudentFilter
                    filters={filterState.value}
                    onClearFilters={filterState.onClear}
                    onApplyFilters={filterState.onApply}
                />
            )}

            <div className={styles.crudTableWrapper}>
                <div className={styles.crudTableInfo}>
                    <span>Total: {pagination.totalItems} items</span>
                    <span>Page {filterState.value.pageIndex || 1} of {pagination.totalPages}</span>
                </div>
                <table className={styles.crudTable}>
                    <thead>
                        <tr>
                            <th>Event Id</th>
                            <th>Student Id</th>
                            <th>Sign Up Date</th>
                            <th>Status </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} className={styles.loadingBox}>
                                    Loading vaccine event data...
                                </td>
                            </tr>
                        )}
                        {vaccineEventStudentData.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className={styles.loadingBox}>
                                    No vaccine event participant data found
                                </td>
                            </tr>
                        )}
                        {vaccineEventStudentData.map(participant => (
                            <tr key={convertToRowKey(participant.studentId, participant.vaccineeventId)}>
                                <td>{participant.vaccineeventId}</td>
                                <td>{participant.studentId}</td>
                                <td>{new Date(participant.signupDate).toLocaleString()}</td>
                                <td><StatusBadge status={participant.status ?? ""} /></td>
                                <td>

                                    <div className={styles.actionButtons}>
                                        <button className={styles.actionButton} onClick={() => onView(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                            <IconView />
                                        </button>
                                        {participant.status=='Pending' &&(<>
                                            <button className="button button-secondary button-small" onClick={() => onEdit(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Update
                                            </button>
                                            <button className="button button-secondary button-small" onClick={() => onCancel(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Cancel
                                            </button>
                                        </>)}

                                        {participant.status=='Cancelled' &&(<>                                 
                                            <button className="button button-secondary button-small" onClick={() => onSignUpAgain(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Sign Up Again
                                            </button>
                                        </>)}
                                    </div>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
            />
        </div>
    );
}