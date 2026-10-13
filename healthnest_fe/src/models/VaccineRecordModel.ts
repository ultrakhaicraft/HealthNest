export interface VaccineRecordViewModel {
  id: string;
  studentId: string;
  studentName: string;
  studentHealthRecordId: string;
  recordDate: string;              // ISO date string; parse with `new Date(...)` when needed
  vaccineTitle?: string | null;
  description?: string | null;
  status?: string | null;
}