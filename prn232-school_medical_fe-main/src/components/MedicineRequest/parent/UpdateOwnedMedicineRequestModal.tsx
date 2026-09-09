import { useState, useEffect } from "react";
import Modal from "../../GenericModal";
import '../../../app/CSS/Nurse/UpdateMedicineRequestModal.css';
import { MedicineRequestDetailsModel, MedicineRequestUpdateModel } from "../../../feature/API/MedicineRequestService";
import { useUserId } from "../../../feature/Hooks/Account/AccountHooks";
import { IconClose } from "../../IconList";

const initialForm = {
  requestBy: '', //Id
  forStudent: '', //Id
  description: ''
}

export interface UpdateOwnedMedicineRequestModalProps {
  isOpen: boolean;
  medicineRequest: MedicineRequestDetailsModel | null;
  onClose: () => void;
  onSubmit: (id: string, payload: MedicineRequestUpdateModel) => void;
  onError: (msg: string) => void;
}

//TODO: Made RequestBy read only, since its automatically fetched
const UpdateOwnedMedicineRequestModal = ({
  isOpen, medicineRequest, onClose, onSubmit, onError
}: UpdateOwnedMedicineRequestModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Update form data
  useEffect(() => {
    if (medicineRequest) {
      setForm({
        requestBy: medicineRequest.requestBy || '',
        forStudent: medicineRequest.forStudent || '',
        description: medicineRequest.description || ''
      });
      setErrors({});
    }
  }, [medicineRequest, isOpen]);

  if (!isOpen || !medicineRequest) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.requestBy.trim()) {
      errs.name = 'Unable to get requesterId (your Id to be sent as medicine requester)';
    }
    if (!form.forStudent.trim()) {
      errs.name = 'Your student Id is requireed';
    }
    if (form.description === null) {
      errs.name = 'Medicine Request Description is required'
    }
    if (form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }

    return errs;
  };

  //Send form data to submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);

    onSubmit(medicineRequest.id, {
      requestBy: form.requestBy,
      forStudent: form.forStudent,
      description: form.description,
    });

    setIsSubmitting(false);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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
            <h2 className="modal-title">Update Medicine Request</h2>
            <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
              <IconClose />
            </button>
          </div>
          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="modal-column">
              <div className="detail-row">
                <label htmlFor="requester-id" className="detail-label">Requester ID &lpar Your Id as a parent &rpar</label>
                <input
                  id="requester-id"
                  className="input-field"
                  value={medicineRequest.requestBy}
                  disabled
                  readOnly
                  style={{ background: '#f3f4f6', color: '#6b7280' }}
                />
                {errors.requesterBy && <div className="error-message">{errors.requesterBy}</div>}
              </div>
              <div className="detail-row">
                <label htmlFor="student-id" className="detail-label">Student Id &lpar Your children Id as the school student &rpar</label>
                <input
                  id="student-id"
                  className="input-field"
                  name="name"
                  value={form.forStudent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={100}
                  readOnly
                  required
                />
                {errors.forStudent && <div className="error-message">{errors.forStudent}</div>}
              </div>
            
            <div className="detail-row full-width">
              <label htmlFor="medicine-description" className="detail-label">Description</label>
              <textarea
                id="medicine-description"
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
  )
};

export default UpdateOwnedMedicineRequestModal;