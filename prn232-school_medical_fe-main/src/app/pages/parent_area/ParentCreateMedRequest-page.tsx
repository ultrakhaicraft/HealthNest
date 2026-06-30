
import Footer from '../../../components/Landing_Page/footer';
import '../../CSS/MedicalRecord.css'; // Importing CSS styles for the medical record form
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../../../components/Notification/Toast';
import { AccountDetail } from '../../../feature/API/AccountService';
import MedicineRequestForm from '../../../components/MedicineRequest/MedicineRequestForm';
import { MedicineRequestCreation, MedicineRequestService } from '../../../feature/API/MedicineRequestService';

// Create MedicineRequest Component - This is the entry point
export default function CreateMedicineRequest() {
  const navigate = useNavigate();


  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State to hold form data
  const [formData, setFormData] = useState({
    description: ''
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

      const payload: MedicineRequestCreation = {
        requestBy: parentData.id,
        forStudent: parentData.studentId,
        description: formData.description
      };

      console.log(payload);

      await MedicineRequestService.create(payload);

      console.log("If it reach this, then create has been called")
      setToast({
        isVisible: true,
        message: 'Student health record created successfully!',
        type: 'success'
      });
      setIsLoading(false)
      //Wait for 3 seconds

      //Navigate back to View
      navigate("/requestMedicine")

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
      
      <div className="screen-header">
        <Link className="back-link" to="/requestMedicine">
          Return
        </Link>
        <h1 className="screen-title">Create Student Health Record</h1>
      </div>
      <main className="main-content">
        <div className="form-wrapper">
          <MedicineRequestForm
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











