import { VaccineRecordCreateModel, VaccineRecordUpdateModal, VaccineRecordViewModel } from "../../models/VaccineRecordModel";
import inputStyles from '../../CSS/InputField.module.css'
import { useEffect, useState } from "react";
import Modal, { ModalForm, ModalField, ModalFooter } from "../GenericModal";
import { RecordStatuses } from "../../feature/Constant";

interface UpdateVaccineRecordModalProps {
    isOpen: boolean;
    vaccineRecord: VaccineRecordViewModel | null;
    onClose: () => void;
    onSubmit: (id: string, payload: VaccineRecordUpdateModal) => void;
}

const initialForm = {
    vaccineTitle: '',
    description: '',
    status: '',
};

export const UpdateVaccineRecordModal = ({ isOpen, onClose, onSubmit, vaccineRecord }: UpdateVaccineRecordModalProps) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !vaccineRecord) return null;

    useEffect(() => {
        if (vaccineRecord) {
            setForm({
                vaccineTitle: vaccineRecord.vaccineTitle || '',
                description: vaccineRecord.description || '',
                status: vaccineRecord.status || '',
            });
            setErrors({});
        }
    }, [vaccineRecord, isOpen]);

    const validate = () => {
        const errs: { [key: string]: string } = {};

        if (!form.vaccineTitle.trim()) {
            errs.vaccineTitle = 'Vaccine Title is required.';
        } else if (form.vaccineTitle.length < 2 || form.vaccineTitle.length > 100) {
            errs.vaccineTitle = 'Vaccine Title must be between 2 and 100 characters.';
        }

        if (!form.description.trim()) {
            errs.description = 'Record description is required.';
        } else if (form.description.length < 2 || form.description.length > 400) {
            errs.description = 'Description must be between 2 and 400 characters.';
        }

        return errs;
    };

    const handleClear = () => {
        setForm(initialForm);
        setErrors({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setIsSubmitting(true);

        onSubmit(vaccineRecord.id, {
            vaccineTitle: form.vaccineTitle.trim(),
            description: form.description.trim(),
            status: form.status.trim()
        });

        setIsSubmitting(false);
    };


    return (
        <Modal title="Update Vaccine Record" onClose={onClose} isBusy={isSubmitting}>
            <ModalForm onSubmit={handleSubmit}>
                <ModalField label="Vaccine Title" htmlFor="VaccineRecordTitle" error={errors.vaccineTitle}>
                    <input
                        id="VaccineRecordTitle"
                        className={inputStyles.inputField}
                        name="vaccineTitle"
                        value={form.vaccineTitle}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={100}
                        placeholder="Enter vaccine record title"
                        required
                    />
                </ModalField>


                <ModalField
                    label=" Record Description"
                    htmlFor="VaccineRecordDescription"
                    error={errors.description}
                    fullWidth
                >
                    <textarea
                        id="VaccineRecordDescription"
                        className={`${inputStyles.inputField} ${inputStyles.detailDescription}`}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        maxLength={500}
                        disabled={isSubmitting}
                        required
                        placeholder="Enter record description"
                        rows={4}
                    />
                </ModalField>

                <ModalField label="Status" htmlFor="status-select" error={errors.status}>
                    <select
                        id="status-select"
                        className={inputStyles.inputField}
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                    >
                        <option value="">Select status...</option>
                        {RecordStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </ModalField>

                <ModalFooter>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleClear}
                        disabled={isSubmitting}
                    >
                        Clear
                    </button>
                    <button type="submit" className="button button-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </ModalFooter>
            </ModalForm>
        </Modal>
    );
}