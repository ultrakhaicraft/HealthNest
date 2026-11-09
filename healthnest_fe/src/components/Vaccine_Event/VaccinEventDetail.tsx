import { VaccineEventDetailDTO } from "../../models/VaccineEventModel";
import Modal from "../GenericModal";
import { StatusBadge } from "../StatusBadge";

interface VaccineEventViewProps {
    vaccineEvent: VaccineEventDetailDTO;
    isOpen: boolean;
    onClose: () => void;
}

//TODO: Update the view vaccine event detail to include a list of student that have signed up for the event, and their status (signed up, attended, etc.)
export const VaccineEventViewDetail: React.FC<VaccineEventViewProps> = ({ vaccineEvent, isOpen, onClose }) => {
    if (!isOpen) return null;


    return (
        <Modal title="Medicine Detail" onClose={onClose} isBusy={false}>

            <div className="modal-group modal-row full-width">
                <p><strong>Name:</strong> {vaccineEvent.title}</p>
                <p><strong>ID:</strong> {vaccineEvent.id}</p>
                <p><strong>Amount:</strong> {vaccineEvent.createdBy}</p>
                <p><strong>Date Occurred of the event:</strong> {vaccineEvent.dateOccurred}</p>
                <p><strong>Sign up Period:</strong> {vaccineEvent.dateSignupStart} to {vaccineEvent.dateSignupEnd}</p>
                <p><strong>Status:</strong>
                    <StatusBadge status={vaccineEvent.status}></StatusBadge>
                </p>
                <p><strong>Content:</strong></p>
                <div className="detail-value detail-description">{vaccineEvent.content}</div>
                <p><strong>Description:</strong></p>
                <div className="detail-value detail-description">{vaccineEvent.shortDescription}</div>
            </div>
        </Modal>

    );
};