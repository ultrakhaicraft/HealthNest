import React, { useState } from 'react';
import { MedicineRequestService } from '../../feature/API/MedicineRequestService';
import { accountService, AccountView } from '../../feature/API/AccountService';
import { IconClose } from '../IconList';

interface CreateMedicineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const initialForm = {
  requestBy: '',
  forStudent: '',
  description: '',
};

const CreateMedicineRequestModal: React.FC<CreateMedicineRequestModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<AccountView[]>([]);
  const [parents, setParents] = useState<AccountView[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingData(true);
      Promise.all([
        accountService.getAllStudents(),
        accountService.getAllParents()
      ])
        .then(([studentsData, parentsData]) => {
          setStudents(studentsData);
          setParents(parentsData);
        })
        .catch(() => {
          setStudents([]);
          setParents([]);
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.requestBy.trim()) {
      errs.requestBy = 'Requester is required.';
    }
    if (!form.forStudent.trim()) {
      errs.forStudent = 'Student is required.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required.';
    } else if (form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
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
      await MedicineRequestService.create({
        requestBy: form.requestBy.trim(),
        forStudent: form.forStudent.trim(),
        description: form.description.trim(),
      });
      handleClear();
      onClose();
      onSuccess();
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Failed to create medicine request.');
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
          <h2 className="modal-title">Create Medicine Request</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <IconClose />
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Request By</span>
              <select
                className="input-field"
                name="requestBy"
                value={form.requestBy}
                onChange={handleChange}
                disabled={isSubmitting || isLoadingData}
                required
              >
                <option value="">Select requester...</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.fullName} ({parent.email})
                  </option>
                ))}
              </select>
              {errors.requestBy && <div className="error-message">{errors.requestBy}</div>}
            </div>
            
            <div className="detail-row">
              <span className="detail-label">For Student</span>
              <select
                className="input-field"
                name="forStudent"
                value={form.forStudent}
                onChange={handleChange}
                disabled={isSubmitting || isLoadingData}
                required
              >
                <option value="">Select student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} ({student.email})
                  </option>
                ))}
              </select>
              {errors.forStudent && <div className="error-message">{errors.forStudent}</div>}
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
              placeholder="Describe the medicine request..."
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

export default CreateMedicineRequestModal;