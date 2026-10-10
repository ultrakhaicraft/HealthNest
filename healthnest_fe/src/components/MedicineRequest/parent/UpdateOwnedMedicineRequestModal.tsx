import { useState, useEffect } from "react";
import { MedicineRequestDetailsModel, MedicineRequestUpdateModel } from "../../../feature/API/MedicineRequestService";
import inputStyles from '../../../CSS/InputField.module.css';
import Modal, { ModalForm, ModalGrid, ModalReadOnly, ModalField, ModalFooter } from "../../GenericModal";

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
    try{
      onSubmit(medicineRequest.id, {
      requestBy: form.requestBy,
      forStudent: form.forStudent,
      description: form.description,
    });
    }finally{
      setIsSubmitting(false);
    }

  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  

  return (
      <Modal title="Update Medicine Request" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
          <ModalReadOnly label="Requester ID (Your Id as a parent)">
            {medicineRequest.requestBy}
          </ModalReadOnly>

          <ModalReadOnly label="Student Id (Your children Id as the school student)">
            {medicineRequest.forStudent}
          </ModalReadOnly>

          <ModalField
            label="Description"
            htmlFor="medicine-description"
            error={errors.description}
            fullWidth
          >
            <textarea
              id="medicine-description"
              className={inputStyles.inputField}
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              disabled={isSubmitting}
              rows={4}
            />
          </ModalField>

        <ModalFooter>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  )
};

export default UpdateOwnedMedicineRequestModal;