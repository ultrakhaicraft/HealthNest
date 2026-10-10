import { useState } from "react";
import { MedicalSupplyCreateModel, MedicalSupplyService } from "../../feature/API/MedicalSupplyService";
import { useUserId } from "../../feature/Hooks/Account/AccountHooks";
import { IconClose } from "../IconList";
import inputStyles from '../../CSS/InputField.module.css'
import Modal, { ModalForm, ModalGrid, ModalField, ModalReadOnly, ModalFooter } from "../GenericModal";


interface CreateMedicalSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: MedicalSupplyCreateModel) => void;
  onError: (msg: string) => void;
}

const initialForm = {
  name: '',
  description: '',
  amount: '',
  isAvailable: true,
};

export const CreateMedicalSupplyModal = ({ isOpen, onClose, onSubmit, onError }: CreateMedicalSupplyModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useUserId(); // Custom hook to get the current user's ID

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (userId === null) {
      errs.name = 'Unable to get userId';
    }
    if (!form.name.trim()) {
      errs.name = 'Medical supply item name is required.';
    } else if (form.name.length < 2 || form.name.length > 100) {
      errs.name = 'Name must be between 2 and 100 characters.';
    }
    if (form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errs.amount = 'Amount must be a positive number.';
    }
    return errs;
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      createdBy: userId ?? '',
    });

    setIsSubmitting(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal title="Create Medical Supply" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
          <ModalField label="Name" htmlFor="MedicalSupplyName" error={errors.name}>
            <input
              id="MedicalSupplyName"
              className={inputStyles.inputField}
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={100}
              placeholder="Enter medical supply name"
              required
            />
          </ModalField>

          <ModalField label="Amount" htmlFor="MedicalSupplyAmount" error={errors.amount}>
            <input
              id="MedicalSupplyAmount"
              className={inputStyles.inputField}
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter amount in stock"
              required
            />
          </ModalField>

          <ModalReadOnly label="Created By Id" fullWidth>
            {userId ?? ''}
          </ModalReadOnly>

          <ModalField
            label="Description"
            htmlFor="MedicalSupplyDescription"
            error={errors.description}
            fullWidth
          >
            <textarea
              id="MedicalSupplyDescription"
              className={`${inputStyles.inputField} ${inputStyles.detailDescription}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={isSubmitting}
              required
              placeholder="Enter medical supply description"
              rows={4}
            />
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