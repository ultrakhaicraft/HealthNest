import { IconGroup } from "../../IconList";
import StudentListItem from "./StudentListItem";
import styles from '../../../CSS/Parent/LinkingWithStudent.module.css'
import { AccountView } from "../../../models/AccountModel";


interface StudentListProps {
    students: AccountView[];
    handleLink: (student: AccountView) => void;

}

const StudentList = ({ students, handleLink, }: StudentListProps) => (
    <div className={styles.studentListContainer}>
        <div className={styles.studentListHeader}>
            <IconGroup className={styles.icon} />
            <div>
                <h2>Available Students</h2>
                <p>Select a student to link to your account</p>
            </div>
        </div>
        <div className={styles.studentList}>
            {students.length > 0 ? (
                students.map((student) => (
                    <StudentListItem key={student.id} student={student} handleLink={handleLink} />
                ))
            ) : (
                <div className={styles.noStudentFound}>
                    <p>No student found. Please try again later.</p>
                </div>
            )}
        </div>
    </div>
);



export default StudentList;