
import { StudentLinkRequestDetailModel } from '../../models/StudentLinkRequestModel';
import Modal from '../GenericModal';
import { StatusBadge } from '../StatusBadge';
import styles from '../../CSS/Parent/StudentLinkRequestDetailModel.module.css';

const formatDateTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : '—');

interface LinkRequestDetailModalProps {
  request: StudentLinkRequestDetailModel;
  onClose: () => void;
  /** Provide these to show review actions (nurse). They only appear while the request is Pending. */
  onApprove?: (request: StudentLinkRequestDetailModel) => void;
  onReject?: (request: StudentLinkRequestDetailModel) => void;
  /** An approve call is in flight: disables everything */
  busy?: boolean;
}

const Field = ({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) => (
  <div className={styles.field}>
    <dt className={styles.label}>{label}</dt>
    <dd className={mono ? `${styles.value} ${styles.mono}` : styles.value}>{children}</dd>
  </div>
);

const LinkRequestDetailModal = ({ request, onClose, onApprove, onReject, busy = false }: LinkRequestDetailModalProps) => {
  const isPending = request.status === 'Pending';
  const canReview = isPending && Boolean(onApprove || onReject);
  const parentLabel = request.parentName ?? 'the parent';
  const studentLabel = request.studentName ?? 'this student';

  return (
    <Modal title="Link request details" onClose={onClose} isBusy={busy}>
      <div className={styles.summary}>
        <StatusBadge status={request.status} />
        <span className={styles.submitted}>Submitted {formatDateTime(request.createdDateTime)}</span>
      </div>

      <div className={styles.columns}>
        <section className={styles.block}>
          <h3 className={styles.blockTitle}>Parent</h3>
          <dl className={styles.list}>
            <Field label="Name">{request.parentName ?? 'Not available'}</Field>
            <Field label="Account ID" mono>{request.parentId}</Field>
          </dl>
        </section>

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>Student</h3>
          <dl className={styles.list}>
            <Field label="Name">{request.studentName ?? 'Not available'}</Field>
            <Field label="Account ID" mono>{request.studentId}</Field>
          </dl>
        </section>
      </div>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Relationship note from the parent</h3>
        <p className={styles.note}>{request.relationshipNote}</p>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Review</h3>
        {isPending ? (
          <p className={styles.muted}>Not reviewed yet.</p>
        ) : (
          <>
            <dl className={styles.list}>
              <Field label="Reviewed by">
                {request.reviewedByName ?? request.reviewedBy ?? '—'}
              </Field>
              <Field label="Reviewed on">{formatDateTime(request.reviewedDateTime)}</Field>
            </dl>
            {request.status === 'Rejected' && (
              <div className={styles.reason}>
                <span className={styles.reasonLabel}>Rejection reason</span>
                {request.rejectionReason || 'No reason was recorded.'}
              </div>
            )}
          </>
        )}
      </section>

      {canReview && (
        <p className={styles.warning}>
          Approving links {studentLabel} to {parentLabel}, who will then see the student's health
          record and medicine requests. Check the note above against school records first.
        </p>
      )}

      <div className={styles.footer}>
        <button type="button" className={styles.closeButton} onClick={onClose} disabled={busy}>
          Close
        </button>
        {canReview && onReject && (
          <button type="button" className={styles.rejectButton} onClick={() => onReject(request)} disabled={busy}>
            Reject
          </button>
        )}
        {canReview && onApprove && (
          <button type="button" className={styles.approveButton} onClick={() => onApprove(request)} disabled={busy}>
            {busy ? 'Approving...' : 'Approve'}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default LinkRequestDetailModal;