  import React, { useState } from 'react';
import { MedicineCreateModel, MedicineService } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalForm, ModalGrid, ModalField, ModalReadOnly, ModalFooter } from '../GenericModal';
import inputStyles from '../../../CSS/InputField.module.css';


interface CreateMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: MedicineCreateModel) => void;
  onError: (msg: string) => void;
}

const initialForm = {
  name: '',
  description: '',
  amount: '',
  isAvailable: true,
}

const CreateMedicineModal: React.FC<CreateMedicineModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId= useUserId(); // Custom hook to get the current user's ID

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if(userId===null){
      errs.name='Unable to get userId';
    }
    if (!form.name.trim()) {
      errs.name = 'Medicine name is required.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClear = () => {
    setForm({ name: '', description: '', amount: '', isAvailable: true });
    setErrors({});
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
      createdBy: userId || '', // Use the userId from the custom hook
    });

    setIsSubmitting(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal title="Create Medicine" onClose={onClose} isBusy={isSubmitting}>
  <ModalForm onSubmit={handleSubmit}>
    <ModalGrid>
      <ModalField label="Name" htmlFor="MedicineName" error={errors.name}>
        <input
          id="MedicineName"
          className={inputStyles.inputField}
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={isSubmitting}
          maxLength={100}
          placeholder="Enter medicine name"
          required
        />
      </ModalField>

      <ModalField label="Amount" htmlFor="MedicineAmount" error={errors.amount}>
        <input
          id="MedicineAmount"
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
        htmlFor="MedicineDescription"
        error={errors.description}
        fullWidth
      >
        <textarea
          id="MedicineDescription"
          className={inputStyles.inputField}
          name="description"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          disabled={isSubmitting}
          required
          placeholder="Enter medicine description"
          rows={4}
        />
      </ModalField>
    </ModalGrid>

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
};

export default CreateMedicineModal; 