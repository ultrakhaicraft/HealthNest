import React from 'react';
import { MedicineDetailsViewModel } from '../../feature/API/MedicineService';
import { StatusBadge } from '../StatusBadge';
import Modal from '../GenericModal';

interface MedicalSupplyViewDetailModalProps {
  medicalSupply: MedicineDetailsViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalSupplyViewDetailModal: React.FC<MedicalSupplyViewDetailModalProps> = ({ medicalSupply, isOpen, onClose }) => {
  if (!isOpen) return null;

 

  return (
        <Modal title="Medical Supply Detail" onClose={onClose} isBusy={false}>
    
          <div className="modal-group modal-row full-width">
            <p><strong>Name:</strong> {medicalSupply.name}</p>
            <p><strong>ID:</strong> {medicalSupply.id}</p>
            <p><strong>Amount:</strong> {medicalSupply.amount}</p>
            <p><strong>Created By:</strong> {medicalSupply.createdByName}</p>
            <p><strong>Availability:</strong>
            <StatusBadge status={medicalSupply.isAvailable? 'Available':'Unavailable'}></StatusBadge>
            </p>
            <p><strong>Description:</strong></p>
            <div className="detail-value detail-description">{medicalSupply.description}</div>
          </div>         
        </Modal>
     
  );
};