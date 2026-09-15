import React from 'react';
import { MedicineDetailsViewModel } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';
import { StatusBadge } from '../StatusBadge';

interface MedicineViewProps {
  medicine: MedicineDetailsViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineViewDetailModal: React.FC<MedicineViewProps> = ({ medicine, isOpen, onClose }) => {
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
          <h2 className="modal-title">Medicine Details</h2>
          <button className="modal-close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        
        <div id="medicine-detail" className="modal-body">
          <div className="modal-group modal-row full-width">
            <p><strong>Name:</strong> {medicine.name}</p>
            <p><strong>ID:</strong> {medicine.id}</p>
            <p><strong>Amount:</strong> {medicine.amount}</p>
            <p><strong>Created By:</strong> {medicine.createdByName}</p>
            <p><strong>Availability:</strong>
            <StatusBadge status={medicine.isAvailable? 'Available':'Unavailable'}></StatusBadge>
            </p>
            <p><strong>Description:</strong></p>
            <div className="detail-value detail-description">{medicine.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};