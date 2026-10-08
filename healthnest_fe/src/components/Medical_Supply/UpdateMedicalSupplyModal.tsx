import React, { useState, useEffect } from 'react';
import { MedicineService } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import { MedicalSupplyDetailsViewModel, MedicalSupplyService, MedicalSupplyUpdateModel } from '../../feature/API/MedicalSupplyService';
import inputStyles from '../../CSS/InputField.module.css'
import Modal, { ModalForm, ModalGrid, ModalReadOnly, ModalField, ModalFooter } from '../GenericModal';

interface UpdateMedicalSupplyModalProps {
  isOpen: boolean;
  medicalSupply: MedicalSupplyDetailsViewModel | null;
  onClose: () => void;
  onSubmit: (id: string, payload: MedicalSupplyUpdateModel) => void;
  onError: (msg: string) => void;
}

const initialForm = {
  name: '',
  description: '',
  amount: '',
  isAvailable: true,
}

const UpdateMedicalSupplyModal: React.FC<UpdateMedicalSupplyModalProps> = ({ isOpen, medicalSupply, onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useUserId(); // Custom hook to get the current user's ID

  useEffect(() => {
    if (medicalSupply) {
      setForm({
        name: medicalSupply.name || '',
        description: medicalSupply.description || '',
        amount: medicalSupply.amount?.toString() || '',
        isAvailable: medicalSupply.isAvailable,
      });
      setErrors({});
    }
  }, [medicalSupply, isOpen]);

  if (!isOpen || !medicalSupply) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (userId === null) {
      errs.name = 'Unable to get userId';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);

    try {
      onSubmit(medicalSupply.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        isAvailable: form.isAvailable,
        createdBy: userId || '', // Use the userId from the custom hook
      });
    } finally {
      setIsSubmitting(false);

    }

  };



  return (
    <Modal title="Update Medical Supply" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
        <ModalGrid>
          <ModalReadOnly label="ID">
            {medicalSupply.id}
          </ModalReadOnly>
          <ModalField label="Name" htmlFor="medical-supply-name" error={errors.name}>
            <input
              id="medical-supply-name"
              className={inputStyles.inputField}
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={100}
              required
            />
          </ModalField>

          <ModalField label="Amount" htmlFor="medical-supply-amount" error={errors.amount}>
            <input
              id="medical-supply-amount"
              className={inputStyles.inputField}
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </ModalField>

          <ModalField label="Availability" htmlFor="availability-select">
            <select
              id="availability-select"
              className={inputStyles.inputField}
              name="isAvailable"
              value={form.isAvailable ? 'true' : 'false'}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isAvailable: e.target.value === 'true' }))
              }
              disabled={isSubmitting}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </ModalField>


          <ModalField
            label="Description"
            htmlFor="medical-supply-description"
            error={errors.description}
            fullWidth
          >
            <textarea
              id="medical-supply-description"
              className={`${inputStyles.inputField} ${inputStyles.detailDescription}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={isSubmitting}
              rows={4}
            />
          </ModalField>

        </ModalGrid>
        <ModalFooter>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </ModalFooter>

      </ModalForm>
    </Modal>

  );
};

export default UpdateMedicalSupplyModal; 