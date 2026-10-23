import { StudentDetailModel } from "../../models/AccountSubclassModels/StudentModel";
import styles from '../../CSS/Parent/StudentCardView.module.css';
import { Link } from "react-router-dom";
import DefaultAvatar from '../../../public/DefaultUserPfp.jpg';

const MAX_STUDENT_CARDS = 3;
const LINK_STUDENT_PATH = '/parent/link-student-to-parent';

type HealthTone = 'good' | 'warning' | 'critical' | 'neutral';

// Keys are lowercase. Adjust them to the exact strings your backend uses for CurrentHealthStatus.
const HEALTH_STATUS_TONE: Record<string, HealthTone> = {
    healthy: 'good',
    good: 'good',
    'under observation': 'warning',
    sick: 'warning',
    hospitalized: 'critical',
};

const getHealthTone = (status?: string | null): HealthTone =>
    (status && HEALTH_STATUS_TONE[status.trim().toLowerCase()]) || 'neutral';

const TONE_CLASS: Record<HealthTone, string> = {
    good: styles.toneGood,
    warning: styles.toneWarning,
    critical: styles.toneCritical,
    neutral: styles.toneNeutral,
};

interface CardStudentViewProps {
    students: StudentDetailModel[];
    loading?: boolean;
    error?: string | null;
}

export function CardStudentView({ students, loading = false, error = null }: CardStudentViewProps) {
    const visible = students.slice(0, MAX_STUDENT_CARDS);
    const hiddenCount = students.length - visible.length;

    const renderBody = () => {
        // Error first: if the account itself failed to load, the students fetch never starts
        // and loading would otherwise stay true forever.
        if (error) return <p className={styles.studentCardsError}>{error}</p>;
        if (loading) return <p className={styles.studentCardsMessage}>Loading students...</p>;

        if (students.length === 0) {
            return (
                <div className={styles.studentCardsEmpty}>
                    <p>No student is linked to your account yet.</p>
                    <Link to={LINK_STUDENT_PATH} className="button button-primary no-link">
                        Link your student
                    </Link>
                </div>
            );
        }

        return (
            <>
                <div className={styles.studentCardsGrid}>
                    {visible.map(student => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
                <div className={styles.studentCardsFooter}>
                    {hiddenCount > 0 && (
                        <span className={styles.studentCardsCount}>
                            Showing {visible.length} of {students.length} students
                        </span>
                    )}
                    <Link to={LINK_STUDENT_PATH} className="button button-primary no-link">
                        Manage Students
                    </Link>
                </div>
            </>
        );
    };

    return (
        <section className={styles.healthAnnouncementsSection}>
            <div className={styles.announcementsHeader}>
                <span className={styles.announcementsIcon} role="img" aria-label="students">🎓</span>
                <h2 className={styles.announcementsTitle}>Students</h2>
            </div>
            {renderBody()}
        </section>
    );
}

function StudentCard({ student }: { student: StudentDetailModel }) {
    const tone = getHealthTone(student.currentHealthStatus);

    return (
        <article className={`${styles.studentCard} ${TONE_CLASS[tone]}`}>
            <img
                src={student.avatarUrl || DefaultAvatar}
                alt={student.fullName ?? 'Student'}
                className={styles.studentCardAvatar}
            />
            <div className={styles.studentCardIdentity}>
                <h3 className={styles.studentCardName} title={student.fullName}>
                    {student.fullName ?? 'N/A'}
                </h3>
                <p className={styles.studentCardClass}>
                    {student.class ? `Class ${student.class}` : 'Class N/A'}
                </p>
            </div>
            <div className={styles.studentCardStatus}>
                <span className={styles.studentCardStatusLabel}>Health status</span>
                <span className={styles.studentCardStatusValue}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {student.currentHealthStatus || 'Not recorded'}
                </span>
            </div>
        </article>
    );
}