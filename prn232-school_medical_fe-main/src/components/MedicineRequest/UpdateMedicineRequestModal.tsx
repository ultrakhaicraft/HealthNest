import React, { useState, useEffect } from 'react';
import { MedicineRequestService, MedicineRequestResponseDto } from '../../feature/API/MedicineRequestService';
import { accountService, AccountView } from '../../feature/API/AccountService';
import { IconClose } from '../IconList';

interface UpdateMedicineRequestModalProps {
  isOpen: boolean;
  medicineRequest: MedicineRequestResponseDto | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const statuses: string[] = ["Pending", "Approved", "Rejected", "Deleted"];

const UpdateMedicineRequestModal: React.FC<UpdateMedicineRequestModalProps> = ({ isOpen, medicineRequest, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState({
    requestBy: '',
    forStudent: '',
    description: '',
    status: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<AccountView[]>([]);
  const [parents, setParents] = useState<AccountView[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (medicineRequest) {
      setForm({
        requestBy: medicineRequest.requestBy || '',
        forStudent: medicineRequest.forStudent || '',
        description: medicineRequest.description || '',
        status: medicineRequest.status || '',
      });
      setErrors({});
    }
  }, [medicineRequest, isOpen]);

  useEffect(() => {
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

  if (!isOpen || !medicineRequest) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await MedicineRequestService.update(medicineRequest.id, {
        requestBy: form.requestBy.trim(),
        forStudent: form.forStudent.trim(),
        description: form.description.trim(),
        status: form.status.trim(),
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Failed to update medicine request.');
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
          <h2 className="modal-title">Update Medicine Request</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <IconClose />
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <input
                className="input-field"
                value={medicineRequest.id}
                disabled
                style={{ background: '#f3f4f6', color: '#6b7280' }}
              />
            </div>
            
            
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
                    {parent.id} - {parent.fullName}
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
                    {student.id} - {student.fullName}
                  </option>
                ))}
              </select>
              {errors.forStudent && <div className="error-message">{errors.forStudent}</div>}
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Date Sent</span>
              <input
                className="input-field"
                value={new Date(medicineRequest.dateSent).toLocaleString()}
                disabled
                style={{ background: '#f3f4f6', color: '#6b7280' }}
              />
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <select
                className="input-field"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                <option value="">Select status...</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <div className="error-message">{errors.status}</div>}
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
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedicineRequestModal;