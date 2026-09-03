import React, { useState, useEffect } from 'react';
import { MedicineService } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';
import { useUserId } from '../../feature/Hooks/AccountHooks';

interface UpdateMedicineModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const UpdateMedicineModal: React.FC<UpdateMedicineModalProps> = ({ isOpen, medicine, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState({ name: '', description: '', amount: '', isAvailable: true });
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
    try {
      await MedicineService.update(medicine.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        isAvailable: form.isAvailable,
        createdBy: userId ?? '',
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Failed to update medicine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Update Medicine</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <IconClose />
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <input
                className="input-field"
                value={medicine.id}
                disabled
                style={{ background: '#f3f4f6', color: '#6b7280' }}
              />
            </div>
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <input
                className="input-field"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isSubmitting}
                maxLength={100}
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <input
                className="input-field"
                name="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {errors.amount && <div className="error-message">{errors.amount}</div>}
            </div>
          
         
            <div className="detail-row">
              <label htmlFor="availability-select" className="detail-label full-width">Availability</label>
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
            </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <textarea
              className="input-field detail-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={isSubmitting}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="detail-row full-width">
            <div className="modal-footer button-row-right">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedicineModal; 