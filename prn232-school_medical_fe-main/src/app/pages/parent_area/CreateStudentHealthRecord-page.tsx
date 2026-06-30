
import UserHomeNavBar from '../../../components/User_homepage/horizontal-nav-bar';
import Footer from '../../../components/Landing_Page/footer';

import MedicalRecordForm from '../../../components/Student_Health_Record/MedicalRecordForm'; // Importing the medical record form component

import '../../CSS/MedicalRecord.css'; // Importing CSS styles for the medical record form
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StudentHealthRecordCreationData, StudentHealthRecordService } from '../../../feature/API/StudentHealthRecordService';
import { Toast } from '../../../components/Notification/Toast';
import { AccountDetail } from '../../../feature/API/AccountService';

// Create Student Health Record Component - This is the entry point
export default function CreateStudentHealthRecordPage() {
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

  // State for toast notifications
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });




  // Handlers for form input changes and submission        

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on new input
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    console.log("Start submitting");
    try {
      const stored = localStorage.getItem('accountDetail');
      let parentData: AccountDetail | null = null
      if (stored) {
        parentData = JSON.parse(stored);
      } else {
        console.warn('No account detail found in local storage')
        return;
      }

      if (!parentData?.studentId || !parentData?.id) {
        console.error("Missing studentId or createdBy in localStorage");
        return;
      }

      const payload: StudentHealthRecordCreationData = {
        studentName: parentData.studentName,
        studentId: parentData.studentId,
        createdBy: parentData.id,
        height: parseFloat(formData.height),
        allergies: formData.allergies,
        chronicDiseases: formData.chronicDiseases,
        vision: formData.vision,
        hearing: formData.hearing,
      };

      await StudentHealthRecordService.create(payload);

      console.log("If it reach this, then create has been called")
      setToast({
        isVisible: true,
        message: 'Student health record created successfully!',
        type: 'success'
      });
      setIsLoading(false)
      //Wait for 3 seconds

      //Navigate back to View
      navigate("/viewStudentHealthRecord")

    } catch (err: any) {
      console.error(err);
      console.log(err?.response?.data?.message || 'Failed to create record')
      setToast({
        isVisible: true,
        message: err?.response?.data?.message || 'Failed to create record',
        type: 'error'
      })
      setIsLoading(false)
    }
  };

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











