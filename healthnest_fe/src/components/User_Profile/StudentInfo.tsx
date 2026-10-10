import { useEffect, useState } from 'react';
import { IconStudent} from '../../components/IconList'; 
import { Link } from 'react-router-dom';
import styles from '../../CSS/Components/UserProfile.module.css';


interface StudentInfoProp{
    studentName: string;
    studentId: string;
}

const StudentInfo = ({ studentName, studentId } : StudentInfoProp) => {
     

    return (
        <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
                <h2 className={styles.infoCardTitle}><IconStudent className="icon" /> Student Information</h2>
            </div>
            <div className={styles.studentInfoContent}>
                <img src='/assets/PRN_Avatar.svg' alt="Student Avatar" className={styles.studentAvatar} />
                <div className={styles.studentDetails}>
                    {studentId ? (
                        <>
                        <h3>{studentName}</h3>
                        <p className={styles.studentId}>Student ID: {studentId}</p>
                        </>
                    ) : (
                        <p className={styles.studentId} >No student linked to this account.</p>
                    )}
                </div>
            </div>
            <div className={styles.infoGrid} style={{marginTop: '1rem'}}>
                {studentId ? (
                    <>
                        <div className={styles.infoItem}>
                            <label>Class</label>
                            <p>11-A</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Homeroom Teacher</label>
                            <p>Mikeson</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Academic Year</label>
                            <p>2024-2025</p>
                        </div>
                    </>
                ) : (
                     <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                        <Link to="/assignStudentToParent" className="button button-primary no-link " style={{marginTop: '1rem'}}>
                            Link your student to you here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentInfo


