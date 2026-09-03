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

  console.log('Incident Record:', incidentRecord);

  const convertToReadableDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title">Incident Record Details</h1>
          <button className="modal-close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div id="incident-record-detail" className="modal-body">
          <div id="student-info" className="modal-group modal-row full-width">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> {incidentRecord.studentName}</p>
            <p><strong>ID:</strong> {incidentRecord.studentId}</p>
          </div>
          <div id="nurse-info" className="modal-group modal-row full-width">
            <h2>Nurse Information</h2>
            <p><strong>Name:</strong> {incidentRecord.handleByName}</p>
            <p><strong>ID:</strong> {incidentRecord.handleBy}</p>
            <p><strong>Note: This nurse will handle this incident.</strong></p>
          </div>
          <div id="incident-info" className="modal-group modal-row full-width">
            <h2>Incident Information</h2>
            <p><strong>Date Occurred:</strong> {convertToReadableDate(incidentRecord.dateOccurred)}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${getStatusClass(incidentRecord.status)}`}>{incidentRecord.status}</span></p>
            <p><strong>Incident Type:</strong> {incidentRecord.incidentType}</p>
            <p><strong>Description:</strong></p>
            <p className="incident-description">{incidentRecord.description}</p>
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