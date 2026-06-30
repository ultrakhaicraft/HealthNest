import { FormEvent, useCallback, useEffect, useState } from "react";
import { IconPlus, IconBack, IconLink, IconSearch, IconGroup } from "../../components/IconList";
import { Link, useNavigate } from "react-router-dom";
import { accountService, AccountView, GetAllAccountsParams } from "../../feature/API/AccountService";
import '../CSS/LinkingWithStudent.css'; // Assuming you have a CSS file for styling
import SearchForm from "../../components/User_Profile/Linking_Student/SearchForm";
import StudentList from "../../components/User_Profile/Linking_Student/StudentList";
import { ConfirmationModal } from "../../components/ConfirmationModal";


const LinkStudentPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<AccountView[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<AccountView | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const getAllStudents = useCallback(async (fullName: string, email: string, pageNumber: number) => {
        try {
            // Create GetAllAccountsParams
            const queryParam: GetAllAccountsParams = {
                FullName: fullName,
                Email: email,
                Role: 'Student',
                Status: 'NotLinked',
                PageNumber: pageNumber,
                PageSize: 5
            };

            //Response contain students list
            const response = await accountService.getAll(queryParam);
            if (response && response.data) {
                console.log('Students loaded successfully:', response.data);
                return response.data; // Return the list of students
            } else {
                console.error('No students found');
            }
        } catch (error) {
            console.error('Failed to load students:', error);
        }
    }, []);


    // Load students from API
    useEffect(() => {
        const InItStudents = async () => {
            const students = await getAllStudents("", "", 1);
            if (students) {
                setFilteredStudents(students); // ✅ Safe assignment
            } else {
                setFilteredStudents([]); // or handle empty result
            }
        };
        InItStudents();
    }, [getAllStudents]); // Load students on component mount

    const openConfirmation = (student: AccountView) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleLink = async () => {
        try {
            //Add confirmation
            if (!selectedStudent) return;

            //Add Linking logic here
            console.log("Linking student...");
            const parentId = localStorage.getItem("userId");

            if (!parentId) {
                console.warn("Parent ID not found in localStorage");
                return;
            }
            console.log(`Linking student ${selectedStudent.id} to parent ${parentId}`);
            await accountService.link(parentId, selectedStudent.id);
            setIsModalOpen(false);
            //Go back to parent profile page
            navigate('/parentUserProfile');
        } catch (error) {
            console.error("Failed to link student:", error);
            alert("Failed to link student. Please try again later.");
        }
    };


    const handleSearch = async (e: FormEvent<Element>) => {
        e.preventDefault();
        console.log(`Searching for: ${searchTerm}`);
        const students = await getAllStudents(searchTerm, "", 1);
        if (students) {
            setFilteredStudents(students); // ✅ Safe assignment
        } else {
            setFilteredStudents([]); // or handle empty result
        }
    };




    return (
        <div className="page-wrapper">
            <Link className="back-link" to="/parentUserProfile">
                <IconBack />
                <span>Back</span>
            </Link>

            <PageHeader />
            <SearchForm
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />
            <StudentList students={filteredStudents} handleLink={openConfirmation} />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLink}
                title="Confirm Linking"
                message={`Are you sure you want to link student "${selectedStudent?.fullName}" to your account?`}
                confirmText="Yes, Link"
                cancelText="Cancel"
                type="info"
            />
        </div>
    );
};

const PageHeader = () => (
    <header className="page-header">
        <div className="page-header-icon">
            <IconLink />
        </div>
        <h1>Link Student to Account</h1>
        <p>Search and select a student to link to your account</p>
    </header>
);









export default LinkStudentPage;

