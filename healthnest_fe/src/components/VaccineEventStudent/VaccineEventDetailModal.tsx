import { ViewVaccineEventStudentDetailModel } from "../../models/VaccineEventStudentModel";
import Modal from "../GenericModal";
import { StatusBadge } from "../StatusBadge";

interface ViewVaccineEventStudentDetailProps {
    vaccineEventParticipant: ViewVaccineEventStudentDetailModel;
    isOpen: boolean;
    onClose: () => void;
}

//TODO: Update the view vaccine event detail to include a list of student that have signed up for the event, and their status (signed up, attended, etc.)
export const ViewVaccineEventStudentDetail: React.FC<ViewVaccineEventStudentDetailProps> = ({ vaccineEventParticipant, isOpen, onClose }) => {
    if (!isOpen) return null;


    return (
        <Modal title="Vaccine Event Participant Detail" onClose={onClose} isBusy={false}>

            <div className="modal-group modal-row full-width">
                <p><strong>Vaccine Event ID:</strong> {vaccineEventParticipant.vaccineeventId}</p>
                <p><strong>Student Name:</strong> {vaccineEventParticipant.studentName}</p>
                <p><strong>Student Id:</strong> {vaccineEventParticipant.studentId}</p>
                <p><strong>Parent Id:</strong> {vaccineEventParticipant.registeredByParent}</p>

                <p><strong>Reviewed By:</strong> {vaccineEventParticipant.checkedByName}</p>
                <p><strong>Reviewed By Id:</strong> {vaccineEventParticipant.checkedBy}</p>


                <p><strong>Sign up Date:</strong> {new Date(vaccineEventParticipant.signupDate).toLocaleString()}</p>
                <p><strong>Update At:</strong> {new Date(vaccineEventParticipant.updatedAt).toLocaleString()}</p>

                <p><strong>Status:</strong>
                    <StatusBadge status={vaccineEventParticipant.status ?? ""}></StatusBadge>
                </p>

                <p><strong>Note from Parent:</strong></p>
                <div className="detail-value detail-description">{vaccineEventParticipant.note}</div>
                <p><strong>Result Summary:</strong></p>
                <div className="detail-value detail-description">{vaccineEventParticipant.resultSummary}</div>

            </div>
        </Modal>

    );
};