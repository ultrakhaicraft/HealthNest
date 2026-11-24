import { VaccineEventStudentQuery, ViewVaccineEventStudentModel } from "../../models/VaccineEventStudentModel";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"
import { RefreshButton } from "../RefreshButton";
import { VaccineEventStudentFilter } from "./VaccineEventStudentFilter";
import { IconFilter, IconView } from "../IconList";
import { StatusBadge } from "../StatusBadge";
import { PaginationControls } from "../PaginationControls";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../Student_Health_Record/ExtraComponentForDetail";


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
    onApprove: (eventId: string, studentId: string) => void;
    onReject: (eventId: string, studentId: string) => void;
    onComplete: (eventId: string, studentId: string) => void;
    onRefresh: () => void;
}


export const VaccineEventStudentManagementPanel = ({
    vaccineEventStudentData = [], loading, pagination, filterState,
    onView, onApprove, onReject, onComplete, onRefresh }:
    VaccineEventStudentManagementPanelProps) => {
    const navigate = useNavigate();

    const convertToRowKey = (studentId: string, eventId: string): string => {
        const RowKey: string = `${eventId}:${studentId}`;
        return RowKey;
    };

    const handleBackButton = () => {
        navigate("/nurse/vaccine-event");
    }


    return (
        <div className={styles.crudContainer}>
            <div className={styles.crudHeader}>
                <BackButton onClick={handleBackButton} />
                <div>
                    <h2 className={styles.crudTitle}>Vaccine Event Student Management Panel</h2>
                    <p className={styles.crudSubtitle}>Manage vaccine event participant related information like approve signup, reject signup or check attendance status</p>
                </div>
                <div className={styles.crudActions}>
                    <RefreshButton onRefresh={onRefresh} loading={loading} />

                    <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                        <IconFilter />
                        {filterState.show ? 'Hide Filters' : 'Show Filters'}
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
                                    {/*Add Reject, Approve, Complete button for status update*/}
                                    {/*Logic goes like this, display Reject and Approve only if status is Pending. It will open a confirmation modal
                                    After the status is in "Approve" state, a "Complete" button will appear which will open its own modal
                                    Complete, Reject or Cancelled status state will not show additional button beside view*/}
                                    <div className={styles.actionButtons}>
                                        <button className={styles.actionButton} onClick={() => onView(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                            <IconView />
                                        </button>
                                        {participant.status == 'Pending' && (<>
                                            <button className={`${styles.actionButton} ${styles.actionBtnApprove}`} onClick={() => onApprove(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Approve
                                            </button>
                                            <button className={`${styles.actionButton} ${styles.actionBtnDelete}`} onClick={() => onReject(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Reject
                                            </button>
                                        </>)}

                                        {participant.status == 'Approved' && (<>
                                            <button className={`${styles.actionButton} ${styles.actionBtnApprove}`} onClick={() => onComplete(participant.vaccineeventId, participant.studentId)} disabled={loading}>
                                                Mark this as Complete
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