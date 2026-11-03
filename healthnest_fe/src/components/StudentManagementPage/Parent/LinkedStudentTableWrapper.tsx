import { StudentDetailModel } from "../../../models/AccountSubclassModels/StudentModel";
import styles from '../../../CSS/Parent/LinkedStudentTableWrapper.module.css';
import { getHealthTone, HealthTone } from "../../../feature/StudentHealthStatus";
import avatarImage from '../../../../public/DefaultUserPfp.jpg';

const FALLBACK_AVATAR = avatarImage;
const TONE_CLASS: Record<HealthTone, string> = {
    good: styles.toneGood,
    warning: styles.toneWarning,
    critical: styles.toneCritical,
    neutral: styles.toneNeutral,
};

interface LinkedStudentTableWrapperProps {
    students: StudentDetailModel[];
    loading?: boolean;
    error?: string | null;
    removingStudentId: string | null;
    onRemoveLink: (studentId: StudentDetailModel) => void;

}

const LinkedStudentTableWrapper = ({
    students,
    loading = false,
    error = null,
    removingStudentId = null,
    onRemoveLink,
}: LinkedStudentTableWrapperProps) => {
    const renderBody = () => {
        if (error) return <p className={styles.error}>{error}</p>

        if (loading && students.length == 0) {
            return <p className={styles.message}>Loading your children...</p>;

        }

        if (students.length == 0) {
            return (
                <div className={styles.empty}>
                    <p>No student is linked to your account yet.</p>
                    <p className={styles.hint}>
                        Once a school nurse approves a link request, your child will appear here.
                    </p>
                </div>
            );
        }

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <caption className={styles.srOnly}>Students linked to your account</caption>
                    <thead>
                        <tr>
                            <th scope="col">Student</th>
                            <th scope="col">Class</th>
                            <th scope="col">Health status</th>
                            <th scope="col" className={styles.actionsColumn}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            const tone = getHealthTone(student.currentHealthStatus);
                            const removing = removingStudentId === student.id;
                            const name = student.fullName ?? 'N/A';

                            return (
                                <tr key={student.id}>
                                    <td>
                                        <div className={styles.studentCell}>
                                            <img
                                                src={student.avatarUrl && student.avatarUrl !== 'Empty' ? student.avatarUrl : FALLBACK_AVATAR}
                                                alt="studentImageAvatar"
                                                className={styles.avatar}
                                            />
                                            <span className={styles.studentName}>{name}</span>

                                        </div>
                                    </td>
                                    <td>{student.class ?? 'N/A'}</td>
                                    <td>
                                        <span className={`${styles.statusPill} ${TONE_CLASS[tone]}`}>
                                            <span className={styles.statusDot} aria-hidden="true" />
                                            {student.currentHealthStatus || 'Not recorded'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={styles.removeButton}
                                            disabled={removing}
                                            aria-label={`Remove link to ${name}`}
                                            onClick={() => onRemoveLink(student)}>
                                            {removing ? 'Removing..' : 'Remove link'}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Linked children
                    {students.length > 0 && <span className={styles.countBadge}>{students.length}</span>}
                </h2>
                <p className={styles.subtitle}>Students whose health information you can access.</p>

            </div>
            {renderBody()}

        </section>
    )
}

export default LinkedStudentTableWrapper;