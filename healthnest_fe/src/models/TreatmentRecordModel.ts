import { RecordStatus } from "../feature/Constant";
import { PageinationParams } from "./ApiClientModel";

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

export interface TreatmentRecordCreateModel {
  treatmentTitle: string;
  description: string;
}

export interface TreatmentRecordUpdateModal extends TreatmentRecordCreateModel {
  status: string;
}

export interface TreatmentRecordQuery extends PageinationParams {
  treatmentTitle?: string;
  status?: RecordStatus;
  pageNumber?: number;
  pageSize?: number;
}