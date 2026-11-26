import { useState } from 'react';
import inputStyles from '../../CSS/InputField.module.css';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalForm, ModalField, ModalFooter } from '../GenericModal';
import { UpdateNoteRequest, ViewVaccineEventStudentModel } from '../../models/VaccineEventStudentModel';


interface UpdateSignUpVaccineEventModalProps {
  data: {studentId: string, vaccineEventId: string};
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, studentId: string, payload: UpdateNoteRequest) => void;
}

const initialForm = {

  note: '',

};

const UpdateSignUpVaccineEventModal = ({data, isOpen, onClose, onSubmit }: UpdateSignUpVaccineEventModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parentId = useUserId();


  if (!isOpen) return null;


  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!form.note.trim()) {
      errs.description = 'Note is required.';
    } else if (form.note.length > 500) {
      errs.description = 'Note cannot exceed 500 characters.';
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
      onSubmit(data.vaccineEventId, data.studentId, {
        note: form.note.trim(),
      });

    } finally {
      setIsSubmitting(false);
    }

  };



  return (
    <Modal title="Update Vaccine Event Sign Up" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>




        <ModalField label="Sign Up Note" htmlFor="note" error={errors.description}>
          <textarea
            id="note"
            className={inputStyles.textareaField}
            name="note"
            rows={5}
            value={form.note}
            onChange={handleChange}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Enter a detailed note regarding to your child, situation or how to handle during vaccine event."

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

export default UpdateSignUpVaccineEventModal;