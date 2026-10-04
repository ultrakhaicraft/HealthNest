import React, { useState } from 'react';
import { MedicineRequestCreateModel, MedicineRequestService } from '../../../feature/API/MedicineRequestService';
import { accountService, AccountView } from '../../../feature/API/AccountService';
import { IconClose } from '../../IconList';
import { useUserId } from '../../../feature/Hooks/Account/AccountHooks';

interface CreateMedicineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: MedicineRequestCreateModel) => void;
  onError: (msg: string) => void;
}

const initialForm = {
  forStudent: '',
  description: '',
};

//Exclusively for Parent
//Todo: Add a way to select their children via select tag
const CreateMedicineRequestModal: React.FC<CreateMedicineRequestModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<AccountView[]>([]); //Keep this useState
  const [isLoadingData, setIsLoadingData] = useState(false); //Keep this useState
  const requesterId = useUserId() ?? '';


  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (requesterId == null || !requesterId) {
      errs.requestBy = 'Unable to get requesterId';
    }
    if (!form.forStudent.trim()) {
      errs.forStudent = 'Student Id is required.';
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

    onSubmit({
      forStudent: form.forStudent.trim(),
      description: form.description.trim(),
      requestBy: requesterId || '', //Temporarily make the creator will be the handler of the incident record
    });

    setIsSubmitting(false);
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
              <label htmlFor='requestBy-Id' className="detail-label">{'Requester ID (Your Id as a parent)'}</label>
              <input
                id="requestBy-Id"
                className="input-field"
                name="requesterId"
                value={requesterId}
                onChange={handleChange}
                disabled={isSubmitting}
                readOnly
                required
              />
              {errors.requestBy && <div className="error-message">{errors.requestBy}</div>}
            </div>

            <div className="detail-row">
              <label htmlFor='studentId' className="detail-label">{'Student Id (Your children Id as the school student)'}</label>
              <input
                id="studentId"
                className="input-field"
                name="forStudent"
                value={form.forStudent}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Enter Student ID"
                required
              />
              {errors.forStudent && <div className="error-message">{errors.forStudent}</div>}
            </div>


            <div className="detail-row full-width">
              <label htmlFor='medicineRequestDescription' className="detail-label">Description</label>
              <textarea
                id="medicineRequestDescription"
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
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default CreateMedicineRequestModal;