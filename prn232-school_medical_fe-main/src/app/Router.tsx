
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '../components/spinner';
import { ProtectedRoute } from './ProtectedRoute';


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
const ParentHomepage = React.lazy(() => import('./pages/parent_area/ParentContainerPage'));
const CreateStudentHealthRecordForm = React.lazy(() => import('../app/pages/parent_area/CreateStudentHealthRecord-page'));
const ViewStudentHealthRecordPage = React.lazy(() => import('../app/pages/parent_area/ViewStudentHealthRecord-page'));
const ParentMedicineRequestCRUDPage = React.lazy(() => import('./pages/parent_area/ParentMedicineRequestCRUD-page'));
const ParentUserProfile = React.lazy(() => import('../app/pages/ParentUserProfile-Page'));
const LinkStudentPage = React.lazy(() => import('../app/pages/LinkingStudent-Page'));

//Nurse
const NurseHomepage = React.lazy(() => import('../app/pages/nurse_area/NurseHome-page'));
const MedicineCRUDPage = React.lazy(() => import('../app/pages/nurse_area/MedicineCRUD-page'));
const MedicalSupplyCRUDPage = React.lazy(() => import('../app/pages/nurse_area/MedicalSupplyCRUD-page'));
const IncidentRecordCRUDPage = React.lazy(() => import('../app/pages/nurse_area/IncidentRecordCRUD-page'));


//Others
const UnauthorizedPage = React.lazy(() => import('../app/pages/Unauthorized-Page'));
const StudentHealthRecordList = React.lazy(() => import('../components/Student_Health_Record/StudentHealthRecordList'));
const StudentHealthRecordDetailDisplay = React.lazy(() => import('../components/Student_Health_Record/StudentHealthRecordDetailDisplay'));
const MedicalRecordView = React.lazy(() => import('../components/Student_Health_Record/MedicalRecordView'));

enum UserRole {
  Parent = 'Parent',
  Student = 'Student',
  Nurse = 'SchoolNurse',
  Admin = 'Admin',
}


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
        <Route path="/parentHomepage" element={
          <ProtectedRoute allowedRoles={[UserRole.Parent]}><ParentHomepage /></ProtectedRoute>
        } />
        <Route path="/studentHomepage" element={
          <ProtectedRoute allowedRoles={[UserRole.Student]}><StudentHomepage /></ProtectedRoute>
        } />
        <Route path="/nurseHomepage" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse]}><NurseHomepage /></ProtectedRoute>
        } />
        <Route path="/createStudentHealthRecord" element={
          <ProtectedRoute><CreateStudentHealthRecordForm /></ProtectedRoute>
        } />
        <Route path="/viewStudentHealthRecord" element={
          <ProtectedRoute><ViewStudentHealthRecordPage /></ProtectedRoute>
        } />
        <Route path="/nurse/medicines" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse]}><MedicineCRUDPage /></ProtectedRoute>
        } />
        <Route path="/nurse/medicalSupplies" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse]}><MedicalSupplyCRUDPage /></ProtectedRoute>
        } />
        <Route path="/nurse/incidents" element={
          <ProtectedRoute allowedRoles={[UserRole.Nurse]}><IncidentRecordCRUDPage /></ProtectedRoute>
        } />
        <Route path="/parentUserProfile" element={
          <ProtectedRoute allowedRoles={[UserRole.Parent]}><ParentUserProfile /></ProtectedRoute>
        } />
        
        <Route path="/parent/requestMedicine" element={
          <ProtectedRoute allowedRoles={[UserRole.Parent]}><ParentMedicineRequestCRUDPage /></ProtectedRoute>
        } />
        <Route path="/assignStudentToParent" element={
          <ProtectedRoute><LinkStudentPage /></ProtectedRoute>
        } />
        <Route path="/nurse/records" element={
          <ProtectedRoute><StudentHealthRecordList /></ProtectedRoute>
        } />
        <Route path="/nurse/records/:id" element={
          <ProtectedRoute><StudentHealthRecordDetailDisplay /></ProtectedRoute>
        } />

        {/*<Route path="/parent/medical-record" element={
          <ProtectedRoute><MedicalRecordView /></ProtectedRoute>
        } />*/}
      </Routes>
    </Suspense>
  )
}