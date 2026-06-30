import UserHomeNavBar from '../../../components/User_homepage/horizontal-nav-bar';
import Footer from '../../../components/Landing_Page/footer';
import RecordEmptyView from '../../../components/Student_Health_Record/EmptyRecordView'

import '../../CSS/MedicalRecord.css'; // Importing CSS styles for the medical record form
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../../../components/Notification/Toast';
import MedicalRecordView from '../../../components/Student_Health_Record/MedicalRecordView';
import { StudentHealthRecordDetail, StudentHealthRecordService } from '../../../feature/API/StudentHealthRecordService';
import { AccountDetail } from '../../../feature/API/AccountService';

// View Student Health Record Component - This is the entry point
//TODO:
//Call an api to get Record View Detail, however in some situation
//1. After the user perform create or update the Health Record from StudentHealthRecord service
//2. If there is a Health Record Detail json object in localStorage, do not call API to prevent unnecessary loading time
//3. If there is a change in detail in localStorage, connection with rule 1, call the view detail api
export default function ViewStudentHealthRecordPage() {
      const navigate = useNavigate();
      const location = useLocation();

      const [error, setError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [isRecordDetailEmpty, setIsRecordDetailEmpty]= useState(false);

      // State to hold record data
      const [viewData, setViewData] = useState<StudentHealthRecordDetail | undefined>();
      const [parentName, setParentName]= useState('');
      
      // State for toast notifications
      const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

      useEffect(() => {
          // We define an async function inside useEffect to handle the logic
          const loadRecordDetail = async () => {
            const storedRecord = localStorage.getItem('healthRecordDetail');

            // Record is found in localStorage 
            if (storedRecord) {
              try {
                // Parse the stored data and tell TypeScript its shape
                const recordDetail = JSON.parse(storedRecord) as StudentHealthRecordDetail;
                
                // Set state with the loaded data
                setViewData(recordDetail);
                setIsRecordDetailEmpty(false);
                console.log("Loaded record detail from localStorage.");
                
                
                return; 
              } catch (error) {
                console.error("Failed to parse healthRecordDetail from localStorage. It might be corrupted. Fetching from API instead.", error);             
                localStorage.removeItem('healthRecordDetail'); // Good practice to clear corrupted data
              }
            }

            //No valid record in localStorage, so fetch from API 
            console.log("No valid record in localStorage, attempting to fetch from API.");
            
            const storedAccount = localStorage.getItem('accountDetail');
            if (!storedAccount) {
              console.warn('No account detail found in localStorage. Cannot fetch record.');
              setIsRecordDetailEmpty(true); // We can't proceed, so the record is effectively empty/unavailable.
              return;
            }

            let parentData: AccountDetail;
            try {
              parentData = JSON.parse(storedAccount) as AccountDetail;
            } catch (error) {
                console.error("Failed to parse accountDetail. Cannot fetch record.", error);
                setIsRecordDetailEmpty(true);
                return;
            }
            
            // Check for the studentId 
            if (!parentData?.studentId) {
              console.error("Missing studentId in accountDetail from localStorage. Cannot fetch record.");
              setIsRecordDetailEmpty(true);
              return;
            }
            
            // call the API
            try {
              setParentName(parentData.fullName);
              const recordDetailFromApi = await StudentHealthRecordService.getDetailByStudentId(parentData.studentId);

              // If the API returns a valid record
              if (recordDetailFromApi) {
                setViewData(recordDetailFromApi);
                setIsRecordDetailEmpty(false);
                // Save the freshly fetched record to localStorage for next time
                localStorage.setItem('studentHealthRecordDetail', JSON.stringify(recordDetailFromApi));
                console.log("Successfully fetched and stored new record detail.");
              } else {
                // The API returned null, meaning no record exists for this student
                setIsRecordDetailEmpty(true);
                console.log("No record detail found on the server for this student.");
              }
            } catch (apiError) {
              console.error("An error occurred while fetching the health record:", apiError);
              setIsRecordDetailEmpty(true); // Treat API errors as an "empty" state for the UI
            }
          };

          // Call the function
          loadRecordDetail();

      }, []); // The empty dependency array ensures this runs only once when the component mounts
      

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
        <main className={`main-content ${isRecordDetailEmpty ? 'adjust-for-empty-record' : ''}`}>
        {isRecordDetailEmpty ? (
          <div className="empty-display-wrapper">
            <RecordEmptyView />
          </div>
        ) : (
          <div className="form-wrapper">
            <MedicalRecordView 
              error={error}
              parentName={parentName}
              viewData={viewData ?? null}
            />
          </div>
        )}
      </main>
        <Footer />
      </div>
  );
}











