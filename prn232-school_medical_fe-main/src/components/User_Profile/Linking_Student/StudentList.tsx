import { AccountView } from "../../../feature/API/AccountService";
import { IconGroup } from "../../IconList";
import StudentListItem from "./StudentListItem";

interface StudentListProps {
    students: AccountView[];
    handleLink: (student: AccountView) => void;

}

const StudentList = ({ students, handleLink, }: StudentListProps) => (
    <div className="student-list-container">
        <div className="student-list-header">
            <IconGroup className="icon" />
            <div>
                <h2>Available Students</h2>
                <p>Select a student to link to your account</p>
            </div>
        </div>
        <div className="student-list">
            {students.length > 0 ? (
                students.map((student) => (
                    <StudentListItem key={student.id} student={student} handleLink={handleLink} />
                ))
            ) : (
                <NoStudentsFound />
            )}
        </div>
    </div>
);

const NoStudentsFound = () => (
    <div className="no-student-found">
        <p>No student found. Please try again later.</p>
    </div>
);

export default StudentList;