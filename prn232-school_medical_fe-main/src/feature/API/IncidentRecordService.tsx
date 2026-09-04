import apiClient, { ApiResponseWrapper, PageinationParams, PaginatedResponse } from '../ApiClient';

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
  StudentId?: string;
  DateFrom?: string;
  DateTo?: string;
  SortByLatest?: boolean;
}



export const IncidentRecordService = {
  getAll: async (params: IncidentRecordQueryParams): Promise<PaginatedResponse<IncidentRecordView>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<IncidentRecordView>>>('/incident-record', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.get<ApiResponseWrapper<IncidentRecordViewDetail>>(`/incident-record/${id}`);
    return response.data.data;
  },

  create: async (data: IncidentRecordCreate): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.post<ApiResponseWrapper<IncidentRecordViewDetail>>('/incident-record', data);
    return response.data.data;
  },

  update: async (id: string, data: IncidentRecordUpdate): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.put<ApiResponseWrapper<IncidentRecordViewDetail>>(`/incident-record/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>(`/incident-record/${id}`);
    return response.data.data;
  },
};