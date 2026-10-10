import React from 'react';
import { MedicineRequestDetailsModel } from '../../../feature/API/MedicineRequestService';
import { StatusBadge } from '../../StatusBadge';
import Modal from '../../GenericModal';

interface MedicineRequestViewProps {
  medicineRequest: MedicineRequestDetailsModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineRequestViewDetail: React.FC<MedicineRequestViewProps> = ({ medicineRequest, isOpen, onClose }) => {
  if (!isOpen) return null;

 

  return (
    <Modal title="Medicine Request Detail" onClose={onClose} isBusy={false}>
          <div className="modal-group modal-row full-width">
              <p><strong>Medicine Request ID:</strong> {medicineRequest.id}</p>
              <p><strong>Requester ID:</strong> {medicineRequest.requestBy}</p>
              <p><strong>Requester Name:</strong> {medicineRequest.requestByName}</p>
              <p><strong>Student ID:</strong> {medicineRequest.forStudent}</p>
              <p><strong>Student Name:</strong> {medicineRequest.forStudentName}</p>
              <p><strong>Date Sent:</strong> {new Date(medicineRequest.dateSent).toLocaleString()}</p>
              <p><strong>Status:</strong> <StatusBadge status={medicineRequest.status}></StatusBadge></p>
              <p><strong>Description:</strong></p>
              <div className="detail-value detail-description">{medicineRequest.description}</div>            
          </div>
    </Modal>
  );
};
