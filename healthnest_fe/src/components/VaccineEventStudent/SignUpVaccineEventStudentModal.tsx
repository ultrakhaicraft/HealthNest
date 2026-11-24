import React, { useState } from 'react';
import { useUserId } from '../../feature/Hooks/Account/AccountHooks';
import Modal, { ModalForm, ModalField, ModalFooter, ModalReadOnly } from '../GenericModal';
import inputStyles from '../../CSS/InputField.module.css';
import crudStyles from '../../CSS/Nurse/NurseCRUDPanel.module.css'
import { CreateVaccineEventStudentModel } from '../../models/VaccineEventStudentModel';
import { VaccineEventQueryParams, ViewVaccineEventDTO } from '../../models/VaccineEventModel';
import { useParentStudents } from '../../feature/Hooks/Account/useStudentParent';
import { useVaccineEvent } from '../../feature/Hooks/VaccineEvent/useVaccineEvent';
import { StatusBadge } from '../StatusBadge';
import { getHealthTone } from '../../feature/StudentHealthStatus';
import { StudentDetailModel } from '../../models/AccountSubclassModels/StudentModel';
import studentTableStyles from '../../CSS/Parent/LinkedStudentTableWrapper.module.css';
import { TONE_CLASS } from '../StudentManagementPage/Parent/LinkedStudentTableWrapper';
import { FALLBACK_AVATAR } from '../../feature/Constant';


interface SignUpVaccineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVaccineEventStudentModel) => void;
}


const initialForm = {
  studentId: '',
  eventId: '',
  note: '',

};

//Custom query to list vaccine event for sign up period
const eventCustomQuery: VaccineEventQueryParams = {
  pageIndex: 1,
  pageSize: 5,
  sortByLatestDateOccured: true,
  Status: 'SignUp',
}



