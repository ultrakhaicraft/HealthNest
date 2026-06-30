import React from 'react';
import { Medicine } from '../../feature/API/MedicineService';
import { IconClose } from '../IconList';

interface MedicineViewProps {
  medicine: Medicine;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineView: React.FC<MedicineViewProps> = ({ medicine, isOpen, onClose }) => {
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
        <div className="modal-body">
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <span className="detail-value">{medicine.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{medicine.name}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">{medicine.amount}</span>
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Availability</span>
              <span className="detail-value">
                <span className={`status-badge ${medicine.isAvailable ? 'status-badge-active' : 'status-badge-inactive'}`}>
                  {medicine.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Created By</span>
              <span className="detail-value">{medicine.createdByName}</span>
            </div>
          </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <div className="detail-value detail-description">{medicine.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};