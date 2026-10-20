//Store Constant Value in Application Level
export enum UserRole {
  Parent = 'Parent',
  Student = 'Student',
  Nurse = 'SchoolNurse',
  Admin = 'Admin',
}

export const MedicineRequestStatuses: string[] = ["Pending", "Approved", "Rejected", "Deleted"];
export const RecordStatuses: string[] = ['Active', 'Inactive'];
export type RecordStatus = 'Active' | 'Inactive' | '';

export const NURSE_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/nurse' },
  { label: 'User Profile', path: '/nurse/user-profile' },
  { label: 'Medicine', path: '/nurse/medicines' },
  { label: 'Incident Report', path: '/nurse/incidents' },
  { label: 'Medicine Request', path: '/nurse/medicine-requests' },
  { label: 'Medical Supply', path: '/nurse/medical-supplies' },
  { label: 'Student Health Record', path: '/nurse/student-health-record' },
  { label: 'Vaccine Record', path: '/nurse/vaccine-record' },
  { label: 'Treatment Record', path: '/nurse/treatment-record' }

];

export const PARENT_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/parent' },
  { label: 'Medicine Request', path: '/parent/medicine-request' },
  { label: 'Student Health Record', path: '/parent/student-health-record' },
  { label: 'User Profile', path: '/parent/user-profile' },
  { label: 'Link Student', path: '/parent/link-student-to-parent' },

];

export const ADMIN_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/admin' },
];

export const STUDENT_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/student' },
];