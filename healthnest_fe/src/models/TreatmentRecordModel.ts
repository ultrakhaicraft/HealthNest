export interface TreatmentRecordViewModel {
  id: string;
  studentId: string;
  studentName: string;
  studentHealthRecordId: string;
  recordDate: string;
  treatmentTitle?: string | null;
  description?: string | null;
  status?: string | null;
}