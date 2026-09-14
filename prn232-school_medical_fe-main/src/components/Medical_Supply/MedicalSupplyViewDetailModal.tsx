import React from 'react';
import { MedicineDetailsViewModel } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';

interface MedicalSupplyViewDetailModalProps {
  medicalSupply: MedicineDetailsViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalSupplyViewDetailModal: React.FC<MedicalSupplyViewDetailModalProps> = ({ medicalSupply, isOpen, onClose }) => {
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
          <h2 className="modal-title">Medical Supply Details</h2>
          <button className="modal-close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div id="medical-supply-detail" className="modal-body">
          <div className="modal-group modal-row full-width">
            <p><strong>Name:</strong> {medicalSupply.name}</p>
            <p><strong>ID:</strong> {medicalSupply.id}</p>
            <p><strong>Amount:</strong> {medicalSupply.amount}</p>
            <p><strong>Created By:</strong> {medicalSupply.createdByName}</p>
            <p><strong>Availability:</strong>
            <StatusBadge status={medicine.isAvailable? 'Available':'Unavailable'}></StatusBadge>
            </p>
          </div>         
          <div className="modal-group modal-row full-width">
            <p className="detail-label"><strong>Description:</strong></p>
            <div className="detail-value detail-description">{medicalSupply.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};