import React, { useState } from "react";
import { PreselectedStudent } from "../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestModal";
import { LinkRequestCreateModel, StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import { StudentDetailModel, StudentViewModel } from "../../../models/AccountSubclassModels/StudentModel";
import { UserRole } from "../../../feature/Constant";
import { getLinkRequestErrorMessage, StudentLinkRequestService } from "../../../feature/API/StudentLinkRequestService";
import { accountService } from "../../../feature/API/AccountService";
import inputStyles from "../../../CSS/InputField.module.css";
import styles from "../../../CSS/Parent/CreateStudentLinkRequestModal.module.css";
import Modal, { ModalField, ModalFooter, ModalForm } from "../../GenericModal";

type LookupMessage = { type: 'error' | 'success'; text: string };
const NOTE_MAX_LENGTH = 500;
const todayLocal = () => new Date().toLocaleDateString('en-CA');

interface CreateStudentLinkRequestModalProps {
    isOpen: boolean;
    remainingSlots: number;
    pendingStudentIds: string[];
    preselected?: PreselectedStudent;
    onClose: () => void;
    onSubmit: (payload: LinkRequestCreateModel) => void;
}

const CreateStudentLinkRequestModal = ({
    isOpen,
    remainingSlots,
    pendingStudentIds,
    preselected,
    onClose,
    onSubmit,
}: CreateStudentLinkRequestModalProps) => {
    const [selected, setSelected] = useState<StudentViewModel[]>(
        preselected
            ? [{
                id: preselected.studentId, fullName: preselected.displayName ?? 'Student',
                class: 'N/A', email: 'N/A', currentHealthStatus: 'N/A', gender: 'N/A', role: UserRole.Student, status: 'N/A'
            }]
            : []
    )

    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [lookupMessage, setLookupMessage] = useState<LookupMessage | null>(null); //Error message related to lookup
    const [isLookingUp, setIsLookingUp] = useState(false);

    const [note, setNote] = useState('');
    const [errors, setErrors] = useState<{ students?: string; note?: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slotsLeft = remainingSlots - selected.length;
    const busy = isLookingUp || isSubmitting;

    const handleStudentQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        setLookupMessage(null);

        if (slotsLeft <= 0) {
            setLookupMessage({ type: 'error', text: 'You have reached the pending request limit.' });
            return;
        }
        if (!email.trim() || !dob) {
            setLookupMessage({ type: 'error', text: "Enter the student's email and date of birth." });
            return;
        }

        setIsLookingUp(true);

        try {
            const found = await accountService.LookupAllStudents({
                email: email.trim(),
                dateOfBirth: dob,
            });

            if (selected.some(s => s.id === found.id)) {
                setLookupMessage({ type: 'error', text: `${found.fullName} is already in your list.` });
                return;
            }
            if (pendingStudentIds.includes(found.id)) {
                setLookupMessage({
                    type: 'error',
                    text: `You already have a pending request for ${found.fullName}.`,
                });
                return;
            }

            setSelected(prev => [...prev, found]);
            setErrors(prev => ({ ...prev, students: undefined }));
            setEmail('');
            setDob('');
            setLookupMessage({ type: 'success', text: `Added ${found.fullName}.` });
        } catch (error) {

            setLookupMessage({
                type: 'error',
                text: getLinkRequestErrorMessage(error, 'Could not find a student with those details.'),
            });
        } finally {
            setIsLookingUp(false);
        }
    }

    const removeSelected = (studentId: string) => {
        setSelected(prev => prev.filter(s => s.id !== studentId));
        setLookupMessage(null);
    };

    // ----- Submit -----
    const validate = () => {
        const errs: { students?: string; note?: string } = {};
        if (selected.length === 0) errs.students = 'Add at least one student.';
        if (!note.trim()) errs.note = 'Please describe your relationship to the student.';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit({
                studentIds: selected.map(s => s.id),
                relationshipNote: note.trim(),
            });
            // Success: the page closes this modal, so there is nothing to reset here
        } catch (err) {
            setSubmitError(getLinkRequestErrorMessage(err, 'Failed to send the request.'));
        } finally {
            setIsSubmitting(false);

        }
    };

    return (
        <Modal title="Request to link a student" onClose={onClose} isBusy={isSubmitting}>

            {/* Lookup students */}

            <section className={styles.block}>
                <h3 className={styles.blockTitle}>1. Find your child</h3>
                <p className={styles.help}>
                    Enter the email and date of birth registered for the student. For privacy, the school
                    does not show full list of students. If a student is found, it will be added immediately to the request list.
                </p>
                <form className={styles.lookupForm} onSubmit={handleStudentQuery}>
                    <div className={styles.field}>
                        <label htmlFor="lookupEmail" className={styles.label}>Student email</label>
                        <input
                            id="lookupEmail"
                            type="email"
                            className={inputStyles.inputField}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={busy || slotsLeft <= 0}
                            autoComplete="off"
                            placeholder="Enter your child email"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="lookupDob" className={styles.label}>Date of birth</label>
                        <input
                            id="lookupDob"
                            type="date"
                            className={inputStyles.inputField}
                            value={dob}
                            onChange={e => setDob(e.target.value)}
                            max={todayLocal()}
                            disabled={busy || slotsLeft <= 0}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.secondaryButton}
                        disabled={busy || slotsLeft <= 0 || !email.trim() || !dob}
                    >
                        {isLookingUp ? 'Searching...' : 'Find student'}
                    </button>
                </form>
                {lookupMessage && (
                    <p
                        className={lookupMessage.type === 'error' ? styles.messageError : styles.messageSuccess}
                        role={lookupMessage.type === 'error' ? 'alert' : 'status'}
                    >
                        {lookupMessage.text}
                    </p>
                )}
            </section>

            {/* Selected students */}
            <section className={styles.block}>
                <h3 className={styles.blockTitle}>2. Students in this request ({selected.length})</h3>
                {selected.length === 0 ? (
                    <p className={styles.emptySelected}>No students added yet.</p>
                ) : (
                    <ul className={styles.selectedList}>
                        {selected.map(student => (
                            <li key={student.id} className={styles.selectedItem}>
                                <div>
                                    <span className={styles.selectedName}>{student.fullName}</span>
                                    {student.class && <span className={styles.selectedMeta}> · Class {student.class}</span>}
                                </div>
                                <button
                                    type="button"
                                    className={styles.removeLink}
                                    onClick={() => removeSelected(student.id)}
                                    disabled={isSubmitting}
                                    aria-label={`Remove ${student.fullName} from this request`}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <p className={styles.quota}>
                    {slotsLeft > 0
                        ? `You can add ${slotsLeft} more student${slotsLeft === 1 ? '' : 's'} (limit: pending requests per parent).`
                        : 'You have reached the pending request limit.'}
                </p>
                {errors.students && <p className={styles.error}>{errors.students}</p>}
            </section>

            <ModalForm onSubmit={handleSubmit}>
                <ModalField label="Your relationship to the student" htmlFor="relationshipNote" error={errors.note} fullWidth>
                    <textarea
                        id="relationshipNote"
                        className={inputStyles.inputField}
                        value={note}
                        onChange={e => {
                            setNote(e.target.value);
                            if (errors.note) setErrors(prev => ({ ...prev, note: undefined }));
                        }}
                        maxLength={NOTE_MAX_LENGTH}
                        rows={4}
                        disabled={isSubmitting}
                        placeholder="For example: Mother. Add any details that help the school verify the link."
                    />
                    <span className={styles.counter}>{note.length}/{NOTE_MAX_LENGTH}</span>

                </ModalField>

                {submitError && <p className={styles.error} role="alert">{submitError}</p>}

                <ModalFooter>
                    <button type="button" className="button button-secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="button button-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : `Send request${selected.length > 1 ? 's' : ''}`}
                    </button>
                </ModalFooter>
            </ModalForm>
        </Modal>
    )
}

export default CreateStudentLinkRequestModal