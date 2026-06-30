import React from 'react';
import { IncidentRecordView } from '../../feature/API/IncidentRecordService';
import { IconClose } from '../IconList';

interface IncidentRecordViewProps {
  incidentRecord: IncidentRecordView;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentRecordViewDetail: React.FC<IncidentRecordViewProps> = ({ incidentRecord, isOpen, onClose }) => {
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
          <h2 className="modal-title">Incident Record Details</h2>
          <button className="modal-close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">ID</span>
              <span className="detail-value">{incidentRecord.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Student ID</span>
              <span className="detail-value">{incidentRecord.studentId}</span>
            </div>
            
             <div className="detail-row">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">{incidentRecord.studentName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Nurse ID</span>
              <span className="detail-value">{incidentRecord.handleBy}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Nurse Name</span>
              <span className="detail-value">{incidentRecord.handleByName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Incident</span>
              <span className="detail-value">{incidentRecord.incidentType}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Date Occurred</span>
              <span className="detail-value">{new Date(incidentRecord.dateOccurred).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="modal-column">
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className={`status-badge ${getStatusClass(incidentRecord.status)}`}>
                  {incidentRecord.status}
                </span>
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Handled By</span>
              <span className="detail-value">{incidentRecord.handleBy}</span>
            </div>
          </div>
          
          <div className="detail-row full-width">
            <span className="detail-label">Description</span>
            <div className="detail-value detail-description">{incidentRecord.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'status-badge-active';
    case 'Inactive':
      return 'status-badge-inactive';
    case 'Resolved':
      return 'status-badge-resolved';
    case 'Pending':
      return 'status-badge-pending';
    default:
      return 'status-badge-pending';
  }
};