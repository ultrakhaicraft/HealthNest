import { VaccineEventQueryParams, ViewVaccineEventDTO } from "../../models/VaccineEventModel";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"
import { IconDelete, IconEdit, IconFilter, IconPlus, IconView } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { VaccineEventFilter } from "./VaccineEventFilter";


interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

interface FilterState {
    value: VaccineEventQueryParams;
    show: boolean;
    onToggle: () => void;
    onApply: (filters: VaccineEventQueryParams) => void;
    onClear: () => void;
}

interface VaccineEventManagementPanelProps {
    vaccineEventData: ViewVaccineEventDTO[];
    loading: boolean;
    pagination: PaginationState;
    filterState: FilterState;
    onView: (id: string) => void;
    onEdit: (vaccineEvent: ViewVaccineEventDTO) => void;
    onDelete: (vaccineEventId: string) => void;
    onCreate: () => void;
}
// Main CRUD component for vaccines
export const VaccineEventManagementPanel = ({
    vaccineEventData = [], loading, pagination, filterState,
    onView, onEdit, onDelete, onCreate }:
    VaccineEventManagementPanelProps) => {
    return (
        <div className={styles.crudContainer}>
            <div className={styles.crudHeader}>
                <div>
                    <h2 className={styles.crudTitle}>Vaccine Event Management Panel</h2>
                    <p className={styles.crudSubtitle}>Manage vaccine event information</p>
                </div>
                <div className={styles.crudActions}>
                    <button className="button button-secondary button-large" onClick={filterState.onToggle}>
                        <IconFilter />
                        {filterState.show ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button className="button button-primary button-large" onClick={onCreate}>
                        <IconPlus />
                        Create Vaccine Event
                    </button>
                </div>
            </div>

            {filterState.show && (
                <VaccineEventFilter
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
                            <th>ID</th>
                            <th>Title</th>
                            <th>Date Occurred</th>
                            <th>Date Signup Start</th>
                            <th>Date Signup End</th>
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
                        {vaccineEventData.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className={styles.loadingBox}>
                                    No vaccine event data found
                                </td>
                            </tr>
                        )}
                        {vaccineEventData.map(vaccinEvent => (
                            <tr key={vaccinEvent.id}>
                                <td>{vaccinEvent.id}</td>
                                <td>{vaccinEvent.title}</td>
                                <td>{new Date(vaccinEvent.dateOccurred).toLocaleString()}</td>
                                <td>{new Date(vaccinEvent.dateSignupStart ?? "").toLocaleString()}</td>
                                <td>{new Date(vaccinEvent.dateSignupEnd ?? "").toLocaleString()}</td>
                                <td><StatusBadge status={vaccinEvent.status} /></td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.actionButton} onClick={() => onView(vaccinEvent.id)} disabled={loading}>
                                            <IconView />
                                        </button>
                                        <button className={styles.actionButton} onClick={() => onEdit(vaccinEvent)} disabled={loading}>
                                            <IconEdit />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.actionDelete}`}
                                            onClick={() => onDelete(vaccinEvent.id)}
                                            disabled={loading}
                                        >
                                            <IconDelete />
                                        </button>
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


