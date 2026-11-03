import { useMemo } from "react";
import { StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import { StatusBadge } from "../../StatusBadge";
import styles from '../../../CSS/Parent/LinkRequestParentView.module.css';


interface LinkRequestSectionViewProps {
    requests: StudentLinkRequestViewModel[];          // newest first, as the backend returns them
    loading?: boolean;
    error?: string | null;
    /** Request whose cancel call is in flight (disables that row's button) */
    cancelingId?: string | null;
    /** Backend cap on pending requests. Shows the counter and disables "Request again" at the cap. */
    maxPending?: number;
    onCancel: (request: StudentLinkRequestViewModel) => void;
    onRequestAgain: (request: StudentLinkRequestViewModel) => void;
    onRequestLink: () => void;
}

const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString() : '');
const studentLabel = (r: StudentLinkRequestViewModel) => r.studentId ?? 'Student';


const LinkRequestSectionView = ({
    requests,
    loading = false,
    error = null,
    cancelingId = null,
    maxPending,
    onCancel,
    onRequestAgain,
    onRequestLink,
}: LinkRequestSectionViewProps) => {

    const { pending, rejected, history } = useMemo(
        () => ({
            pending: requests.filter(r => r.status === 'Pending'),
            rejected: requests.filter(r => r.status === 'Rejected'),
            history: requests.filter(r => r.status === 'Approved'),

        }),
        [requests]
    );

    const atCap = maxPending !== undefined && pending.length >= maxPending;


    const renderBody = () => {
        if (error) return <p className={styles.error}>{error}</p>

        if (loading && requests.length === 0) {
            return <p className={styles.message}>Loading your requests...</p>
        }

        if (requests.length === 0) {
            return (
                <div className={styles.empty}>
                    <p>You haven't send any link requests yet.</p>
                    {onRequestLink && (
                        <button type="button" className={styles.primaryButton} onClick={onRequestLink}>
                            Request to link a student
                        </button>
                    )}
                </div>
            );
        }

        return (
            <>
                {pending.length === 0 && rejected.length === 0 && (
                    <p className={styles.message}>No open requests</p>
                )}

                {pending.length > 0 && (
                    <div className={styles.group}>
                        <h3 className={styles.groupTitle}>Waiting for approval ({pending.length})</h3>
                        <ul>
                            {pending.map(request => {
                                const CanCancel = cancelingId === request.id
                                return (
                                    <li key={request.id} className={`${styles.row} ${styles.rowPending}`}>
                                        <div className={styles.rowMain}>
                                            <div className={styles.rowHeading}>
                                                <span className={styles.studentName}>{studentLabel(request)}</span>
                                                <StatusBadge status={request.status} />
                                            </div>
                                            <p className={styles.meta}>
                                                Submitted {formatDate(request.createdDateTime)}  Waiting for school nurse approval
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.cancelButton}
                                            onClick={() => onCancel(request)}
                                            disabled={CanCancel}
                                            aria-label={`Cancel link request for ${studentLabel(request)}`}
                                        >
                                            {CanCancel ? 'Cancelling...' : 'Cancel request'}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}

                {rejected.length > 0 && (
                    <div className={styles.group}>
                        <h3 className={styles.groupTitle}>Rejected ({rejected.length})</h3>
                        <ul className={styles.list}>{rejected.map(request => (
                            <li key={request.id} className={`${styles.row} ${styles.rowRejected}`}>
                                <div className={styles.rowMain}>
                                    <div className={styles.rowHeading}>
                                        <span className={styles.studentName}>{studentLabel(request)}</span>
                                        <StatusBadge status={request.status} />
                                    </div>
                                    <p className={styles.meta}>
                                        Reviewed {formatDate(request.reviewedDateTime ?? request.createdDateTime)}
                                    </p>

                                </div>
                                <div className={styles.reason}>
                                    <span className={styles.reasonLabel}>Reason from the school</span>
                                    {request.rejectionReason || 'No reason was provided.'}
                                </div>
                                <button
                                    type="button"
                                    className={styles.retryButton}
                                    onClick={() => onRequestAgain(request)}
                                    disabled={atCap}
                                    title={atCap ? 'You have reached the pending request limit' : undefined}
                                >
                                    Request again
                                </button>
                            </li>
                        ))}</ul>
                    </div>
                )}

                {history.length > 0 && (
                    <details className={styles.history}>
                        <summary>History ({history.length})</summary>
                        <ul className={styles.list}>
                            {history.map(request => (
                                <li key={request.id} className={styles.row}>
                                    <div className={styles.rowMain}>
                                        <div className={styles.rowHeading}>
                                            <span className={styles.studentName}>{studentLabel(request)}</span>
                                            <StatusBadge status={request.status} />
                                        </div>
                                        <p className={styles.meta}>
                                            {formatDate(request.reviewedDateTime ?? request.createdDateTime)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </details>
                )}
            </>
        )
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Link Requests
                    {maxPending !== undefined && (
                        <span className={styles.counter}>
                            {pending.length} of {maxPending} pending
                        </span>
                    )}
                </h2>
                <p className={styles.subtitle}>
                    A school nurse reviews every request. Your child's health information becomes
                    visible only after approval.
                </p>
            </div>
            {renderBody()}
        </section>
    );
}


export default LinkRequestSectionView;