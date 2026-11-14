export interface ViewVaccineEventStudentModel {
  vaccineeventId: string;
  studentId: string;
  signupDate: string; // ISO date string from API
  status?: string | null;
}

export interface ViewVaccineEventStudentDetailModel extends ViewVaccineEventStudentModel {
  studentName?: string | null;
  resultSummary?: string | null;
  registeredByParent: string;
  checkedBy?: string | null;
  checkedByName?: string | null;
  note?: string | null;
  updatedAt: string;
}

export interface CreateVaccineEventStudentModel {
  studentId: string;
  vaccineEventId: string;
  note?: string | null;
}

export interface CompleteVaccinationRequest {
  resultSummary: string;
}

export interface UpdateNoteRequest {
  note: string;
}

export interface VaccineEventStudentQuery {
  pageIndex: number;
  pageSize: number;
  sortByDateSignUp: boolean;
  participantStatus?: string | null;
  class?: string | null;
}