const SignUpVaccineEventModal = ({ isOpen, onClose, onSubmit }: SignUpVaccineEventModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parentId = useUserId();
  const students = useParentStudents(parentId ?? '');
  const vaccineEvents = useVaccineEvent(eventCustomQuery);

  if (!isOpen) return null;
  const now = new Date();
  const openEvents = vaccineEvents.data.filter(
    ev => ev.dateSignupEnd && new Date(ev.dateSignupEnd) >= now
  );
  const selectedStudent = students.students.find(s => s.id === form.studentId);
  const selectedEvent = openEvents.find(ev => ev.id === form.eventId);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.studentId.trim()) {
      errs.studentId = 'Student ID is required.';
    }
    if (!form.eventId.trim()) {
      errs.eventId = 'Event Id is required.';
    }
    if (!form.note.trim()) {
      errs.description = 'Note is required.';
    } else if (form.note.length > 500) {
      errs.description = 'Note cannot exceed 500 characters.';
    }


    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  const handleSelect = (field: 'studentId' | 'eventId', id: string) => {
    setForm(prev => ({ ...prev, [field]: id }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);

    try {
      onSubmit({
        studentId: form.studentId.trim(),
        vaccineEventId: form.eventId.trim(),
        note: form.note.trim(),
      });

    } finally {
      setIsSubmitting(false);
    }

  };



  return (
    <Modal title="Sign Up for Vaccine Event" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>


        <ModalField label="1. Select your child" htmlFor="student-table" error={errors.studentId}>
          <StudentTable
            loading={students.loading}
            data={students.students}
            selectedId={form.studentId}
            onSelect={(id: string) => handleSelect('studentId', id)}
          />
        </ModalField>

        <ModalField label="2. Select a vaccine event" htmlFor="event-table" error={errors.eventId}>
          <EventTable
            loading={vaccineEvents.loading}
            data={openEvents}
            selectedId={form.eventId}
            onSelect={(id: string) => handleSelect('eventId', id)}
          />
        </ModalField>


        <h2>Submit Info</h2>
        <ModalReadOnly label="Student (Only one per submission)" fullWidth>
          {selectedStudent ? <>
            <p>Name: {selectedStudent?.fullName}</p>
            <p>Class: {selectedStudent?.class}</p>
          </> : <>
            <p className={crudStyles.erroMessageBox}>Student not selected, please select an student to sign up</p>
          </>}
        </ModalReadOnly>
        <ModalReadOnly label="Event (Only one per submission)" fullWidth>
          {selectedEvent ? <>
            <p><strong></strong>Id: {selectedEvent?.id}</p>
            <p>Title: {selectedEvent?.title}</p>
            <p>Date Occur: {selectedEvent?.dateOccurred}</p></> :
            <>
              <p className={crudStyles.erroMessageBox}>Event not selected, please select an event to sign up</p>
            </>}
        </ModalReadOnly>

        <ModalField label="Sign Up Note" htmlFor="note" error={errors.description}>
          <textarea
            id="note"
            className={inputStyles.textareaField}
            name="note"
            rows={5}
            value={form.note}
            onChange={handleChange}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Enter a detailed note regarding to your child, situation or how to handle during vaccine event."

          />
        </ModalField>

        <ModalFooter>
          <button type="button" className="button button-secondary" onClick={handleClear} disabled={isSubmitting}>
            Clear
          </button>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
};


interface EventTableProps {
  loading: boolean;
  data: ViewVaccineEventDTO[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const EventTable = ({
  loading,
  data,
  selectedId,
  onSelect,
}: EventTableProps) => {
  return (<div className={crudStyles.crudTableWrapper}>
    <table className={crudStyles.crudTable}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Date Occurred</th>
          <th>Date Signup Start</th>
          <th>Date Signup End</th>
          <th>Status </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan={6} className={crudStyles.loadingBox}>
              Loading vaccine event data...
            </td>
          </tr>
        )}
        {data.length === 0 && !loading && (
          <tr>
            <td colSpan={6} className={crudStyles.loadingBox}>
              No vaccine event data found
            </td>
          </tr>
        )}
        {data.map(vaccinEvent => (
          <tr key={vaccinEvent.id}>
            <td>{vaccinEvent.id}</td>
            <td>{vaccinEvent.title}</td>
            <td>{new Date(vaccinEvent.dateOccurred).toLocaleString()}</td>
            <td>{new Date(vaccinEvent.dateSignupStart ?? "").toLocaleString()}</td>
            <td>{new Date(vaccinEvent.dateSignupEnd ?? "").toLocaleString()}</td>
            <td><StatusBadge status={vaccinEvent.status} /></td>
            <td>
              <div className={crudStyles.actionButtons}>
                <button className="button button-secondary button-small" onClick={() => onSelect(vaccinEvent.id)} disabled={loading}>
                  Select
                </button>


              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)
}

interface StudentTableProps {
  loading: boolean;
  data: StudentDetailModel[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const StudentTable = ({
  loading,
  data,
  selectedId,
  onSelect,
}: StudentTableProps) => {
  return (
    <div className={crudStyles.crudTableWrapper}>
      <table className={crudStyles.crudTable}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Health status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className={crudStyles.loadingBox}>
                Loading vaccine event data...
              </td>
            </tr>
          )}
          {data.length === 0 && !loading && (
            <tr>
              <td colSpan={6} className={crudStyles.loadingBox}>
                No vaccine event data found
              </td>
            </tr>
          )}
          {data.map(student => {
            const tone = getHealthTone(student.currentHealthStatus);
            const name = student.fullName ?? 'N/A';

            return (
              <tr key={student.id}>
                <td>
                  <div className={studentTableStyles.studentCell}>
                    <img
                      src={student.avatarUrl && student.avatarUrl !== 'Empty' ? student.avatarUrl : FALLBACK_AVATAR}
                      alt="studentImageAvatar"
                      className={studentTableStyles.avatar}
                    />
                    <span className={studentTableStyles.studentName}>{name}</span>

                  </div>
                </td>
                <td>{student.class ?? 'N/A'}</td>
                <td>
                  <span className={`${studentTableStyles.statusPill} ${TONE_CLASS[tone]}`}>
                    <span className={studentTableStyles.statusDot} aria-hidden="true" />
                    {student.currentHealthStatus || 'Not recorded'}
                  </span>
                </td>
                <td>
                  <div className={crudStyles.actionButtons}>
                    <button className="button button-secondary button-small" onClick={() => onSelect(student.id)} disabled={loading}>
                      Select
                    </button>


                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SignUpVaccineEventModal; 