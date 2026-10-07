import React, { useState } from 'react';
import { MedicineRequestCreateModel } from '../../../feature/API/MedicineRequestService';
import { useUserId } from '../../../feature/Hooks/Account/AccountHooks';
import { AccountView } from '../../../models/AccountModel';
import inputStyles from '../../../CSS/InputField.module.css';
import Modal, { ModalForm, ModalField, ModalFooter } from '../../GenericModal';

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
    try {
      await onSubmit({
        forStudent: form.forStudent.trim(),
        description: form.description.trim(),
        requestBy: requesterId,
      });
    } finally {
      setIsSubmitting(false); // now runs after the request, not before
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal title="Create Medicine Request" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
        <ModalField label="Requester ID (Your Id as a parent)" htmlFor="requester-id" error={errors.requestBy}>
          <input id="requester-id" className={inputStyles.inputField} value={requesterId} readOnly />
        </ModalField>

        <ModalField label="Student Id (Your children Id as the school student)" htmlFor="student-id" error={errors.forStudent}>
          <input
            id="student-id"
            className={inputStyles.inputField}
            name="forStudent"
            value={form.forStudent}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter Student ID"
            required
          />
        </ModalField>

        <ModalField label="Description" htmlFor="medicine-request-description" error={errors.description}>
          <textarea
            id="medicine-request-description"
            className={inputStyles.textareaField}
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Describe the medicine request..."
            required
          />
        </ModalField>

        <ModalFooter>
          <button type="button" className="button button-secondary" onClick={handleClear} disabled={isSubmitting}>
            Clear
          </button>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
};

export default CreateMedicineRequestModal;