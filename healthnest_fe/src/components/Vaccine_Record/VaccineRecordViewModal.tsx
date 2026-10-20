import { VaccineRecordViewModel } from "../../models/VaccineRecordModel";
import Modal from "../GenericModal";
import { StatusBadge } from "../StatusBadge";

interface VaccineRecordViewDetailModalProps {
  vaccineRecord: VaccineRecordViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const VaccineRecordViewDetailModal: React.FC<VaccineRecordViewDetailModalProps> = ({ vaccineRecord, isOpen, onClose }) => {
  if (!isOpen) return null;

 

  return (
        <Modal title="Vaccine Record Detail" onClose={onClose} isBusy={false}>
    
          <div className="modal-group modal-row full-width">
            <p><strong>ID:</strong> {vaccineRecord.id}</p>
            <p><strong>Title:</strong> {vaccineRecord.vaccineTitle}</p>
            <p><strong>Student Health Record Id:</strong> {vaccineRecord.studentHealthRecordId}</p>
            <p><strong>Student Id:</strong> {vaccineRecord.studentId}</p>
            <p><strong>Record Date:</strong> {vaccineRecord.recordDate}</p>
            <p><strong>Status:</strong>
            <StatusBadge status={vaccineRecord.status ?? ''}></StatusBadge>
            </p>
            <p><strong>Description:</strong></p>
            <div className="detail-value detail-description">{vaccineRecord.description}</div>
          </div>         
        </Modal>
     
  );
};