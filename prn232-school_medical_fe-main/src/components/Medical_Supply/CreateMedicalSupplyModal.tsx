import { useState } from "react";
import { MedicalSupplyService } from "../../feature/API/MedicalSupplyService";
import { useUserId } from "../../feature/Hooks/AccountHooks";
import { IconClose } from "../IconList";

interface CreateMedicalSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const CreateMedicalSupplyModal = ({ isOpen, onClose, onSuccess, onError }: CreateMedicalSupplyModalProps) => {
    const [form, setForm] = useState({ name: '', description: '', amount: '', isAvailable: true });
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
        setForm({ name: '', description: '', amount: '', isAvailable: true });
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
        try {
          await MedicalSupplyService.create({
            name: form.name.trim(),
            description: form.description.trim(),
            amount: Number(form.amount),
            createdBy: userId ?? '',
          });
          handleClear();
          onClose();
          onSuccess();
        } catch (err: any) {
          onError(err?.response?.data?.message || 'Failed to create medical supply.');
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
              <h2 className="modal-title">Create Medical Supply</h2>
              <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
                <IconClose />
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="modal-column">
                <div className="detail-row">
                  <label htmlFor="MedicalSupplyName" className="detail-label">Name</label>
                  <input
                    id="MedicalSupplyName"
                    className="input-field"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={100}
                    placeholder="Enter medical supply name"
                    required
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                <div className="detail-row">
                  <label htmlFor="MedicalSupplyAmount" className="detail-label">Amount</label>
                  <input
                    id="MedicalSupplyAmount"
                    className="input-field"
                    name="amount"
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter amount in stock"
                    required
                  />
                  {errors.amount && <div className="error-message">{errors.amount}</div>}
                </div>
                <div className="detail-row full-width">
                  <label htmlFor="createdById" className="detail-label">Created By Id</label>
                  <input
                    id="createdById"
                    className="input-field"
                    name="createdById"
                    type="text"
                    value={userId ?? ''}
                    readOnly
                    required
                  />
                </div>
                <div className="detail-row full-width">
                <label htmlFor="MedicalSupplyDescription" className="detail-label">Description</label>
                <textarea
                  id="MedicalSupplyDescription"
                  className="input-field detail-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  disabled={isSubmitting}
                  required
                  placeholder="Enter medical supply description"
                />
                {errors.description && <div className="error-message">{errors.description}</div>}
              </div>
    
              <div className="detail-row full-width">
                <div className="modal-footer button-row-right">
                  <button type="button" className="button button-secondary" onClick={handleClear} disabled={isSubmitting} style={{ marginRight: '12px' }}>
                    Clear
                  </button>
                  <button type="submit" className="button button-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
              </div>
            </form>
          </div>
        </div>
      );
}