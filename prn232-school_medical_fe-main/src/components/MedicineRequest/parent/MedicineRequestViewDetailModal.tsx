import React from 'react';
import { MedicineRequestDetailsModel } from '../../../feature/API/MedicineRequestService';
import { IconClose } from '../../IconList';
import { StatusBadge } from '../../StatusBadge';

interface MedicineRequestViewProps {
  medicineRequest: MedicineRequestDetailsModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineRequestViewDetail: React.FC<MedicineRequestViewProps> = ({ medicineRequest, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Medicine Request Details</h2>
          <button className="modal-close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div id="medicine-request-detail" className="modal-body">
          <div className="modal-column">
            <div className="detail-row">
              <p><strong>Medicine Request ID:</strong> {medicineRequest.id}</p>
              <p><strong>Requester ID:</strong> {medicineRequest.requestBy}</p>
              <p><strong>Requester Name:</strong> {medicineRequest.requestByName}</p>
              <p><strong>Student ID:</strong> {medicineRequest.forStudent}</p>
              <p><strong>Student Name:</strong> {medicineRequest.forStudentName}</p>
              <p><strong>Date Sent:</strong> {new Date(medicineRequest.dateSent).toLocaleString()}</p>
              <p><strong>Status:</strong> <StatusBadge status={medicineRequest.status}></StatusBadge></p>
            </div>            
          </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <div className="detail-value detail-description">{medicineRequest.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'status-badge-pending';
    case 'Approved':
      return 'status-badge-active';
    case 'Rejected':
      return 'status-badge-inactive';
    case 'Completed':
      return 'status-badge-resolved';
    default:
      return 'status-badge-pending';
  }
};