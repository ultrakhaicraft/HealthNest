import React, { useState } from 'react';
import { MedicineCreateModel, MedicineService } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalForm, ModalGrid, ModalField, ModalReadOnly, ModalFooter } from '../GenericModal';
import inputStyles from '../../CSS/InputField.module.css';
import { VaccineEventCreateDTO } from '../../models/VaccineEventModel';
import CreateMedicineModal from '../Medicine/CreateMedicineModal';


interface CreateVaccineEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: VaccineEventCreateDTO) => void;
    onError: (msg: string) => void;
}

const TITLE_MIN = 2;
const TITLE_MAX = 100;
const SHORT_DESCRIPTION_MAX = 500;
const CONTENT_MAX = 2000;


const initialForm = {
    title: '',
    shortDescription: '',
    content: '',
    dateOccurred: '',
    dateSignupStart: '',
    dateSignupEnd: '',

}

const ConvertToIsoOrNull = (value: string): string | null =>
    value ? new Date(value).toISOString() : null;

const CreateVaccineEventModal: React.FC<CreateVaccineEventModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = useUserId(); // Custom hook to get the current user's ID

    if (!isOpen) return null;

    const validate = () => {
        const errs: { [key: string]: string } = {};
        const title = form.title.trim();
        const shortDescription = form.shortDescription.trim();
        const content = form.content.trim();

        if (userId === null) {
            errs.name = 'Unable to get userId';
        }
        if (!title) errs.title = 'Title is required.';
        else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
            errs.title = `Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters.`;
        }

        if (!shortDescription) errs.shortDescription = 'Short description is required.';
        else if (shortDescription.length > SHORT_DESCRIPTION_MAX) {
            errs.shortDescription = `Short description cannot exceed ${SHORT_DESCRIPTION_MAX} characters.`;
        }

        if (!content) errs.content = 'Content is required.';
        else if (content.length > CONTENT_MAX) {
            errs.content = `Content cannot exceed ${CONTENT_MAX} characters.`;
        }

        // ---- Dates ----
        const occurred = form.dateOccurred ? new Date(form.dateOccurred).getTime() : NaN;
        const start = form.dateSignupStart ? new Date(form.dateSignupStart).getTime() : NaN;
        const end = form.dateSignupEnd ? new Date(form.dateSignupEnd).getTime() : NaN;

        if (!form.dateOccurred) errs.dateOccurred = 'Event date is required.';
        else if (occurred <= Date.now()) errs.dateOccurred = 'Event date must be in the future.';

        if (!form.dateSignupStart && !form.dateSignupEnd) {
            errs.dateSignupStart = 'Signup start date is required.';
            errs.dateSignupEnd = 'Signup end date is required.';
        }

        // Signup window is required
        if (form.dateSignupStart && !form.dateSignupEnd) {
            errs.dateSignupEnd = 'Signup end is required when a signup start is set.';
        } else if (!form.dateSignupStart && form.dateSignupEnd) {
            errs.dateSignupStart = 'Signup start is required when a signup end is set.';
        } else if (form.dateSignupStart && form.dateSignupEnd) {
            if (end <= start) {
                errs.dateSignupEnd = 'Signup end must be after signup start.';
            } else if (!Number.isNaN(occurred) && end > occurred) {
                errs.dateSignupEnd = 'Signup must close before the event takes place.';
            }
        }

        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
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
                title: form.title.trim(),
                shortDescription: form.shortDescription.trim(),
                content: form.content.trim(),
                dateOccurred: new Date(form.dateOccurred).toISOString(),
                dateSignupStart: ConvertToIsoOrNull(form.dateSignupStart),
                dateSignupEnd: ConvertToIsoOrNull(form.dateSignupEnd),
            });
        } finally {
            setIsSubmitting(false);

        }

    };



    return (
        <Modal title="Create Vaccine Event" onClose={onClose} isBusy={isSubmitting} size="lg">
      <ModalForm onSubmit={handleSubmit}>
        <ModalField label="Title" htmlFor="vaccine-event-title" error={errors.title}>
          <input
            id="vaccine-event-title"
            className={inputStyles.inputField}
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={TITLE_MAX}
            placeholder="e.g. Annual Flu Vaccine Drive"
            required
          />
        </ModalField>

        <ModalField
          label="Short Description"
          htmlFor="vaccine-event-short-description"
          error={errors.shortDescription}
        >
          <textarea
            id="vaccine-event-short-description"
            className={inputStyles.textareaField}
            name="shortDescription"
            rows={2}
            value={form.shortDescription}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={SHORT_DESCRIPTION_MAX}
            placeholder="One or two sentences shown in the event list"
            required
          />
        </ModalField>

        <ModalField label="Content" htmlFor="vaccine-event-content" error={errors.content}>
          <textarea
            id="vaccine-event-content"
            className={inputStyles.textareaField}
            name="content"
            rows={6}
            value={form.content}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={CONTENT_MAX}
            placeholder="Full details: which vaccine, who should attend, what to bring, consent forms..."
            required
          />
        </ModalField>

        <ModalField label="Event Date" htmlFor="vaccine-event-date" error={errors.dateOccurred}>
          <input
            id="vaccine-event-date"
            className={inputStyles.inputField}
            name="dateOccurred"
            type="datetime-local"
            value={form.dateOccurred}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </ModalField>

        <ModalGrid>
          <ModalField
            label="Signup Start (optional)"
            htmlFor="vaccine-event-signup-start"
            error={errors.dateSignupStart}
          >
            <input
              id="vaccine-event-signup-start"
              className={inputStyles.inputField}
              name="dateSignupStart"
              type="datetime-local"
              value={form.dateSignupStart}
              onChange={handleChange}
              disabled={isSubmitting}
              max={form.dateOccurred || undefined}
            />
          </ModalField>

          <ModalField
            label="Signup End (optional)"
            htmlFor="vaccine-event-signup-end"
            error={errors.dateSignupEnd}
          >
            <input
              id="vaccine-event-signup-end"
              className={inputStyles.inputField}
              name="dateSignupEnd"
              type="datetime-local"
              value={form.dateSignupEnd}
              onChange={handleChange}
              disabled={isSubmitting}
              min={form.dateSignupStart || undefined}
              max={form.dateOccurred || undefined}
            />
          </ModalField>
        </ModalGrid>

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

export default CreateVaccineEventModal; 