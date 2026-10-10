import React from 'react';
import { MedicineDetailsViewModel } from '../../feature/API/MedicineService';
import { StatusBadge } from '../StatusBadge';
import Modal from '../GenericModal';

interface MedicineViewProps {
  medicine: MedicineDetailsViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineViewDetailModal: React.FC<MedicineViewProps> = ({ medicine, isOpen, onClose }) => {
  if (!isOpen) return null;

  

  return (
        <Modal title="Medicine Detail" onClose={onClose} isBusy={false}>
    
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
      </Modal>
     
  );
};