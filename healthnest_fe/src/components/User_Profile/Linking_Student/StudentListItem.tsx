import { AccountView } from "../../../feature/API/AccountService";
import { IconPlus } from "../../IconList";

interface StudentListItemProps {
    student: AccountView;
    handleLink: (student: AccountView) => void;
}
const StudentListItem = ({ student, handleLink }: StudentListItemProps) => {


    return (
        <div className="student-list-item">
            <div className="student-info">
                <img src="/assets/PRN_Avatar.svg" alt={student.fullName} className="student-avatar" />
                <div>
                    <div className="student-name">{student.fullName}</div>
                    <div className="student-email">{student.email}</div>
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