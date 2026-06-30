import React from 'react';
import { MedicineRequestResponseDto } from '../../feature/API/MedicineRequestService';
import { IconClose } from '../IconList';

interface MedicineRequestViewProps {
  medicineRequest: MedicineRequestResponseDto;
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
        <div className="modal-body">
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <span className="detail-value">{medicineRequest.id}</span>
            </div>
            
            
            <div className="detail-row">
              <span className="detail-label">Request By</span>
              <span className="detail-value">{medicineRequest.requestBy}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Requester Name</span>
              <span className="detail-value">{medicineRequest.requestByName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">For Student</span>
              <span className="detail-value">{medicineRequest.forStudent}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">{medicineRequest.forStudentName}</span>
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Date Sent</span>
              <span className="detail-value">{new Date(medicineRequest.dateSent).toLocaleString()}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className={`status-badge ${getStatusClass(medicineRequest.status)}`}>
                  {medicineRequest.status}
                </span>
              </span>
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