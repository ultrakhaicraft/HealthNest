import React, { useState, useEffect } from 'react';
import { MedicineDetailsViewModel, MedicineService, MedicineUpdateModel } from '../../feature/API/MedicineService';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalField, ModalFooter, ModalForm, ModalGrid } from '../GenericModal';
import inputStyles from '../../../CSS/InputField.module.css';


interface UpdateMedicineModalProps {
  isOpen: boolean;
  medicine: MedicineDetailsViewModel | null;
  onClose: () => void;
  onSubmit: (id: string, payload: MedicineUpdateModel) => void;
  onError: (msg: string) => void;
}

const initialForm = {
  name: '',
  description: '',
  amount: '',
  isAvailable: true,
};

const UpdateMedicineModal: React.FC<UpdateMedicineModalProps> = ({ isOpen, medicine, onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId= useUserId(); // Custom hook to get the current user's ID
  
  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || '',
        description: medicine.description || '',
        amount: medicine.amount?.toString() || '',
        isAvailable: medicine.isAvailable,
      });
      setErrors({});
    }
  }, [medicine, isOpen]);

  if (!isOpen || !medicine) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    
    onSubmit(medicine.id, {
      name: form.name,
      description: form.description,
      amount: Number(form.amount),
      isAvailable: form.isAvailable,
      createdBy: userId || '', // Use the userId from the custom hook
    });
    
    setIsSubmitting(false);
  };

  

  return (
      <Modal title="Update Medicine" onClose={onClose} isBusy={isSubmitting}>
        <ModalForm onSubmit={handleSubmit}>
           <ModalGrid>
              <ModalField label="Medicine Id" htmlFor="medicine-id" error={errors.id}>
                <input
                  id="medicine-id"
                  className="input-field"
                  value={medicine.id}
                  disabled
                  style={{ background: '#f3f4f6', color: '#6b7280' }}
                />
              </ModalField>
             
              <ModalField label="Medicine Name" htmlFor="medicine-name" error={errors.name}>
                <input
                  id="medicine-name"
                  className="input-field"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={100}
                  required
                />
              </ModalField>

              <ModalField label="Medicine Amount" htmlFor="medicine-amount" error={errors.amount}>
               <input
                  id="medicine-amount"
                  className="input-field"
                  name="amount"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </ModalField>

              <ModalField label="Status" htmlFor="availability-select" error={errors.isAvailable}>
                 <select
                  id="availability-select"
                  className="input-field"
                  name="isAvailable"
                  value={form.isAvailable ? 'true' : 'false'}
                  onChange={e => setForm(prev => ({ ...prev, isAvailable: e.target.value === 'true' }))}
                  disabled={isSubmitting}
                >
                  <option value="true" >Available</option>
                  <option value="false" >Unavailable</option>
                </select>
              </ModalField>
              
          

              <ModalField label="Medicine Description" htmlFor="medicine-description" error={errors.description}>
                <textarea
                id="medicine-description"
                className="input-field detail-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                disabled={isSubmitting}
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

export default UpdateMedicineModal; 