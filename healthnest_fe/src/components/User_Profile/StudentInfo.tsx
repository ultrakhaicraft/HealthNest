import { useEffect, useState } from 'react';
import { IconStudent } from '../../components/IconList';
import { Link } from 'react-router-dom';
import styles from '../../CSS/Components/UserProfile.module.css';
import { StudentDetailModel } from '../../models/AccountSubclassModels/StudentModel';


interface StudentInfoProp {
    students: StudentDetailModel[]
    loading: boolean
    error: string | null
}

const LINK_STUDENT_PATH = '/parent/link-student-to-parent';

const StudentInfo = ({ students, loading = false, error = null }: StudentInfoProp) => {
    const renderBody = () => {
        // Check loading first, otherwise "No student linked" flashes while the fetch is in flight
        if (loading) return <p className={styles.studentId}>Loading students...</p>;
        if (error) return <p className={styles.errorText}>{error}</p>;

        if (students.length === 0) {
            return (
                <div className={styles.emptyState}>
                    <p className={styles.studentId}>No student linked to this account.</p>
                    <Link to={LINK_STUDENT_PATH} className="button button-primary no-link">
                        Link your student to you here
                    </Link>
                </div>
            );
        }

        return (
            <>
                <ul className={styles.studentList}>
                    {students.map(student => (
                        <StudentListItem key={student.id} student={student} />
                    ))}
                </ul>
                <Link to={LINK_STUDENT_PATH} className={styles.linkAnother}>
                    + Link another student
                </Link>
            </>
        );
    };

    return (
        <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
                <h2 className={styles.infoCardTitle}>
                    <IconStudent className={styles.greenIcon} /> Student Information
                </h2>
            </div>
            {renderBody()}
        </div>
    );
};

const StudentListItem = ({ student }: { student: StudentDetailModel }) => (
    <li className={styles.studentItem}>
        <img
            src={student.avatarUrl || '/assets/PRN_Avatar.svg'}
            alt={student.fullName ?? 'Student'}
            className={styles.studentAvatar}
        />
        <div className={styles.studentItemDetails}>
            <h3 className={styles.studentName}>{student.fullName ?? 'N/A'}</h3>
            <p className={styles.studentId}>Student ID: {student.id}</p>
            <div className={styles.studentMeta}>
                <span><label>Class</label>{student.class ?? 'N/A'}</span>
                <span><label>Health Status</label>{student.currentHealthStatus ?? 'N/A'}</span>
            </div>
        </div>
    </li>
);

export default StudentInfo;


