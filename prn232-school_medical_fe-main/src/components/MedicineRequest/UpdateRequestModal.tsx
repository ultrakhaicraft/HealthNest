import { useState, useEffect } from "react";
import { MedicineUpdateCreation } from "../../feature/API/MedicineRequestService";
import Modal from "../GenericModal";
import '../../app/CSS/UpdateMedicineRequestModal.css';

const statuses: string[] = ["Pending", "Approved", "Rejected", "Deleted"];

export interface UpdateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicineUpdateCreation) => void;
  initialData: MedicineUpdateCreation;
}

const UpdateRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: UpdateRequestModalProps) => {
  const [formData, setFormData] = useState<MedicineUpdateCreation>(initialData);

  // Update formData when initialData changes (e.g., on re-open)
  useEffect(() => {
    console.log("Modal Open", initialData);
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal title="Update Medicine Request" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <label className="modal-label">Requested By </label>
        <input
          type="text"
          name="requestBy"
          value={formData.requestBy}
          onChange={handleChange}
          placeholder="Requested By"
          className="modal-input"
          readOnly
        />
        <label className="modal-label">For Student </label>
        <input
          type="text"
          name="forStudent"
          value={formData.forStudent}
          onChange={handleChange}
          placeholder="For Student"
          className="modal-input"
          readOnly
        />
        <label className="modal-label">Description </label>
        <textarea
          name="description"
          value={formData.description}
          rows={5}
          onChange={handleChange}
          placeholder="Description"
          className="modal-input"
        />
        
        <label className="modal-label">Status </label>
        <select
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
          className="modal-input"
        >
          <option value="">Select status...</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button type="button" onClick={onClose} className="btn cancel-btn">
            Cancel
          </button>
          <button type="submit" className="btn update-btn">
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateRequestModal;


