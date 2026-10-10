import React, { useState } from 'react';
import { IncidentRecordCreate } from '../../feature/API/IncidentRecordService';
import { IconClose } from '../IconList';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalForm, ModalField, ModalFooter } from '../GenericModal';
import inputStyles from '../../CSS/InputField.module.css';

interface CreateIncidentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: IncidentRecordCreate) => void;
  onError: (msg: string) => void;
}


const initialForm = {
  studentId: '',
  incidentType: '',
  description: '',
  dateOccurred: '',
  status: '',
};

const CreateIncidentRecordModal: React.FC<CreateIncidentRecordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useUserId(); // Custom hook to get the current user's ID

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
      onSubmit({
        studentId: form.studentId.trim(),
        incidentType: form.incidentType.trim(),
        description: form.description.trim(),
        dateOccurred: form.dateOccurred,
        status: "Active",
        handleBy: userId || '', //Temporarily make the creator will be the handler of the incident record
      });

    } finally {
      setIsSubmitting(false);
    }
    
  };

 

  return (
     <Modal title="Create Incident Record" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
        <ModalField label="Student ID" htmlFor="student-id" error={errors.studentId}>
          <input
            id="student-id"
            className={inputStyles.inputField}
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter Student ID"
            required
          />
        </ModalField>

        <ModalField label="Incident" htmlFor="incident-type" error={errors.incidentType}>
          <input
            id="incident-type"
            className={inputStyles.inputField}
            name="incidentType"
            value={form.incidentType}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter injury or incident type"
            required
          />
        </ModalField>

        <ModalField label="Date Occurred" htmlFor="date-occurred" error={errors.dateOccurred}>
          <input
            id="date-occurred"
            className={inputStyles.inputField}
            name="dateOccurred"
            type="datetime-local"
            value={form.dateOccurred}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </ModalField>

        <ModalField label="Description" htmlFor="incident-description" error={errors.description}>
          <textarea
            id="incident-description"
            className={inputStyles.textareaField}
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Enter a detailed description of the incident (what happened, how it happened, and any other relevant details)."
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

export default CreateIncidentRecordModal; 