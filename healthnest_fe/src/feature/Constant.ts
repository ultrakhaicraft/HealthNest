import { ReactNode } from "react";
import { IconHealthCheckup, IconHome, IconIncidentReport, IconLogout, IconMedical, IconMedicine, IconStudentRecord, IconVaccine } from "./IconList";
import { IncidentRecordCountPerYear } from "./API/DashboardService";


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
export type LinkRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';


export const NURSE_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/nurse' },
  { label: 'User Profile', path: '/nurse/user-profile' },
  { label: 'Medicine', path: '/nurse/medicines' },
  { label: 'Incident Report', path: '/nurse/incidents' },
  { label: 'Medicine Request', path: '/nurse/medicine-requests' },
  { label: 'Medical Supply', path: '/nurse/medical-supplies' },
  { label: 'Student Health Record', path: '/nurse/student-health-record' },
  { label: 'Vaccine Record', path: '/nurse/vaccine-record' },
  { label: 'Treatment Record', path: '/nurse/treatment-record' },
  { label: 'Student Link Request', path: '/nurse/student-link-request' },

];

export const PARENT_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/parent' },
  { label: 'Medicine Request', path: '/parent/medicine-request' },
  { label: 'Student Health Record', path: '/parent/student-health-record' },
  { label: 'User Profile', path: '/parent/user-profile' },
  { label: 'Student', path: '/parent/student' },

];

export const ADMIN_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/admin' },
  { label: 'User Management', path: '/admin/user-management' },
  { label: 'Health Checkup', path: '/admin/health-checkup' },
  { label: 'Vaccine', path: '/admin/vaccine' },
];

export const STUDENT_NAV_ROUTES: { label: string; path: string }[] = [
  { label: 'Home', path: '/student' },
  { label: 'Student Health Record', path: '/student/student-health-record' },

];


export const MONTHS: { key: keyof Omit<IncidentRecordCountPerYear, 'year'>; label: string }[] = [
  { key: 'january', label: 'Jan' },
  { key: 'february', label: 'Feb' },
  { key: 'march', label: 'Mar' },
  { key: 'april', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'june', label: 'Jun' },
  { key: 'july', label: 'Jul' },
  { key: 'august', label: 'Aug' },
  { key: 'september', label: 'Sep' },
  { key: 'october', label: 'Oct' },
  { key: 'november', label: 'Nov' },
  { key: 'december', label: 'Dec' },
];


