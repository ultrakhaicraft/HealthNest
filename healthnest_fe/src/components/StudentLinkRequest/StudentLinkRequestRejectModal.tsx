import { useState } from 'react';
import { StudentLinkRequestDetailModel } from '../../models/StudentLinkRequestModel';
// import Modal, ModalForm, ModalField, ModalReadOnly, ModalFooter exactly as your other modals do
import inputStyles from '../../CSS/InputField.module.css';
import Modal, { ModalForm, ModalReadOnly, ModalField, ModalFooter } from '../GenericModal';

const REASON_MAX_LENGTH = 500;

interface RejectLinkRequestModalProps {
  request: Pick<StudentLinkRequestDetailModel, 'id' | 'studentName' | 'parentName'>;
  /** A review call is in flight (owned by the page, shared with approve) */
  busy?: boolean;
  onClose: () => void;
  /** Receives the trimmed reason. The page's handleReject makes the API call. */
  onConfirm: (reason: string) => void;
}

export const LinkRequestRejectModal = ({ request, busy = false, onClose, onConfirm }: RejectLinkRequestModalProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();
  const isBusy = Boolean(busy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Please give the parent a reason.');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Modal title="Reject link request" onClose={onClose} isBusy={isBusy}>
      <ModalForm onSubmit={handleSubmit}>
        <ModalReadOnly label="Request" fullWidth>
          {request.parentName ?? 'The parent'} wants to link {request.studentName ?? 'this student'}
        </ModalReadOnly>

        <ModalField label="Reason for the parent" htmlFor="rejectionReason" error={error} fullWidth>
          <textarea
            id="rejectionReason"
            className={inputStyles.inputField}
            value={reason}
            onChange={e => {
              setReason(e.target.value);
              if (error) setError(undefined);
            }}
            maxLength={REASON_MAX_LENGTH}
            rows={5}
            disabled={isBusy}
            autoFocus
            placeholder="For example: We could not match the relationship you described with school records."
          />
          <span style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.8rem', color: '#6b7280' }}>
            The parent will see this reason, so keep it factual and don't mention other families.
            They can send a new request afterwards.
          </span>
          <span style={{ display: 'block', textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af' }}>
            {reason.length}/{REASON_MAX_LENGTH}
          </span>
        </ModalField>

        <ModalFooter>
          <button type="button" className="button button-secondary" onClick={onClose} disabled={isBusy}>
            Cancel
          </button>
          <button type="submit" className="button button-danger" disabled={isBusy}>
            {isBusy ? 'Rejecting...' : 'Reject request'}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
};

export default LinkRequestRejectModal;