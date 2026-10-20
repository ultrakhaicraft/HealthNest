import { RecordStatus } from "../feature/Constant";
import { PageinationParams } from "./ApiClientModel";

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

export interface VaccineRecordCreateModel {
  vaccineTitle: string;
  description: string;
}

export interface VaccineRecordUpdateModal extends VaccineRecordCreateModel {
  status: string;
}

export interface VaccineRecordQuery extends PageinationParams {
  vaccineTitle?: string;
  status?: RecordStatus;
  pageNumber?: number;
  pageSize?: number;
}