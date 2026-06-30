import { useEffect, useState } from "react";
import Footer from "../../../components/Landing_Page/footer";
import { Toast } from "../../../components/Notification/Toast";
import MedicalRecordForm from "../../../components/Student_Health_Record/MedicalRecordForm";
import UserHomeNavBar from "../../../components/User_homepage/horizontal-nav-bar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StudentHealthRecordDetail, StudentHealthRecordService, StudentHealthRecordUpdate } from "../../../feature/API/StudentHealthRecordService";
import { AccountDetail } from "../../../feature/API/AccountService";


export default function UpdateStudentHealthRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();


  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State to hold form data
  const [formData, setFormData] = useState({
    height: '150',
    allergies: '',
    chronicDiseases: '',
    vision: '',
    hearing: '',
  });

  const [personalData, setPersonalData] = useState({
    studentName: '',
    studentId: '',
    createdBy: ''
  });

  const [recordId, setRecordId] = useState<string>(''); // To hold the record ID if needed

  // State for toast notifications
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });




  // Handlers for form input changes and submission        

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on new input
  };

  //
  useEffect(() => {
    const loadRecordDetail = async () => {
      const storedRecord = localStorage.getItem('studentHealthRecordDetail');

      // Record is found in localStorage 
      if (storedRecord) {
        try {
          // Parse the stored data and tell TypeScript its shape
          const recordDetail = JSON.parse(storedRecord) as StudentHealthRecordDetail;

          // Set state with the loaded data
          setFormData({
            height: recordDetail.height.toString(),
            allergies: recordDetail.allergies,
            chronicDiseases: recordDetail.chronicDiseases,
            vision: recordDetail.vision,
            hearing: recordDetail.hearing,
          });
          setRecordId(recordDetail.id); // Set the record ID 
          setPersonalData({
            studentName: recordDetail.studentName,
            studentId: recordDetail.studentId,
            createdBy: recordDetail.createdBy
          });
          console.log("Loaded record detail from localStorage.");


          return;
        } catch (error) {
          console.error("Failed to parse healthRecordDetail from localStorage. It might be corrupted.", error);
          localStorage.removeItem('studentHealthRecordDetail'); // Good practice to clear corrupted data
          //navigate back to view page
          navigate("/viewStudentHealthRecord");
        }
      } else {
        console.log("No valid record in localStorage");
        return;
      }


    };

    loadRecordDetail();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    try {


      const payload: StudentHealthRecordUpdate = {
        studentName: personalData.studentName,
        studentId: personalData.studentId,
        createdBy: personalData.createdBy,
        height: parseFloat(formData.height),
        allergies: formData.allergies,
        chronicDiseases: formData.chronicDiseases,
        vision: formData.vision,
        hearing: formData.hearing,
      };

      console.log("Payload to be sent: ", payload);

      await StudentHealthRecordService.update(recordId, payload);

      console.log("If it reach this, then update has been called")
      setToast({
        isVisible: true,
        message: 'Student health record update successfully!',
        type: 'success'
      });
      setIsLoading(false)
      //Wait for 3 seconds

      //Navigate back to View
      navigate("/viewStudentHealthRecord")

    } catch (err: any) {
      console.error(err);
      console.log(err?.response?.data?.message || 'Failed to update record')
      setToast({
        isVisible: true,
        message: err?.response?.data?.message || 'Failed to update record',
        type: 'error'
      })
      setIsLoading(false)
    }
  };

  const openModal = () => {

  }
  return (
    <div className="app-container">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      <UserHomeNavBar
        userType='parent' />
      <main className="main-content">
        <Link className='back-link' to="/viewStudentHealthRecord">
          Return
        </Link>
        <div className="form-wrapper">
          <MedicalRecordForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            formData={formData}
          />
        </div>
      </main>
      <Footer />
      
    </div>
  );
}