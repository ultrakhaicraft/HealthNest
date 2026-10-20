import { RecordStatus } from "../feature/Constant";
import { TreatmentRecordViewModel } from "./TreatmentRecordModel";
import { VaccineRecordViewModel } from "./VaccineRecordModel";

export interface StudentHealthRecordViewModel {
  id: string;
  studentId: string;
  studentName: string;
  createdBy: string;
  createdDateTime: string;
  updatedDateTime: string;
  status?: string | null;
}

export interface StudentHealthRecordDetailModel {
  id: string;
  studentId: string;
  studentName: string;
  createdBy: string;
  createdByName: string;
  height?: number | null;
  weight?: number | null;
  allergies?: string | null;
  healthHistory?: string | null;
  vision?: string | null;
  earNoseAndMouth?: string | null;
  teeth?: string | null;
  bloodProfile?: string | null;
  bloodPressure?: string | null;
  heart?: string | null;
  status: string;
  createdDateTime: string;
  updatedDateTime: string;
  vaccineRecordViewModels: VaccineRecordViewModel[];
  treatmentRecordViewModels: TreatmentRecordViewModel[];
}

export interface StudentHealthRecordCreateModel {
  studentId: string;
  createdBy: string;
  height: number | null;
  weight: number | null;
  allergies: string;
  healthHistory: string;
  vision: string;
  earNoseAndMouth: string;
  teeth: string;
  bloodProfile: string;
  bloodPressure: string;
  heart: string;
}

export interface StudentHealthRecordUpdateModel {
  height: number | null;
  weight: number | null;
  allergies: string;
  healthHistory: string;
  vision: string;
  earNoseAndMouth: string;
  teeth: string;
  bloodProfile: string;
  bloodPressure: string;
  heart: string;
  status: string;
}

export interface StudentHealthRecordQuery {
  studentName?: string;
  status?: RecordStatus;
  pageNumber?: number;
  pageSize?: number;
}