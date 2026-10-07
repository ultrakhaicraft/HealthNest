import React, { useState, useEffect } from 'react';
import { MedicineRequestDetailsModel, MedicineRequestUpdateModel } from '../../../feature/API/MedicineRequestService';
import { MedicineRequestStatuses } from '../../../feature/Constant';
import Modal, { ModalField, ModalFooter, ModalForm, ModalGrid, ModalReadOnly } from '../../GenericModal';
import inputStyles from '../../../CSS/InputField.module.css';

interface UpdateMedicineRequestModalProps {
  isOpen: boolean;
  medicineRequest: MedicineRequestDetailsModel | null;
  onClose: () => void;
  onSubmit : (id: string, payload: MedicineRequestUpdateModel) => void;
}


//Only the nurse can update the status of the medicine request. The parent can only view the details of the request.
//Since parents can update the request beside the status
const UpdateMedicineRequestModal: React.FC<UpdateMedicineRequestModalProps> = 
({ isOpen, medicineRequest, onClose, onSubmit }) => {
  const [status, setStatus] = useState<string>('');
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  //Might need to delete this useEffect
  useEffect(() => {
    if (medicineRequest) {
      setStatus(medicineRequest.status || '');
      setErrors(null);
    }
  }, [medicineRequest, isOpen]);

  if (!isOpen || !medicineRequest) return null;


   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    if (errors) setErrors(null);
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status.trim()) {
      setErrors('Status is required.');
      return;
    }

    setIsSubmitting(true);
    try {
       onSubmit(medicineRequest.id, {
        requestBy: medicineRequest.requestBy,
        forStudent: medicineRequest.forStudent,
        description: medicineRequest.description,
        status,
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Modal title="Update Medicine Request Status" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
        <ModalGrid>
          <ModalReadOnly label="ID">{medicineRequest.id}</ModalReadOnly>
          <ModalReadOnly label="Date Sent">
            {new Date(medicineRequest.dateSent).toLocaleString()}
          </ModalReadOnly>

          <ModalReadOnly label="Request By">{medicineRequest.requestByName}</ModalReadOnly>
          <ModalField label="Status" htmlFor="status-select" error={errors ?? undefined}>
            <select
              id="status-select"
              className={inputStyles.inputField}
              name="status"
              value={status}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select status...</option>
              {MedicineRequestStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </ModalField>

          <ModalReadOnly label="For Student">{medicineRequest.forStudentName}</ModalReadOnly>

          <ModalReadOnly label="Description" fullWidth block>
            {medicineRequest.description}
          </ModalReadOnly>
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

export default UpdateMedicineRequestModal;