import { IconPlus } from "../../IconList";
import styles from '../../../CSS/Parent/LinkingWithStudent.module.css'
import { AccountViewModel } from "../../../models/AccountModel";

interface StudentListItemProps {
    student: AccountViewModel;
    handleLink: (student: AccountViewModel) => void;
}
const StudentListItem = ({ student, handleLink }: StudentListItemProps) => {


    return (
        <div className={styles.studentListItem}>
            <div className={styles.studentInfo}>
                <img src="/assets/PRN_Avatar.svg" alt={student.fullName} className={styles.studentAvatar} />
                <div>
                    <div className={styles.studentName}>{student.fullName}</div>
                    <div className={styles.studentEmail}>{student.email}</div>
                </div>
            </div>
            <button className="button button-primary" onClick={() => handleLink(student)}>
                <IconPlus className="icon" />
                Link
            </button>
        </div>
    );
};

export default StudentListItem;