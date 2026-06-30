import React, { useState } from 'react';
import { IncidentRecordService } from '../../feature/API/IncidentRecordService';
import { accountService, AccountView } from '../../feature/API/AccountService';
import { IconClose } from '../IconList';

interface CreateIncidentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}


const initialForm = {
  studentId: '',
  incidentType: '',
  description: '',
  dateOccurred: '',
  status: '',
};

const CreateIncidentRecordModal: React.FC<CreateIncidentRecordModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<AccountView[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingStudents(true);
      accountService.getAllStudents()
        .then(setStudents)
        .catch(() => setStudents([]))
        .finally(() => setIsLoadingStudents(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.studentId.trim()) {
      errs.studentId = 'Student ID is required.';
    }
    if (!form.incidentType.trim()) {
      errs.incidentType = 'Incident title is required.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required.';
    } else if (form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }
    if (!form.dateOccurred) {
      errs.dateOccurred = 'Date occurred is required.';
    }
    
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await IncidentRecordService.create({
        studentId: form.studentId.trim(),
        incidentType: form.incidentType.trim(),
        description: form.description.trim(),
        dateOccurred: form.dateOccurred,
        status: "Active",
        handleBy: ''
      });
      handleClear();
      onClose();
      onSuccess();
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Failed to create incident record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create Incident Record</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <IconClose />
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Student ID</span>
              <select
                className="input-field"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                disabled={isSubmitting || isLoadingStudents}
                required
              >
                <option value="">Select a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} ({student.email})
                  </option>
                ))}
              </select>
              {errors.studentId && <div className="error-message">{errors.studentId}</div>}
            </div>
            <div className="detail-row">
              <span className="detail-label">Incident</span>
              <input
                className="input-field"
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {errors.incidentType && <div className="error-message">{errors.incidentType}</div>}
            </div>
           
          </div>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Date Occurred</span>
              <input
                className="input-field"
                name="dateOccurred"
                type="datetime-local"
                value={form.dateOccurred}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {errors.dateOccurred && <div className="error-message">{errors.dateOccurred}</div>}
            </div>
          </div>
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <textarea
              className="input-field detail-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={isSubmitting}
              required
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="detail-row full-width">
            <div className="modal-footer button-row-right">
              <button type="button" className="button button-secondary" onClick={handleClear} disabled={isSubmitting} style={{ marginRight: '12px' }}>
                Clear
              </button>
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentRecordModal; 