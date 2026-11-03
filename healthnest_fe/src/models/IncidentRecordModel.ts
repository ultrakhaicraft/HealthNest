import { PageinationParams } from "./ApiClientModel";

export interface IncidentRecordView {
  id: string;
  studentId: string;
  studentName?: string;
  incidentType: string;
  dateOccurred: string;
  status: string;
}

export interface IncidentRecordViewDetail extends IncidentRecordView {
  handleBy: string;
  handleByName?: string;
  description: string;

}

export interface IncidentRecordCreate {
  studentId: string;
  handleBy: string;
  incidentType: string;
  description: string;
  dateOccurred: string;
  status: string;
}

export interface IncidentRecordUpdate extends IncidentRecordCreate {
}

export interface IncidentRecordQueryParams extends PageinationParams {
  Status?: string;
  StudentName?: string;
  DateFrom?: string;
  DateTo?: string;
  SortByLatest?: boolean;
}
