import { useEffect, useState } from "react";
import { useUserId } from "../../../feature/Hooks/Account/AccountHooks";
import { StudentHealthRecordCreateModel, StudentHealthRecordDetailModel, StudentHealthRecordUpdateModel } from "../../../models/StudentHealthRecordModel";
import Modal, { ModalForm, ModalField, ModalReadOnly, ModalFooter } from "../../GenericModal";
import inputStyles from '../../../CSS/InputField.module.css';


interface StudentHealthRecordUpdateModalProps {
    isOpen: boolean;
    studentHealthRecord: StudentHealthRecordDetailModel | null;
    onClose: () => void;
    onSubmit: (id: string,payload: StudentHealthRecordUpdateModel) => void;
    onError: (msg: string) => void;
}

const initialForm = {
    studentId: '',
    height: '',
    weight: '',
    allergies: '',
    healthHistory: '',
    vision: '',
    earNoseAndMouth: '',
    teeth: '',
    bloodProfile: '',
    bloodPressure: '',
    heart: '',
}

const StudentHealthRecordUpdateModal: React.FC<StudentHealthRecordUpdateModalProps> = ({ isOpen,studentHealthRecord, onClose, onSubmit, onError }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = useUserId(); // Custom hook to get the current user's ID

    if (!isOpen) return null;

    useEffect(() => {
        if (studentHealthRecord) {
          setForm({
            studentId: studentHealthRecord.studentId,
            height: studentHealthRecord.height ? studentHealthRecord.height.toString() : '0',
            weight: studentHealthRecord.weight ?  studentHealthRecord.weight.toString() : '0',
            allergies: studentHealthRecord.allergies || '',
            healthHistory: studentHealthRecord.healthHistory || '',
            vision:studentHealthRecord.vision || '',
            earNoseAndMouth: studentHealthRecord.earNoseAndMouth || '',
            teeth: studentHealthRecord.teeth || '',
            bloodProfile: studentHealthRecord.bloodProfile || '',
            bloodPressure: studentHealthRecord.bloodPressure || '',
            heart: studentHealthRecord.heart || '',
        });
          setErrors({});
        }
      }, [studentHealthRecord, isOpen]);
    
      if (!isOpen || !studentHealthRecord) return null;

    const validate = () => {
        const errs: { [key: string]: string } = {};
        if (userId === null) {
            errs.name = 'Unable to get userId';
        }
        if (!form.studentId.trim()) {
            errs.name = 'Student Id is required.';
        }

        if (!form.height || isNaN(Number(form.height)) || Number(form.height) <= 0) {
            errs.height = 'Height must be a positive number.';
        }

        if (Number(form.height) <= 300) {
            errs.height = 'Height must be below 300cm.';
        }

        if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
            errs.weight = 'Weight must be a positive number.';
        }

        if (Number(form.weight) <= 300) {
            errs.weight = 'Weight must be below 300kg.';
        }

        if (!form.allergies.trim()) {
            errs.allergies = 'Allergy info is required.';
        } else if (form.allergies.length < 2 || form.allergies.length > 500) {
            errs.allergies = 'Allergy info must be between 2 and 500 characters.';
        }

        if (!form.healthHistory.trim()) {
            errs.healthHistory = 'Health history info is required.';
        } else if (form.healthHistory.length < 2 || form.healthHistory.length > 500) {
            errs.healthHistory = 'Health history info must be between 2 and 500 characters.';
        }


        if (!form.vision.trim()) {
            errs.vision = 'Vision info is required.';
        } else if (form.vision.length < 2 || form.vision.length > 500) {
            errs.vision = 'Vision info must be between 2 and 500 characters.';
        }

        if (!form.earNoseAndMouth.trim()) {
            errs.earNoseAndMouth = 'Ear, Nose, And Mouth info is required.';
        } else if (form.earNoseAndMouth.length < 2 || form.earNoseAndMouth.length > 500) {
            errs.earNoseAndMouth = 'Ear, Nose, And Mouth info must be between 2 and 500 characters.';
        }

        if (!form.teeth.trim()) {
            errs.teeth = 'Teeth info is required.';
        } else if (form.teeth.length < 2 || form.teeth.length > 500) {
            errs.teeth = 'Teeth info must be between 2 and 500 characters.';
        }

        if (!form.bloodProfile.trim()) {
            errs.bloodProfile = 'Blood profile info is required.';
        } else if (form.bloodProfile.length < 2 || form.bloodProfile.length > 500) {
            errs.bloodProfile = 'Blood profile info must be between 2 and 500 characters.';
        }

        if (!form.bloodPressure.trim()) {
            errs.bloodPressure = 'Blood pressure info is required.';
        } else if (form.bloodPressure.length < 2 || form.bloodPressure.length > 500) {
            errs.bloodPressure = 'Blood pressure info must be between 2 and 500 characters.';
        }

        if (!form.heart.trim()) {
            errs.heart = 'Heart info is required.';
        } else if (form.heart.length < 2 || form.heart.length > 500) {
            errs.heart = 'Heart info must be between 2 and 500 characters.';
        }

        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClear = () => {
        setForm({
            studentId: '',
            height: '0',
            weight: '0',
            allergies: '',
            healthHistory: '',
            vision: '',
            earNoseAndMouth: '',
            teeth: '',
            bloodProfile: '',
            bloodPressure: '',
            heart: '',
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setIsSubmitting(true);

        try {
            onSubmit(studentHealthRecord.id,{
                studentId: form.studentId.trim(),
                height: Number(form.height),
                weight: Number(form.weight),
                createdBy: userId || '', // Use the userId from the custom hook
                allergies: form.allergies.trim(),
                healthHistory: form.healthHistory.trim(),
                vision: form.vision.trim(),
                earNoseAndMouth: form.earNoseAndMouth.trim(),
                teeth: form.teeth.trim(),
                bloodProfile: form.bloodProfile.trim(),
                bloodPressure: form.bloodPressure.trim(),
                heart: form.heart.trim()
            });
        } finally {
            setIsSubmitting(false);

        }

    };



    return (
        <Modal title="Update Student Health Record" onClose={onClose} isBusy={isSubmitting}>
            <ModalForm onSubmit={handleSubmit}>


                <ModalReadOnly label="Student Id">
                    {form.studentId ?? ''}
                </ModalReadOnly>

                <ModalReadOnly label="Created By Id">
                    {userId ?? ''}
                </ModalReadOnly>

                {/*Sample ModalField from Medicine Request, need convert to be suitable for Student Health Record*/}
                <ModalField label="Height (cm)" htmlFor="height" error={errors.height}>
                    <input
                        id="height"
                        className={inputStyles.inputField}
                        name="height"
                        type="number"
                        min="1"
                        value={form.height}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. 142"
                        required
                    />
                </ModalField>

                <ModalField label="Weight (kg)" htmlFor="weight" error={errors.weight}>
                    <input
                        id="weight"
                        className={inputStyles.inputField}
                        name="weight"
                        type="number"
                        min="1"
                        value={form.weight}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. 38"
                        required
                    />
                </ModalField>

                <ModalField label="Blood Pressure" htmlFor="bloodPressure" error={errors.bloodPressure}>
                    <input
                        id="bloodPressure"
                        className={inputStyles.inputField}
                        name="bloodPressure"
                        value={form.bloodPressure}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={15}
                        placeholder="e.g. 110/70"
                        required
                    />
                </ModalField>

                <ModalField label="Blood Profile" htmlFor="bloodProfile" error={errors.bloodProfile}>
                    <input
                        id="bloodProfile"
                        className={inputStyles.inputField}
                        name="bloodProfile"
                        value={form.bloodProfile}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={10}
                        placeholder="e.g. O+"
                        required
                    />
                </ModalField>

                <ModalField label="Vision" htmlFor="vision" error={errors.vision} fullWidth>
                    <textarea
                        id="vision"
                        className={inputStyles.inputField}
                        name="vision"
                        value={form.vision}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={300}
                        rows={2}
                        placeholder="e.g. 6/6 both eyes, no corrective lenses required"
                        required
                    />
                </ModalField>

                <ModalField label="Ear, Nose & Mouth" htmlFor="earNoseAndMouth" error={errors.earNoseAndMouth} fullWidth>
                    <textarea
                        id="earNoseAndMouth"
                        className={inputStyles.inputField}
                        name="earNoseAndMouth"
                        value={form.earNoseAndMouth}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={300}
                        rows={2}
                        placeholder="e.g. No discharge or infection noted"
                        required
                    />
                </ModalField>

                <ModalField label="Teeth" htmlFor="teeth" error={errors.teeth} fullWidth>
                    <textarea
                        id="teeth"
                        className={inputStyles.inputField}
                        name="teeth"
                        value={form.teeth}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={300}
                        rows={2}
                        placeholder="e.g. Mild plaque buildup on lower molars"
                        required
                    />
                </ModalField>

                <ModalField label="Heart" htmlFor="heart" error={errors.heart} fullWidth>
                    <textarea
                        id="heart"
                        className={inputStyles.inputField}
                        name="heart"
                        value={form.heart}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={300}
                        rows={2}
                        placeholder="e.g. Regular rhythm, no murmurs detected"
                        required
                    />
                </ModalField>

                <ModalField label="Allergies" htmlFor="allergies" error={errors.allergies} fullWidth>
                    <textarea
                        id="allergies"
                        className={inputStyles.inputField}
                        name="allergies"
                        value={form.allergies}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={500}
                        rows={4}
                        placeholder="e.g. Peanuts, dust mites. Carries emergency antihistamine during school hours."
                        required
                    />
                </ModalField>

                <ModalField label="Health History" htmlFor="healthHistory" error={errors.healthHistory} fullWidth>
                    <textarea
                        id="healthHistory"
                        className={inputStyles.inputField}
                        name="healthHistory"
                        value={form.healthHistory}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={1000}
                        rows={4}
                        placeholder="e.g. Mild asthma diagnosed at age 6, well controlled with inhaler."
                        required
                    />
                </ModalField>

                <ModalFooter>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleClear}
                        disabled={isSubmitting}
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </ModalFooter>
            </ModalForm>
        </Modal>
    );
};

export default StudentHealthRecordUpdateModal; 