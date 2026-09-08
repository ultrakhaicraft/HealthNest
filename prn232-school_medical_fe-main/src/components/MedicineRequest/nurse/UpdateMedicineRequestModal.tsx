import React, { useState, useEffect } from 'react';
import { MedicineRequestDetailsModel, MedicineRequestUpdateModel } from '../../../feature/API/MedicineRequestService';
import { IconClose } from '../../IconList';

interface UpdateMedicineRequestModalProps {
  isOpen: boolean;
  medicineRequest: MedicineRequestDetailsModel | null;
  onClose: () => void;
  onSubmit : (id: string, payload: MedicineRequestUpdateModel) => void;
  onError: (msg: string) => void;
}

const statuses: string[] = ["Pending", "Approved", "Rejected", "Deleted"];

//Only the nurse can update the status of the medicine request. The parent can only view the details of the request.
//Since parents can update the request beside the status
const UpdateMedicineRequestModal: React.FC<UpdateMedicineRequestModalProps> = ({ isOpen, medicineRequest, onClose, onSubmit, onError }) => {
  const [status, setStatus] = useState<string>('');
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medicineRequest) {
      setStatus(medicineRequest.status || '');
      setErrors(null);
    }
  }, [medicineRequest, isOpen]);

  if (!isOpen || !medicineRequest) return null;


  const handleChange = (e: React.ChangeEvent< HTMLSelectElement>) => {
    setStatus(e.target.value);
    if(errors) setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status.trim()) {
      setErrors('Status is required.');
      return;
    }

    setIsSubmitting(true);

    onSubmit(medicineRequest.id, { 
      requestBy: medicineRequest.requestBy,
      forStudent: medicineRequest.forStudent,
      description: medicineRequest.description,
      status: status,
     });
    
     setIsSubmitting(false);
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
          <h2 className="modal-title">Update Medicine Request Status</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <IconClose />
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <span className="detail-value">{medicineRequest.id}</span>
            </div>
                      
            <div className="detail-row">
              <span className="detail-label">Request By</span>
              <span className="detail-value">{medicineRequest.requestByName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">For Student</span>
              <span className="detail-value">{medicineRequest.forStudentName}</span>
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Date Sent</span>
              <span className="detail-value">{new Date(medicineRequest.dateSent).toLocaleString()}</span>
            </div>
            
            <div className="detail-row">
              <label htmlFor="status-select" className="detail-label">Status</label>
              <select
                id="status-select"
                className="input-field"
                name="status"
                value={status}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                <option value="">Select status...</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors && <div className="error-message">{errors}</div>}
            </div>
          </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <div className="detail-value detail-description">{medicineRequest.description}</div>
          </div>
          
          <div className="detail-row full-width">
            <div className="modal-footer button-row-right">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedicineRequestModal;