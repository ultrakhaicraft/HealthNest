import { TreatmentRecordViewModel } from "../../models/TreatmentRecordModel";
import Modal from "../GenericModal";
import { StatusBadge } from "../StatusBadge";

interface TreatmentRecordViewDetailModalProps {
  TreatmentRecord: TreatmentRecordViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const TreatmentRecordViewDetailModal: React.FC<TreatmentRecordViewDetailModalProps> = ({ TreatmentRecord, isOpen, onClose }) => {
  if (!isOpen) return null;

 

  return (
        <Modal title="Treatment Record Detail" onClose={onClose} isBusy={false}>
    
          <div className="modal-group modal-row full-width">
            <p><strong>ID:</strong> {TreatmentRecord.id}</p>
            <p><strong>Title:</strong> {TreatmentRecord.treatmentTitle}</p>
            <p><strong>Student Health Record Id:</strong> {TreatmentRecord.studentHealthRecordId}</p>
            <p><strong>Student Id:</strong> {TreatmentRecord.studentId}</p>
            <p><strong>Record Date:</strong> {TreatmentRecord.recordDate}</p>
            <p><strong>Status:</strong>
            <StatusBadge status={TreatmentRecord.status ?? ''}></StatusBadge>
            </p>
            <p><strong>Description:</strong></p>
            <div className="detail-value detail-description">{TreatmentRecord.description}</div>
          </div>         
        </Modal>
     
  );
};