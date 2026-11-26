import { useState } from "react";
import { CompleteVaccinationRequest, CreateVaccineEventStudentModel } from "../../models/VaccineEventStudentModel";
import Modal, { ModalForm, ModalField, ModalFooter } from "../GenericModal";
import inputStyles from '../../CSS/InputField.module.css';
import { StatusBadge } from "../StatusBadge";


interface CompleteVaccineEventStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CompleteVaccinationRequest) => void;
    onError: (msg: string) => void;
}

const initialForm = {
    resultSummary: ''
};

export const CompleteVaccineEventStudentModal = ({ isOpen, onClose, onSubmit, onError }: CompleteVaccineEventStudentModalProps) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const validate = () => {
        const errs: { [key: string]: string } = {};

        if (!form.resultSummary.trim()) {

            errs.resultSummary = 'Result Summary is required.';

            if (form.resultSummary.length > 500) {
                errs.resultSummary = 'Result Summary  cannot exceed 500 characters.';
            }


        };

        return errs;

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClear = () => {
        setForm({ resultSummary: '' });
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
                resultSummary: form.resultSummary.trim(),
            });
        } finally {
            setIsSubmitting(false);

        }

    };

    return (
        <Modal title="Complete Participant Vaccine Event" onClose={onClose} isBusy={isSubmitting}>
            <ModalForm onSubmit={handleSubmit}>
                <p>Before submit, please provide the result summary of this participant based on this vaccine event</p>

                <ModalField label="Result Summary" htmlFor="resultSummary" error={errors.name}>
                    <input
                        id="resultSummary"
                        className={inputStyles.inputField}
                        name="resultSummary"
                        value={form.resultSummary}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={100}
                        placeholder="Enter result summary of this participant"
                        required
                    />
                </ModalField>

                <p><strong>Status change from:</strong>
                    <StatusBadge status='Pending'></StatusBadge> to <StatusBadge status='Completed'></StatusBadge>
                </p>

                <p>Upon submit, this action cannot be undone. Please click submit if you want to update attendant status</p>

                <ModalFooter>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleClear}
                        disabled={isSubmitting}
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </ModalFooter>
            </ModalForm>
        </Modal>
    );

}