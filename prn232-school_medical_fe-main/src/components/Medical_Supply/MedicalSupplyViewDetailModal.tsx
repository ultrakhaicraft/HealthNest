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
        <div className="modal-body">
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Supply ID</span>
              <span className="detail-value">{medicalSupply.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Supply Name</span>
              <span className="detail-value">{medicalSupply.name}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Supply Amount</span>
              <span className="detail-value">{medicalSupply.amount}</span>
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Availability</span>
              <span className="detail-value">
                <span className={`status-badge ${medicalSupply.isAvailable ? 'status-badge-active' : 'status-badge-inactive'}`}>
                  {medicalSupply.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Created By</span>
              <span className="detail-value">{medicalSupply.createdByName}</span>
            </div>
          </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <div className="detail-value detail-description">{medicalSupply.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};