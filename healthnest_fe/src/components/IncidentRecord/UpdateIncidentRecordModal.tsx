import React, { useState, useEffect } from 'react';
import { IncidentRecordUpdate, IncidentRecordViewDetail } from '../../feature/API/IncidentRecordService';
import { IconClose } from '../IconList';
import inputStyles from '../../CSS/InputField.module.css';
import Modal, { ModalForm, ModalReadOnly, ModalField, ModalFooter } from '../GenericModal';

interface UpdateIncidentRecordModalProps {
  isOpen: boolean;
  incidentRecord: IncidentRecordViewDetail | null;
  onClose: () => void;
  onSubmit: (id: string, payload: IncidentRecordUpdate) => void;
  onError: (msg: string) => void;
}
const statuses: string[] = ["Active", "Inactive", "Resolved", "Hospitalized"];

const initialForm = {
  studentId: '',
  handleBy: '',
  handleByName: '',
  incidentType: '',
  description: '',
  dateOccurred: '',
  status: '',
}

const UpdateIncidentRecordModal: React.FC<UpdateIncidentRecordModalProps> = ({ isOpen, incidentRecord, onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (incidentRecord) {
      setForm({
        studentId: incidentRecord.studentId || '',
        handleBy: incidentRecord.handleBy || '',
        handleByName: incidentRecord.handleByName || '',
        incidentType: incidentRecord.incidentType || '',
        description: incidentRecord.description || '',
        dateOccurred: incidentRecord.dateOccurred ? incidentRecord.dateOccurred.slice(0, 16) : '',
        status: incidentRecord.status || '',
      });
      setErrors({});
    }
  }, [incidentRecord, isOpen]);


  if (!isOpen || !incidentRecord) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.studentId.trim()) {
      errs.studentId = 'Student ID is required.';
    }
    if (!form.handleBy.trim()) {
      errs.handleBy = 'Handle By is required.';
    }
    if (!form.incidentType.trim()) {
      errs.incidentType = 'Incident type is required.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required.';
    } else if (form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }
    if (!form.dateOccurred) {
      errs.dateOccurred = 'Date occurred is required.';
    }
    if (!form.status.trim()) {
      errs.status = 'Status is required.';
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
      onSubmit(incidentRecord.id, {
        studentId: form.studentId,
        incidentType: form.incidentType,
        description: form.description,
        dateOccurred: form.dateOccurred,
        status: form.status,
        handleBy: form.handleBy,
      });
    } finally {
      setIsSubmitting(false);
    }

  };



  return (
    <Modal title="Create Incident Record" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>

        <ModalReadOnly label="ID">
          {incidentRecord.id}
        </ModalReadOnly>


        <ModalField label="Nurse Id" htmlFor="handleBy" error={errors.handleBy}>
          <input
            id="handleBy"
            className={inputStyles.inputField}
            name="handleBy"
            value={form.handleBy}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter Nurse Id"
            required
          />
        </ModalField>

        <ModalField label="Incident Type" htmlFor="incidentType" error={errors.incidentType}>
          <input
            id="incidentType"
            className={inputStyles.inputField}
            name="incidentType"
            value={form.incidentType}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter injury or incident type"
            required
          />
        </ModalField>

        <ModalField label="Incident Status" htmlFor="status" error={errors.status}>
          <select
            id="status"
            className={inputStyles.inputField}
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            <option value="">Select a status...</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </ModalField>


        <ModalField label="Date Occurred" htmlFor="dateOccurred" error={errors.dateOccurred}>
          <input
            id="dateOccurred"
            className={inputStyles.inputField}
            name="dateOccurred"
            type="datetime-local"
            value={form.dateOccurred}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </ModalField>


        <ModalField label="Description" htmlFor="description" error={errors.description}>
          <label htmlFor="description" className="detail-label">Description</label>
          <textarea
            id="description"
              className={`${inputStyles.inputField} ${inputStyles.detailDescription}`}
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Enter a detailed description of the incident (What happened, how it happened, and any other relevant details)."
            required
          />
        </ModalField>


          <ModalFooter>
            <button type="submit" className="button button-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </ModalFooter>
        
      </ModalForm>
    </Modal>
  );
};

export default UpdateIncidentRecordModal; 