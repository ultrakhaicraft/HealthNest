import { IconFilter, IconRetry } from "../IconList";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css"
import { StudentLinkRequestQuery, StudentLinkRequestViewModel } from "../../models/StudentLinkRequestModel";
import { StudentLinkRequestFilter } from "./StudentLinkRequestFilter";
import { LinkRequestStatus } from "../../feature/Constant";
import queueStyles from '../../CSS/Nurse/NurseLinkRequestStyle.module.css';


interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  value: StudentLinkRequestQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: StudentLinkRequestQuery) => void;
  onClear: () => void;
}

interface StudentLinkRequestCRUDPanelProps {
  studentLinkRequestData: StudentLinkRequestViewModel[];
  loading: boolean;
  error?: string | null;
  pendingCount?: number;
  pagination: PaginationState;
  filterState: FilterState;
  onStatusChange: (status: LinkRequestStatus | '') => void;
  onRefresh: () => void;
  onView: (id: string) => void;
}

const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
const formatAge = (days: number) => (days <= 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`);


// Main CRUD component for student link Request
export const StudentLinkRequestCRUDPanel = ({
  studentLinkRequestData = [], loading, error = null, pendingCount, pagination, filterState,
  onStatusChange, onRefresh, onView,
}: StudentLinkRequestCRUDPanelProps) => {
  const activeStatus = filterState.value.status ?? '';
  const firstLoad = loading && studentLinkRequestData.length === 0;
  const refreshing = loading && studentLinkRequestData.length > 0;
  return (
     <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Student Link Requests</h2>
          <p className={styles.crudSubtitle}>
            Verify each parent's relationship to the student before approving. Oldest pending requests come first.
          </p>
        </div>
        <div className={styles.crudActions}>
          <button className="button button-secondary button-large" onClick={onRefresh} disabled={loading}>
            <IconRetry /> Refresh
          </button>
          <button className="button button-secondary button-large" onClick={filterState.onToggle}>
            <IconFilter />
            {filterState.show ? 'Hide Filters' : 'Search by name'}
          </button>
        </div>
      </div>

      <div className={queueStyles.tabs} role="group" aria-label="Filter by status">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.label}
            type="button"
            aria-pressed={activeStatus === tab.status}
            className={activeStatus === tab.status ? `${queueStyles.tab} ${queueStyles.tabActive}` : queueStyles.tab}
            onClick={() => onStatusChange(tab.status)}
          >
            {tab.label}
            {tab.status === 'Pending' && !!pendingCount && (
              <span className={queueStyles.tabBadge}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {filterState.show && (
        <StudentLinkRequestFilter
          filters={filterState.value}
          onClearFilters={filterState.onClear}
          onApplyFilters={filterState.onApply}
        />
      )}

      <div className={styles.crudTableWrapper}>
        <div className={styles.crudTableInfo}>
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        </div>
        <table className={`${styles.crudTable} ${refreshing ? queueStyles.tableBusy : ''}`}>
          <thead>
            <tr>
              <th>Parent</th>
              <th>Student</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={5} className={styles.loadingBox}>{error}</td></tr>
            )}
            {!error && firstLoad && (
              <tr><td colSpan={5} className={styles.loadingBox}>Loading link requests...</td></tr>
            )}
            {!error && !loading && studentLinkRequestData.length === 0 && (
              <tr><td colSpan={5} className={styles.loadingBox}>{EMPTY_MESSAGES[activeStatus]}</td></tr>
            )}
            {studentLinkRequestData.map(request => {
              const isPending = request.status === 'Pending';
              const days = daysSince(request.createdDateTime);
              const stale = isPending && days >= STALE_AFTER_DAYS;
              const others = request.otherPendingCount ?? 0;
              const studentLabel = request.studentName ?? 'Unknown student';

              return (
                <tr key={request.id} className={stale ? queueStyles.rowStale : undefined}>
                  <td>{request.parentName ?? 'Unknown parent'}</td>
                  <td>
                    {studentLabel}
                    {isPending && others > 0 && (
                      <span
                        className={queueStyles.competingChip}
                        title="Approving one of these requests automatically rejects the others for this student"
                      >
                        +{others} other pending
                      </span>
                    )}
                  </td>
                  <td>
                    <span title={new Date(request.createdDateTime).toLocaleString()}>
                      {new Date(request.createdDateTime).toLocaleDateString()}
                    </span>
                    <span className={stale ? queueStyles.ageStale : queueStyles.age}>{formatAge(days)}</span>
                  </td>
                  <td><StatusBadge status={request.status} /></td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        type="button"
                        className={queueStyles.reviewButton}
                        onClick={() => onView(request.id)}
                        disabled={loading}
                        aria-label={`${isPending ? 'Review' : 'View'} link request for ${studentLabel}`}
                      >
                        {isPending ? 'Review' : 'View'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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


const STALE_AFTER_DAYS = 3;

const STATUS_TABS: { label: string; status: LinkRequestStatus | '' }[] = [
  { label: 'Pending', status: 'Pending' },
  { label: 'Approved', status: 'Approved' },
  { label: 'Rejected', status: 'Rejected' },
  { label: 'Cancelled', status: 'Cancelled' },
  { label: 'All', status: '' },
];

const EMPTY_MESSAGES: Record<string, string> = {
  Pending: "No pending requests. You're all caught up.",
  Approved: 'No approved requests yet.',
  Rejected: 'No rejected requests.',
  Cancelled: 'No cancelled requests.',
  '': 'No link requests found.',
};

