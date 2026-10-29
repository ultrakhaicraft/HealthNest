
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '../feature/Constant';
import { NurseDashboard } from './pages/nurse_area/NurseDashboard-page';
import { Spinner } from '../components/Spinner';


// Lazy load all the pages/routes
//Guest
const Homepage = React.lazy(() => import('../app/pages/guest_area/GuestHome-page'));
const Login = React.lazy(() => import('../app/pages/guest_area/Login-page'));
const Register = React.lazy(() => import('../app/pages/guest_area/Register-page'));
const DisplayBlogsPage = React.lazy(() => import('../app/pages/guest_area/DisplayBlogList-page'));
const BogDetailPage = React.lazy(() => import('../app/pages/guest_area/BlogDetail-page'));

//Student
const StudentHomepage = React.lazy(() => import('../app/pages/student_area/StudentHome-page'));


//Parent
const ParentContainerPage = React.lazy(() => import('./pages/parent_area/ParentContainerPage'));
const ParentHomepage = React.lazy(() => import('./pages/parent_area/ParentHomePage'));
const ParentMedicineRequestCRUDPage = React.lazy(() => import('./pages/parent_area/ParentMedicineRequestCRUD-page'));
const ParentUserProfile = React.lazy(() => import('./pages/parent_area/ParentUserProfile-Page'));
const ManageStudentPage = React.lazy(() => import('./pages/parent_area/StudentManagementPage'));

//Nurse
const NurseHomepage = React.lazy(() => import('../app/pages/nurse_area/NurseHome-page'));
const NurseUserProfile = React.lazy(() => import('../app/pages/nurse_area/NurseUserProfile-Page'));
const MedicineCRUDPage = React.lazy(() => import('../app/pages/nurse_area/MedicineCRUD-page'));
const MedicalSupplyCRUDPage = React.lazy(() => import('../app/pages/nurse_area/MedicalSupplyCRUD-page'));
const IncidentRecordCRUDPage = React.lazy(() => import('../app/pages/nurse_area/IncidentRecordCRUD-page'));
const MedicineRequestCRUDPage = React.lazy(() => import('../app/pages/nurse_area/MedicineRequestCRUD-page'));
const VaccineRecordCRUDPage = React.lazy(() => import('../app/pages/nurse_area/VaccineRecordCRUD-page'));
const TreatmentRecordCRUDPage = React.lazy(() => import('../app/pages/nurse_area/TreatmentRecordCRUD-page'));



//Others
const UnauthorizedPage = React.lazy(() => import('../app/pages/Unauthorized-Page'));
const StudentHealthRecordDetailPage = React.lazy(() => import('../app/pages/shared_area/StudentHealthRecordDetailpage'));
const VaccineTabView = React.lazy(() => import('../components/Student_Health_Record/VaccineTabView'));
const HealthRecordTabView = React.lazy(() => import('../components/Student_Health_Record/HealthRecordTabView'));
const TreatmentTabView = React.lazy(() => import('../components/Student_Health_Record/TreatmentTabView'));
const StudentHealthRecordViewPage = React.lazy(() => import('../app/pages/parent_area/ViewStudentHealthRecord-page'));
const StudentHealthRecordCRUDPage = React.lazy(() => import('../app/pages/nurse_area/StudentHealthRecordCRUD-page'))




// A simple component to center the spinner
const FullPageSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  }}>
    <Spinner size="large" />
  </div>
);

export const AppRouter = () => {



  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<DisplayBlogsPage />} />
        <Route path="/blog/:id" element={<BogDetailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />





        {/* Protected Routes */}
        <Route path="/nurse" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse]}><NurseHomepage /></ProtectedRoute>
        }>
          <Route index element={<NurseDashboard username='' />} />
          <Route path="user-profile" element={<NurseUserProfile />} />
          <Route path="medicines" element={<MedicineCRUDPage />} />
          <Route path="incidents" element={<IncidentRecordCRUDPage />} />
          <Route path="medicine-requests" element={<MedicineRequestCRUDPage />} />
          <Route path="medical-supplies" element={<MedicalSupplyCRUDPage />} />
          <Route path="student-health-record" element={<StudentHealthRecordCRUDPage />} />
          <Route path="vaccine-record" element={<VaccineRecordCRUDPage />} />
          <Route path="treatment-record" element={<TreatmentRecordCRUDPage />} />
        </Route>

        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={[UserRole.Parent]}><ParentContainerPage /></ProtectedRoute>
        } >
          <Route index element={<ParentHomepage />} />
          <Route path="user-profile" element={<ParentUserProfile />} />
          <Route path="medicine-request" element={<ParentMedicineRequestCRUDPage />} />
          <Route path="student" element={<ManageStudentPage />} />
          <Route path="student-health-record" element={<StudentHealthRecordViewPage />} />
        </Route>


        <Route path="/studentHomepage" element={
          <ProtectedRoute allowedRoles={[UserRole.Student]}><StudentHomepage /></ProtectedRoute>
        } />


        <Route path="/student-records/:id" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse, UserRole.Parent]}>
            <StudentHealthRecordDetailPage />
          </ProtectedRoute>
        }>
          <Route index element={<HealthRecordTabView />} />
          <Route path="vaccines" element={<VaccineTabView />} />
          <Route path="treatments" element={<TreatmentTabView />} />
        </Route>





      </Routes>
    </Suspense>
  )
}